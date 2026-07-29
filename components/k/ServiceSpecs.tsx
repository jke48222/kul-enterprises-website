import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/k/Reveal";
import type { Service } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * THE SPECIFICATION BLOCK ON A SERVICE PAGE
 *
 * One section, three columns. The left two hold a two-across grid of tiles,
 * each one a single measurement standing on a photograph. The right holds one
 * tall panel of label and value rows, which is where the commercial facts of
 * the service live: what equipment runs it, what lane it suits, how long it
 * takes to put a truck on it, and the authority KUL runs under.
 *
 * WHERE THE SHAPE COMES FROM. The client sent a Mobbin capture of Rivian's
 * product specs page: a large plain heading top left, six generously rounded
 * tiles in a very light grey holding a small quiet label above a much larger
 * value, and one tall ruled panel beside them. The tiles are tall and mostly
 * empty on purpose. The air is the design, so resist filling it.
 *
 * WHAT THE CLIENT CHANGED. "Use the pictures as backgrounds for the boxes."
 * So the flat grey is a photograph, which is the reason for the long note on
 * the scrim below. Everything else about the reference is kept.
 *
 * THIS REPLACED A DARK BLUEPRINT BAND that carried two wire-frame elevations
 * of the rig with the letters A to F printed beside them, and a table under it
 * repeating those letters in two columns. The letters went with the drawings,
 * because a reference letter with nothing to point at is worse than no letter.
 * The drawings themselves are not lost: `/` owns the elevation row, which
 * shows the same renders from four sides on one baseline.
 */

/**
 * Which photograph stands behind which tile, and which part of it shows.
 *
 * A service owns exactly two pictures and this grid asks for more backgrounds
 * than that, so the two are dealt out and the crop is moved, which is what
 * stops two neighbouring tiles being the same picture twice. Read with
 * `index % PHOTO_PLAN.length`, so it keeps working whether a service carries
 * three measurements or thirteen.
 *
 * ONLY THE VERTICAL FIGURE DOES ANY WORK, and that is worth knowing before
 * anyone edits these numbers expecting something to happen. A tile is roughly
 * 404 by 224 at 1440, so it is wider than either source: `card` is square and
 * `wide` is 16 by 9, and object-fit: cover therefore trims both of them top
 * and bottom and neither of them at the sides. An earlier version of this list
 * moved the crop sideways and looked identical six times over, which is how
 * the geometry got worked out.
 *
 * So the square picture is the one that carries the variation: the tile is a
 * letterbox sliding down a frame nearly twice its height, and 12 per cent and
 * 88 per cent are genuinely different pieces of it. The two `wide` entries do
 * the opposite and show almost the whole frame, which gives the grid two
 * establishing shots among four details rather than six of the same thing.
 */
const PHOTO_PLAN = [
  { use: "card", position: "50% 12%" },
  { use: "wide", position: "50% 50%" },
  { use: "card", position: "50% 88%" },
  { use: "card", position: "50% 34%" },
  { use: "wide", position: "50% 50%" },
  { use: "card", position: "50% 66%" },
] as const satisfies readonly { use: "wide" | "card"; position: string }[];

type SpecTile = {
  key: string;
  label: string;
  value: string;
  /** Present only on the tile whose value is an action, which is underlined. */
  href?: string;
};

type PanelRow = {
  label: string;
  /** Either a value, or a short list. One row in the reference is a list. */
  value?: string;
  /** A quieter second line under the value, where the data carries one. */
  note?: string;
  items?: string[];
};

export default function ServiceSpecs({ service }: { service: Service }) {
  /**
   * THE TILES CARRY THE COMMERCIAL FACTS, NOT THE TRAILER MEASUREMENTS.
   *
   * They held the measurements for a while and it was the wrong split. A broker
   * opening a service page wants to know what equipment turns up, where it
   * runs, and how soon; the trailer's height and door width are a different
   * question, asked later, and they belong on the drawing that shows where each
   * figure is taken from. Size it up owns those now and this section owns these.
   *
   * The last tile is an action rather than a fact. Rivian's own grid ends the
   * same way, with a "Questions?" tile whose value is a link, and it earns its
   * place here for a second reason: it is what keeps the grid from leaving a
   * hole. See `lastFillsRow` below.
   */
  const tiles: SpecTile[] = [
    { key: "equipment", label: "Equipment", value: service.equipment },
    { key: "lane", label: "Typical lane", value: service.lane },
    { key: "lead", label: "Lead time", value: service.leadTime },
    { key: "best", label: "Best for", value: service.bestForShort },
    { key: "based", label: "Dispatched from", value: site.location },
    {
      key: "questions",
      label: "Questions?",
      value: "Contact dispatch",
      href: "/contact",
    },
  ];

  /**
   * The grid is two across, so an odd number of tiles leaves an empty cell in
   * the bottom right. The last tile takes the whole row instead. Every service
   * in content/services.json carries six measurements today, which with the
   * action tile makes seven and takes this branch, but the rule is written
   * against the count rather than against six so that adding or removing a
   * measurement cannot open a hole.
   */
  const lastFillsRow = tiles.length % 2 === 1;

  /**
   * The panel is the record: the things that are true of the service in
   * writing, rather than the headline facts on the tiles beside it.
   *
   * It carries the notes the tiles have no room for, the federal numbers, and
   * what KUL has actually undertaken to do on this service, which is the part a
   * broker is deciding on. Nothing here is invented: every value is read from
   * content/services.json or content/site.json.
   */
  const rows: PanelRow[] = [
    {
      label: "Equipment",
      value: service.equipment,
      note: service.equipmentNote,
    },
    { label: "Typical lane", value: service.lane, note: service.laneNote },
    { label: "Service area", value: site.serviceArea },
    {
      label: "Operating authority",
      items: [`USDOT ${site.usdot}`, `MC ${site.mc}`],
    },
    { label: "What we commit to", items: [...service.commitments] },
  ];

  return (
    <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1248px]">
        <Reveal variant="wipe">
          <h2 className="font-display text-k-d2 font-black text-k-ink">
            In detail
          </h2>
        </Reveal>

        <div className="grid gap-4 pt-10 md:pt-14 lg:grid-cols-3 lg:gap-6">
          {/* The two left columns: the tiles, and the caveat that belongs to
              them. They are one flex column so the caveat sits under the grid
              rather than becoming a grid cell of its own. */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Reveal className="flex-1">
              <ul className="grid h-full auto-rows-fr gap-4 sm:grid-cols-2">
                {tiles.map((tile, i) => {
                  const plan = PHOTO_PLAN[i % PHOTO_PLAN.length];
                  const fills = lastFillsRow && i === tiles.length - 1;

                  return (
                    <li
                      key={tile.key}
                      className={`relative overflow-hidden rounded-xl ${
                        fills ? "sm:col-span-2" : ""
                      }`}
                    >
                      {/* The photograph is decoration. The label and the value
                          are the content of the tile, so this carries no
                          alternative text and a screen reader passes over it. */}
                      <Image
                        src={service[plan.use]}
                        alt=""
                        fill
                        // A tile that has taken the whole row is more than
                        // twice as wide as its neighbours, so it has to ask
                        // for a larger source or it arrives soft.
                        sizes={
                          fills
                            ? "(min-width: 1024px) 56vw, 92vw"
                            : "(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                        }
                        className="object-cover"
                        style={{ objectPosition: plan.position }}
                      />

                      {/* ================================================== */}
                      {/* THE SCRIM, AND WHY IT IS THIS HEAVY                */}
                      {/* ================================================== */}
                      {/*
                          Every one of the fourteen service photographs was
                          read pixel by pixel with sharp. All fourteen hold a
                          pixel above luminance 0.84, the dimmest of them being
                          `regional.jpg` at 0.8492, and `expedited-wide.jpg`
                          holds rgb(255,255,255), a blown white, which is the
                          worst case in the set. Cropping the search to the
                          middle band of each frame changed nothing: the bright
                          pixels are in there too.

                          The tile crops its picture with object-fit: cover and
                          the crop moves with the viewport, so there is no
                          honest way to promise that the blown pixel stays out
                          from under the words. The scrim is therefore measured
                          against that pixel, and the figure holds at every
                          width and for every one of the seven services.

                          Compositing is done the way the browser does it, in
                          sRGB, so a black scrim at alpha a leaves each channel
                          at channel * (1 - a). The gradient never goes weaker
                          than 0.66, which turns rgb(255,255,255) into
                          rgb(87,87,87), luminance 0.0954. Against #fcfcfc that
                          is 7.04:1, comfortably over the 4.5:1 minimum, and it
                          is the worst case rather than the typical one: the
                          typical pixel in these pictures is far darker.

                          THE SMALL LABEL IS FULL WHITE, NOT THE SOFT GREY, and
                          that is not an oversight. #a8a8a8 measured 3.04:1 on
                          the same pixel and fails. It reads as subordinate
                          because it is eleven pixels of tracked capitals under
                          a value three times its size, which is the same
                          decision, for the same reason, as the time of day in
                          components/k/JourneySequence.tsx.

                          The gradient is hand written rather than built from a
                          token with an opacity modifier, because those
                          modifiers silently fail on this project's `k-` colours
                          and render nothing at all, which here would mean white
                          type on a white sky.

                          IF A PHOTOGRAPH IS EVER REPLACED, measure again. Do
                          not assume: the brightest file in this set is not the
                          one that looks brightest.
                      */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.7)_58%,rgba(0,0,0,0.82)_100%)]"
                      />

                      {/* The tile is tall and the type sits in the middle of
                          it, which is the whole look. The minimum height is
                          what keeps it tall when a service carries few
                          measurements and the grid has no long neighbour to
                          stretch against. */}
                      <div className="relative flex h-full min-h-[168px] flex-col items-center justify-center gap-3 p-6 text-center md:min-h-[208px]">
                        <span className="font-text text-k-micro uppercase text-k-on-dark">
                          {tile.label}
                        </span>
                        {tile.href ? (
                          // The focus ring is overridden to white here, and it
                          // has to be. app/globals.css rings every focused
                          // element in #b59352 gold, which is measured against
                          // the site's light grounds; against the brightest
                          // pixel this tile's scrim can leave, it is 2.50:1 and
                          // misses the 3:1 that WCAG asks of a focus indicator.
                          // White is 7.04:1 on that same worst case. The site
                          // already swaps this colour by ground, which is what
                          // the `[data-ground="paper"]` rule in that file does.
                          <Link
                            href={tile.href}
                            className="font-display text-k-d3 font-black text-k-on-dark underline decoration-1 underline-offset-[6px] transition-opacity duration-200 hover:opacity-85 focus-visible:outline-[#fcfcfc]"
                          >
                            {tile.value}
                          </Link>
                        ) : (
                          <span className="font-display text-k-d3 font-black tabular-nums text-k-on-dark">
                            {tile.value}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {/* THE NOMINAL-DIMENSIONS CAVEAT IS NOT MISSING, IT MOVED. The
                measurements left this section when the tiles took the
                commercial facts instead, and the sentence went with them to
                Size it up in app/services/[slug]/page.tsx, which is where the
                numbers are now printed. It is load bearing wherever it lives:
                the figures in content/services.json are the book figures for a
                standard 53 foot van and nobody has put a tape over the client's
                own trailer, so a broker could quote against them. If you move
                the measurements again, move the sentence with them. */}
          </div>

          {/* The right column: one panel, one row per fact, hairline between.
              It is a description list because that is what it is. */}
          <Reveal index={1}>
            <dl className="flex h-full flex-col rounded-xl bg-k-paper px-6 py-1 md:px-8">
              {rows.map((row) => (
                // `flex-1` is what stops the panel becoming an empty grey box.
                // The panel is stretched to whichever column is taller, and
                // with six measurements beside six rows that is the tile grid
                // by about four hundred pixels. Letting the rows share the
                // surplus spreads the hairlines evenly down the panel instead
                // of stacking them at the top and leaving a void underneath,
                // and it degrades honestly: a service carrying twice as many
                // measurements gets an airier panel rather than a broken one.
                <div
                  key={row.label}
                  className="flex flex-1 items-start justify-between gap-6 border-b border-k-rule py-5 last:border-b-0"
                >
                  <dt className="pt-0.5 font-text text-k-micro uppercase text-k-ink-faint">
                    {row.label}
                  </dt>
                  <dd className="text-right">
                    {row.value ? (
                      <span className="block font-text text-k-body font-medium text-k-ink">
                        {row.value}
                      </span>
                    ) : null}
                    {row.note ? (
                      <span className="block pt-1 font-text text-k-small text-k-ink-soft">
                        {row.note}
                      </span>
                    ) : null}
                    {row.items ? (
                      <ul className="flex flex-col items-end gap-1.5">
                        {row.items.map((item) => (
                          // REGISTRATION NUMBERS ARE HELD ON ONE LINE. SENTENCES
                          // ARE NOT. Without the nowrap, the row splits its
                          // width evenly between the label and the list on a
                          // phone and "USDOT 7638788" breaks across two lines
                          // with its bullet stranded in the middle; refusing to
                          // wrap makes the label give up the second line
                          // instead, which is the right one to lose.
                          //
                          // But this list also carries the service commitments,
                          // which are whole sentences, and holding one of those
                          // on a single line pushed the panel 25px past the
                          // right edge of a 1440 window and gave the whole page
                          // a horizontal scrollbar. Short tokens keep the rule;
                          // anything long enough to be prose wraps.
                          <li
                            key={item}
                            className={`flex items-start gap-2 font-text text-k-body font-medium tabular-nums text-k-ink ${
                              item.length <= 18 ? "items-center whitespace-nowrap" : "text-right"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-k-ink-faint"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
