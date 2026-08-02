import client from "@/tina/__generated__/client";

/**
 * FETCHING A PAGE FOR THE VISUAL EDITOR, WITHOUT LETTING IT BREAK THE SITE.
 *
 * Tina's visual editor needs three things from the server: the content, the
 * GraphQL query that produced it, and the variables that were passed. The
 * client half of a page hands all three to useTina, which then reopens the
 * query over a live connection so that typing in the sidebar redraws the page
 * as you type, and so that clicking text on the page selects the right field.
 *
 * ------------------------------------------------------------------
 * WHY THIS WRAPPER EXISTS RATHER THAN CALLING THE CLIENT DIRECTLY
 * ------------------------------------------------------------------
 * Before visual editing, every page imported its JSON straight off disk. That
 * has one property worth protecting: the site could not fail to build. There
 * is no network call, no service to be down, no credential to expire.
 *
 * Querying through Tina gives that up. content.tinajs.io is now in the path of
 * a production build, so an outage there, an expired token or a project that
 * has not finished indexing would all stop the site deploying. For a carrier
 * whose website is how brokers reach dispatch, that is the wrong thing to
 * accept in exchange for an editing convenience.
 *
 * So the query is attempted, and if it fails for any reason the page falls
 * back to the JSON it always used. The site renders exactly as it does today;
 * the only thing lost is the live editing connection, which nobody is using at
 * the moment the build runs anyway. The failure is logged loudly rather than
 * swallowed, because a permanently degraded editor should be noticed.
 *
 * This is the same trade as scripts/build.mjs: the editor is allowed to fail,
 * the website is not.
 */

/** What a page hands to its client half. */
export type TinaPage<T> = {
  data: T;
  /** Null when the query failed and the JSON fallback is being used. */
  query: string | null;
  variables: object | null;
};

type QueryResult<T> = { data: T; query: string; variables: object };

/**
 * Runs a Tina query, falling back to the bundled JSON if anything goes wrong.
 *
 * `run` is the query, `fallback` is the shape the page would have had without
 * Tina, and `key` is the field the query returns it under, so the fallback can
 * be wrapped to look like a query result.
 */
/**
 * MEDIA COMES HOME BEFORE IT REACHES A PAGE.
 *
 * When content is fetched through Tina Cloud rather than off disk, every
 * image field comes back rewritten to Tina's CDN:
 *
 *   https://assets.tina.io/<clientId>/truck/truck-body.webp
 *
 * The file it names is the SAME file this repo already serves from
 * public/images (the media store is repo-backed), so the CDN URL buys
 * nothing and costs two real failures: next/image refuses to optimise a
 * host it has not been told about (a 400 and a broken image on the LIVE
 * site, which is exactly what happened on the first Vercel deploy), and it
 * puts a third-party CDN in the path of every photograph on a site whose
 * stated rule is that the editor may fail but the website may not.
 *
 * So every string in a cloud result is walked once, here, and any
 * assets.tina.io URL is folded back to the first-party /images path. The
 * one thing this forbids is uploading media that exists ONLY in Tina's
 * store: media belongs in the repo, where the client owns it.
 */
const TINA_ASSET_URL = /^https:\/\/assets\.tina\.io\/[0-9a-f-]+\//;

function localizeMedia<T>(value: T): T {
  if (typeof value === "string") {
    return (TINA_ASSET_URL.test(value)
      ? value.replace(TINA_ASSET_URL, "/images/")
      : value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeMedia(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = localizeMedia(v);
    }
    return out as unknown as T;
  }
  return value;
}

export async function tinaPage<T>(
  label: string,
  run: () => Promise<QueryResult<T>>,
  fallback: T,
): Promise<TinaPage<T>> {
  try {
    const result = await run();
    return {
      data: localizeMedia(result.data),
      query: result.query,
      variables: result.variables,
    };
  } catch (error) {
    console.warn(
      `\n[tina] Could not reach Tina for "${label}", so the page is being ` +
        `built from content/ directly. The page is complete and correct; it ` +
        `simply will not update live inside the visual editor.\n` +
        `[tina] Reason: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return { data: fallback, query: null, variables: null };
  }
}

export { client };
