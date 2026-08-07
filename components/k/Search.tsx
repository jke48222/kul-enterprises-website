"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Copy from "@/components/k/Copy";
import { fill } from "@/lib/content";
import { prepare, search, type SearchHit } from "@/lib/search";
import searchContent from "@/content/search.json";
import navContent from "@/content/navigation.json";

/**
 * SITE SEARCH
 *
 * Three pieces, all drawn here so they cannot drift apart:
 *
 *   THE CORNER BUTTON   A circle of the same smoked glass as the bar, sitting
 *                       in the top right corner of the window on screens wide
 *                       enough to give it a corner of its own. It firms up as
 *                       the bar does, because the two are the same material
 *                       catching the same light.
 *
 *   THE BAR BUTTON      Below the width where the corner exists, the same
 *                       control folds into the pill next to the menu mark,
 *                       sized to the 44 pixels a thumb needs.
 *
 *   THE PANEL           Not a box floating over the page: the bar itself
 *                       opens. Clicking the magnifier stretches the pill
 *                       downward into the same white panel the services menu
 *                       grows on hover, the one shape Nav.tsx already owns,
 *                       and the search happens inside it. Typing searches
 *                       every word on the site as the letters land; matches
 *                       arrive grouped by page with the matched words printed
 *                       in gold. Arrows walk the list, Enter opens, Escape
 *                       closes, and "command K" or "control K" opens it from
 *                       anywhere without the mouse.
 *
 * The difference from the services panel is the trigger, and it is the whole
 * of the difference: hover opens a menu a visitor is skimming, a click opens
 * a tool they have decided to use, which is why the search never opens by
 * accident and never closes because the pointer wandered.
 *
 * The list's shape is taken from references actually pulled up on Mobbin,
 * in the manner of every shape on this site:
 *
 *   Vapi `593d7acd`      the box on top, results grouped under small capital
 *                        headings, the count in the foot.
 *   Magnific `14ceb943`  and Mistral `8450c1c7`: before anything is typed
 *                        the panel is already useful, a short list of places
 *                        to go rather than an empty room.
 *   Juicebox `2af813bf`  the thin accent bar standing in the margin of the
 *                        row the keyboard is on; here it is gold.
 *
 * The words the search reads come from lib/search-data.ts, and the ranking
 * lives in lib/search.ts. Neither is loaded until the panel first opens, so
 * carrying a search costs the pages nothing.
 *
 * TO CHANGE THE WORDING of the box itself, placeholder, hints and the empty
 * state, edit it at /admin under "Search", which writes content/search.json.
 * The pages listed before anything is typed are the menu's own lists from
 * "Menu & Footer", so the menu and the search can never disagree about what
 * the site contains.
 */

/** The glass the bar hands down so the corner circle matches it exactly. */
export type SearchSurface = { tint: string; sheen: string; shadow: string };

/** Kept identical to GLASS_FILTER in Nav.tsx: one material, two holders. */
const GLASS_FILTER = "blur(20px) saturate(165%)";

/** The id the triggers point at with aria-controls while the panel is out. */
export const SEARCH_PANEL_ID = "k-search-panel";

/**
 * The magnifier. Drawn here rather than shipped from an icon set so the
 * stroke weight, cap and glass-to-handle joint match the bar's line work,
 * and so it inherits whatever colour the control around it is showing.
 */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9.1" cy="9.1" r="5.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.06 13.06L17.2 17.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The small arrow on the rows that are pages rather than passages. */
function GoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7H11M11 7L7.75 3.75M11 7L7.75 10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The corner circle. 56 pixels, centred on the bar's own midline, in the
 * bar's own glass: the reservation that keeps the pill clear of it is the
 * width clamp on the pill in Nav.tsx, and the two agree through the same
 * 1240 breakpoint. It deliberately never takes the white panel surface the
 * pill wears while a panel is open; it is a separate object and follows the
 * page, not the panel. The icon alone goes gold while the search is out,
 * which is how the circle says it is the thing that was pressed.
 */
export function SearchCorner({
  surface,
  open,
  onToggle,
}: {
  surface: SearchSurface;
  open: boolean;
  onToggle(): void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={fill(searchContent.label)}
      aria-expanded={open}
      {...(open ? { "aria-controls": SEARCH_PANEL_ID } : {})}
      // top-[18px] is measured, not guessed: the pill is 60 tall from y 16,
      // so its midline is 46, and 46 less half of 56 is 18. If the bar's
      // height ever changes, re-measure this rather than re-deriving it.
      className={`absolute right-4 top-[18px] hidden h-14 w-14 items-center justify-center rounded-full min-[1240px]:flex ${
        open ? "text-k-gold-lit" : "text-k-on-dark hover:text-k-gold-lit"
      }`}
      style={{
        backgroundColor: surface.tint,
        backgroundImage: surface.sheen,
        boxShadow: surface.shadow,
        backdropFilter: GLASS_FILTER,
        WebkitBackdropFilter: GLASS_FILTER,
        transition:
          "background-color var(--duration-standard) var(--ease-micro), box-shadow 520ms var(--ease-micro), color 200ms var(--ease-micro)",
      }}
    >
      <SearchIcon />
    </button>
  );
}

/**
 * The in-pill button, for every width below the corner. The same 44 pixel
 * square as the menu mark beside it, and it takes the bar's link colour so
 * it flips to ink with the rest of the menu when the pill turns to paper.
 */
export function SearchBarButton({
  colour,
  open,
  onToggle,
}: {
  colour: string;
  open: boolean;
  onToggle(): void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={fill(searchContent.label)}
      aria-expanded={open}
      {...(open ? { "aria-controls": SEARCH_PANEL_ID } : {})}
      className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-200 min-[1240px]:hidden ${
        open ? "text-k-gold" : colour
      }`}
    >
      <SearchIcon />
    </button>
  );
}

/**
 * The pressed key, read tolerantly. Real browsers hand back names like
 * "Enter"; some embedded and automated browsers hand back an empty string
 * with only the old numeric code beside it, and a search that cannot be
 * driven by its keyboard is broken exactly where it matters most.
 */
function keyName(event: { key?: string; keyCode?: number }): string {
  if (event.key) return event.key;
  switch (event.keyCode) {
    case 13:
      return "Enter";
    case 27:
      return "Escape";
    case 38:
      return "ArrowUp";
    case 40:
      return "ArrowDown";
    default:
      return "";
  }
}

/**
 * One row of the list, whatever put it there. Before anything is typed the
 * rows are the site's pages; once letters land they are the matches. Keeping
 * both in one shape is what lets the arrow keys, Enter and the gold marker
 * work identically on either.
 */
type Row = {
  href: string;
  /** The small capitals heading this row sits under. */
  group: string;
  kind: "quick" | "title" | "prose";
  /** For quick rows the page's name; for title rows its address. */
  primary?: string;
  /** For prose rows, the heading over the matched passage, when it has one. */
  section?: string;
  excerpt?: SearchHit["excerpt"];
};

/**
 * The search, drawn inside the pill's opened panel. Nav.tsx animates the
 * height it appears in, exactly as it does for the services panels, so this
 * component owns everything except the growing: the box, the list, the foot,
 * the keyboard.
 *
 * It is set in ink on the panel's paper. The results were first designed
 * dark, but the pill turns white when it opens a panel, and a dark sheet
 * inside a white pill would read as a hole cut in it.
 */
export function SearchPanel({ onClose }: { onClose(): void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<ReturnType<typeof prepare> | null>(null);

  // The words arrive the first time the panel opens and never again.
  useEffect(() => {
    let alive = true;
    import("@/lib/search-data").then((mod) => {
      if (alive) setIndex(prepare(mod.buildIndex()));
    });
    return () => {
      alive = false;
    };
  }, []);

  // The cursor lands in the box as the panel grows, and goes back to the
  // button that opened it when the panel closes.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, []);

  // Typing is answered from memory, so results land on the keystroke; the
  // deferral only matters on a slow phone, where it lets the letter appear
  // in the box before the list redraws.
  const deferred = useDeferredValue(query);
  const trimmed = deferred.trim();
  const groups = useMemo(
    () => (index && trimmed ? search(index, trimmed) : []),
    [index, trimmed],
  );

  /**
   * The panel before anything is typed: the menu's own pages, in the menu's
   * own order, so the search opens as a place to go rather than an empty
   * room. Read from the same lists the bar reads; add a page there and it
   * appears here without anyone remembering to do it twice.
   */
  const quickRows = useMemo<Row[]>(() => {
    const bar = navContent.bar;
    return [...bar.leftLinks, ...bar.menuOnlyLinks, ...bar.rightLinks].map(
      (link) => ({
        href: link.href,
        group: fill(searchContent.quickLabel),
        kind: "quick" as const,
        primary: fill(link.label),
      }),
    );
  }, []);

  const rows = useMemo<Row[]>(() => {
    if (!trimmed) return quickRows;
    return groups.flatMap((group) =>
      group.hits.map((hit): Row => {
        if (hit.record.kind === "title") {
          return {
            href: group.route,
            group: group.page,
            kind: "title",
            primary: group.route,
          };
        }
        return {
          href: group.route,
          group: group.page,
          kind: "prose",
          section:
            hit.record.section && hit.record.section !== group.page
              ? hit.record.section
              : undefined,
          excerpt: hit.excerpt,
        };
      }),
    );
  }, [trimmed, groups, quickRows]);

  // A new set of results starts from its best answer.
  useEffect(() => setActive(0), [trimmed]);
  useEffect(() => {
    optionRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div id={SEARCH_PANEL_ID} className="border-t border-black/[0.06]">
      {/* The box. The type is 16 pixels, not the site's 14, because iOS
          zooms the whole page into any box set smaller than 16 and never
          zooms back out; see the note in the mobile styles. */}
      <div className="flex items-center gap-3.5 border-b border-black/[0.06] py-1.5 pl-6 pr-2.5">
        <SearchIcon className="shrink-0 text-k-ink-soft" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={fill(searchContent.placeholder)}
          aria-label={fill(searchContent.label)}
          role="combobox"
          aria-expanded={rows.length > 0}
          aria-controls="k-search-results"
          aria-activedescendant={
            rows.length > 0 ? `k-search-option-${active}` : undefined
          }
          aria-autocomplete="list"
          onKeyDown={(event) => {
            const key = keyName(event);
            if (key === "ArrowDown" && rows.length) {
              event.preventDefault();
              setActive((a) => (a + 1) % rows.length);
            } else if (key === "ArrowUp" && rows.length) {
              event.preventDefault();
              setActive((a) => (a - 1 + rows.length) % rows.length);
            } else if (key === "Enter" && rows[active]) {
              event.preventDefault();
              onClose();
              router.push(rows[active].href);
            } else if (key === "Escape") {
              // The bar also closes on Escape; from inside the box this
              // answers first, and answering twice closes once.
              event.preventDefault();
              onClose();
            }
          }}
          className="min-w-0 flex-1 appearance-none bg-transparent py-3 font-text text-[16px] leading-normal text-k-ink caret-k-gold outline-none placeholder:text-k-ink-soft"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-k-ink-soft transition-colors duration-200 hover:text-k-ink"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* The list: the pages before anything is typed, the matches after,
          grouped under small capitals with the matched words in gold and a
          gold hairline standing in the margin of the row the keyboard is
          on. The whole row is the link. */}
      {rows.length > 0 ? (
        <>
          {!trimmed ? (
            <p className="px-6 pb-1 pt-4 font-text text-k-small text-k-ink-soft">
              {fill(searchContent.hint)}
            </p>
          ) : null}
          <ul
            id="k-search-results"
            role="listbox"
            aria-label={fill(searchContent.label)}
            data-lenis-prevent
            className="max-h-[min(52vh,440px)] overflow-y-auto overscroll-contain pb-2"
          >
            {rows.map((row, i) => {
              const header =
                i === 0 || rows[i - 1].group !== row.group ? row.group : null;
              return (
                <Fragment key={`${row.href}-${i}`}>
                  {header ? (
                    <li
                      role="presentation"
                      className={i > 0 ? "mt-1 border-t border-black/[0.05]" : ""}
                    >
                      <span className="block px-6 pb-1.5 pt-3.5 font-text text-k-micro uppercase text-k-gold">
                        {header}
                      </span>
                    </li>
                  ) : null}
                  <li
                    role="option"
                    id={`k-search-option-${i}`}
                    aria-selected={i === active}
                  >
                    <Link
                      href={row.href}
                      ref={(node) => {
                        optionRefs.current[i] = node;
                      }}
                      onClick={onClose}
                      onMouseMove={() => setActive(i)}
                      className={`relative block px-6 transition-colors duration-150 ${
                        i === active ? "bg-black/[0.035]" : ""
                      } ${row.kind === "prose" ? "py-3" : "py-2.5"}`}
                    >
                      {i === active ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-0.5 bg-k-gold"
                        />
                      ) : null}
                      {row.kind === "prose" ? (
                        <>
                          {row.section ? (
                            <span className="block truncate pb-0.5 font-text text-k-micro uppercase text-k-ink-soft">
                              {row.section}
                            </span>
                          ) : null}
                          <span className="block font-text text-k-small text-k-ink-soft">
                            {row.excerpt?.map((segment, j) =>
                              segment.hit ? (
                                <mark
                                  key={j}
                                  className="bg-transparent font-semibold text-k-gold"
                                >
                                  {segment.text}
                                </mark>
                              ) : (
                                <span key={j}>{segment.text}</span>
                              ),
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center justify-between gap-4">
                          <span
                            className={`truncate font-text text-k-small ${
                              row.kind === "quick"
                                ? "font-semibold text-k-ink"
                                : "text-k-ink-soft"
                            }`}
                          >
                            {row.primary}
                          </span>
                          <GoIcon
                            className={`shrink-0 ${
                              i === active ? "text-k-gold" : "text-k-ink-soft"
                            }`}
                          />
                        </span>
                      )}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </>
      ) : trimmed && index ? (
        <div className="flex flex-col gap-3 px-6 py-8">
          <p className="font-text text-k-small text-k-ink">
            {fill(searchContent.empty).replace("{query}", trimmed)}
          </p>
          <Copy
            text={searchContent.emptyAction}
            className="font-text text-k-small text-k-ink-soft"
            linkClassName="text-k-gold underline underline-offset-4"
          />
        </div>
      ) : null}

      {/* The foot: the keys on the left, the count on the right, in the
          manner of the Vapi palette. Hidden on phones, where the keys do
          not exist and the count is not worth a row of the screen. */}
      <div className="hidden items-center gap-5 border-t border-black/[0.06] px-6 py-3 sm:flex">
        {(
          [
            ["↑↓", searchContent.footMove],
            ["↵", searchContent.footNavigate],
            ["esc", searchContent.footClose],
          ] as const
        ).map(([key, words]) => (
          <span key={key} className="flex items-center gap-2">
            <kbd className="rounded-[5px] border border-black/15 px-1.5 py-0.5 font-text text-k-micro text-k-ink-soft">
              {key}
            </kbd>
            <span className="font-text text-k-micro uppercase text-k-ink-soft">
              {fill(words)}
            </span>
          </span>
        ))}
        {trimmed && rows.length > 0 ? (
          <span className="ml-auto font-text text-k-micro uppercase text-k-ink-soft">
            {fill(searchContent.footCount).replace("{count}", String(rows.length))}
          </span>
        ) : null}
      </div>
    </div>
  );
}
