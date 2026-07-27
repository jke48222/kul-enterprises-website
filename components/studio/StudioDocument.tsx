import type { StudioDoc } from "@/lib/studio";

/**
 * Re-emits an authored /studio document inside the isolated (studio) root
 * layout: its font links, its CSS, its markup, then its scripts in source
 * order.
 *
 * Entering this route group is always a full document load (a second root
 * layout forces one) and the documents link to each other with plain <a
 * href>, so the inline scripts execute at parse time exactly as authored —
 * no DOMContentLoaded races, no hydration ordering to reason about.
 */
export default function StudioDocument({ doc }: { doc: StudioDoc }) {
  return (
    <>
      {doc.stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: doc.css }} />
      <div dangerouslySetInnerHTML={{ __html: doc.bodyHtml }} />
      {doc.scripts.map((s, i) =>
        s.src ? (
          <script key={`s${i}`} src={s.src} defer={s.defer} />
        ) : (
          <script key={`i${i}`} dangerouslySetInnerHTML={{ __html: s.code ?? "" }} />
        ),
      )}
    </>
  );
}
