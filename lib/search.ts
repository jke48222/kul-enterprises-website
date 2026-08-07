/**
 * THE SEARCH ENGINE.
 *
 * The whole site is a few hundred paragraphs of JSON, so the search does not
 * call a server or carry a library: it reads every word once, holds them in
 * memory, and scores them directly. On content this size that is faster than
 * any index would be, and there is nothing to install, break, or pay for.
 *
 * lib/search-data.ts turns the CMS files into the flat records this file
 * reads. components/k/Search.tsx draws the box the results appear in. This
 * file only answers one question: given some typed words, which parts of the
 * site match, and how well.
 *
 * HOW A MATCH IS SCORED, from strongest to weakest:
 *
 *   THE WHOLE WORD        typed "safety", the page says "safety"
 *   THE START OF A WORD   typed "refrig", the page says "refrigerated";
 *                         this is what makes results appear while a word is
 *                         still being typed
 *   ONE OFF THE SPELLING  typed "refridgerated" with its extra d, or two
 *                         letters swapped; a small typo should not turn a
 *                         real page into "no results"
 *   INSIDE A WORD         typed "route" and the page says "reroute"
 *
 * Singular and plural are treated as the same word, so "commitment" finds
 * "commitments". When more than one word is typed, every word has to match
 * somewhere in the same record, and words that sit next to each other on the
 * page the way they were typed score extra, so "kept promise" ranks the
 * sentence that actually says "kept promise" above one that merely contains
 * both words a paragraph apart.
 *
 * A match in a page's title or a section heading outranks the same match in
 * running text, because somebody typing "services" wants the services page
 * before every sentence that mentions the word.
 */

/** One searchable piece of the site, as lib/search-data.ts produces it. */
export type SearchRecord = {
  /** The page it is on, ready to link to. */
  route: string;
  /** The page's name, shown over the excerpt: "About", "Power Only". */
  page: string;
  /** The nearest heading over this text, or "" when it sits under none. */
  section: string;
  /** The words themselves, tokens already filled, markdown already removed. */
  text: string;
  /**
   * What this record is. Titles and headings weigh more than prose, so the
   * services page itself outranks a sentence that mentions services.
   */
  kind: "title" | "heading" | "prose";
};

/** A record that matched, with everything the panel needs to draw it. */
export type SearchHit = {
  record: SearchRecord;
  score: number;
  /**
   * The sentence around the first match, cut to fit one line or two, with
   * every matched word marked so the panel can print it in gold. Kept as
   * plain segments rather than HTML so nothing typed into the box can ever
   * be injected into the page as markup.
   */
  excerpt: { text: string; hit: boolean }[];
};

/** The panel shows one group per page, best page first. */
export type SearchGroup = {
  route: string;
  page: string;
  score: number;
  hits: SearchHit[];
};

/**
 * A record after preparation: its words split out once, lowercased once,
 * accents removed once. Preparing on arrival instead of on every keystroke
 * is what keeps typing instant.
 */
type Prepared = {
  record: SearchRecord;
  /** The record's words, normalised. */
  words: string[];
  /** Where each word starts in the original text, for cutting excerpts. */
  starts: number[];
  /** The matching word lengths in the original text. */
  lengths: number[];
};

/**
 * Lowercase, strip accents, and straighten curly quotes, so "Café" and
 * "cafe" are the same word and an apostrophe never decides a match. This is
 * applied identically to the page's words and the typed ones; a search can
 * only be fair if both sides are cleaned the same way.
 */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
}

/**
 * A word, for matching, is letters and digits. Everything else separates
 * words. Hyphens split, so "48-state" matches a search for "state"; the
 * apostrophe is removed rather than splitting, so "driver's" is one word
 * "drivers" and not "driver" plus a stray "s".
 */
function splitWords(text: string): { words: string[]; starts: number[]; lengths: number[] } {
  const words: string[] = [];
  const starts: number[] = [];
  const lengths: number[] = [];
  const pattern = /[a-z0-9']+/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    words.push(match[0].replace(/'/g, ""));
    starts.push(match.index);
    lengths.push(match[0].length);
  }
  return { words, starts, lengths };
}

/** Prepare every record once. The panel calls this when the index loads. */
export function prepare(records: SearchRecord[]): Prepared[] {
  return records.map((record) => {
    const { words, starts, lengths } = splitWords(normalise(record.text));
    return { record, words, starts, lengths };
  });
}

/**
 * Whether two words are within one slip of each other: a letter added,
 * dropped, changed, or two neighbours swapped. That is the shape of nearly
 * every real typo. Distance two is allowed only for long words, where two
 * slips still leave most of the word intact.
 *
 * Written as the usual two-row edit distance walk with one extra read for
 * the swap, and it gives up early the moment a row can no longer come in
 * under the limit, which is what makes running it against every word cheap.
 */
function within(a: string, b: string, limit: number): boolean {
  if (Math.abs(a.length - b.length) > limit) return false;
  let previous: number[] = [];
  let beforePrevious: number[] = [];
  for (let j = 0; j <= b.length; j++) previous[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const current: number[] = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost,
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        value = Math.min(value, beforePrevious[j - 2] + 1);
      }
      current[j] = value;
      if (value < best) best = value;
    }
    if (best > limit) return false;
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length] <= limit;
}

/** Strip a plural for comparison: promises → promise, taxes → tax. */
function singular(word: string): string {
  if (word.length > 3 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 2 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/**
 * How well one typed word matches one word on the page, or zero.
 * The numbers are ranks, not measurements: all that matters is the order.
 */
function scoreWord(typed: string, word: string): number {
  if (typed === word) return 100;
  if (singular(typed) === singular(word)) return 90;
  if (word.startsWith(typed) && typed.length >= 2) {
    // A longer start is a surer guess: "refrigera" outranks "re".
    return 60 + Math.round((typed.length / word.length) * 25);
  }
  if (typed.length >= 4 && within(typed, word, typed.length >= 8 ? 2 : 1)) {
    return 45;
  }
  if (typed.length >= 4 && word.includes(typed)) return 35;
  return 0;
}

/** The best match for one typed word anywhere in one record. */
function bestInRecord(
  typed: string,
  prepared: Prepared,
): { score: number; at: number } {
  let score = 0;
  let at = -1;
  for (let i = 0; i < prepared.words.length; i++) {
    const value = scoreWord(typed, prepared.words[i]);
    if (value > score) {
      score = value;
      at = i;
      if (value === 100) break;
    }
  }
  return { score, at };
}

/**
 * Cut the sentence around the first matched word down to about this many
 * characters, so every result is one comfortable line or two, not a wall.
 */
const EXCERPT_SPAN = 130;

/**
 * Build the excerpt: a window of the original text around the first match,
 * with every word in the window that matches any typed word marked for the
 * gold print. Titles are short enough to show whole.
 */
function excerpt(
  prepared: Prepared,
  typedWords: string[],
  firstAt: number,
): SearchHit["excerpt"] {
  const { record, words, starts, lengths } = prepared;
  const text = record.text;
  if (words.length === 0) return [{ text, hit: false }];

  const anchor = firstAt >= 0 ? starts[firstAt] : 0;
  let from = Math.max(0, anchor - Math.round(EXCERPT_SPAN / 3));
  let to = Math.min(text.length, from + EXCERPT_SPAN);
  // Pull the window back onto word edges so it never opens mid-word.
  if (from > 0) {
    const space = text.indexOf(" ", from);
    if (space !== -1 && space < anchor) from = space + 1;
  }
  if (to < text.length) {
    const space = text.lastIndexOf(" ", to);
    if (space > anchor) to = space;
  }

  const segments: SearchHit["excerpt"] = [];
  let cursor = from;
  for (let i = 0; i < words.length; i++) {
    if (starts[i] < from || starts[i] >= to) continue;
    const matched = typedWords.some((typed) => scoreWord(typed, words[i]) > 0);
    if (!matched) continue;
    if (starts[i] > cursor) {
      segments.push({ text: text.slice(cursor, starts[i]), hit: false });
    }
    segments.push({
      text: text.slice(starts[i], starts[i] + lengths[i]),
      hit: true,
    });
    cursor = starts[i] + lengths[i];
  }
  if (cursor < to) segments.push({ text: text.slice(cursor, to), hit: false });

  if (from > 0) segments.unshift({ text: "… ", hit: false });
  if (to < text.length) segments.push({ text: " …", hit: false });
  return segments;
}

/** How much each kind of record weighs. Titles beat headings beat prose. */
const KIND_WEIGHT: Record<SearchRecord["kind"], number> = {
  title: 1.7,
  heading: 1.3,
  prose: 1,
};

/** The panel shows at most this many pages, and per page this many lines. */
const MOST_GROUPS = 6;
const MOST_HITS_PER_GROUP = 2;

/**
 * The search itself. Give it the prepared index and whatever has been typed;
 * it hands back the pages that match, best first, each with its best lines.
 */
export function search(index: Prepared[], query: string): SearchGroup[] {
  const typedWords = splitWords(normalise(query)).words.filter(Boolean);
  if (typedWords.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const prepared of index) {
    let total = 0;
    let firstAt = -1;
    let previousAt = -2;
    let adjacent = 0;
    let everyWordFound = true;

    for (const typed of typedWords) {
      const { score, at } = bestInRecord(typed, prepared);
      if (score === 0) {
        everyWordFound = false;
        break;
      }
      total += score;
      if (firstAt === -1) firstAt = at;
      // Words matched in the order typed, sitting next to each other on the
      // page, are almost certainly the phrase the visitor means.
      if (at === previousAt + 1) adjacent += 30;
      previousAt = at;
    }
    if (!everyWordFound) continue;

    total = (total + adjacent) * KIND_WEIGHT[prepared.record.kind];
    // Of two equal matches, the one in fewer words is the more exact.
    total += Math.max(0, 12 - Math.round(prepared.words.length / 12));

    hits.push({
      record: prepared.record,
      score: total,
      excerpt: excerpt(prepared, typedWords, firstAt),
    });
  }

  // Gather by page, keep each page's best lines, rank pages by their best.
  const groups = new Map<string, SearchGroup>();
  for (const hit of hits) {
    const key = hit.record.route;
    const group = groups.get(key);
    if (!group) {
      groups.set(key, {
        route: key,
        page: hit.record.page,
        score: hit.score,
        hits: [hit],
      });
      continue;
    }
    group.score = Math.max(group.score, hit.score);
    group.hits.push(hit);
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      hits: group.hits
        .sort((a, b) => b.score - a.score)
        .slice(0, MOST_HITS_PER_GROUP),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MOST_GROUPS);
}
