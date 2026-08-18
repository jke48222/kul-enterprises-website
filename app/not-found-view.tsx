"use client";

import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import HeroVideo from "@/components/k/HeroVideo";
import { fill, link } from "@/lib/content";
import type { TinaPage } from "@/lib/tina";

/**
 * THE 404 PAGE, THE HALF THAT DRAWS.
 *
 * app/not-found.tsx fetches on the server and hands the result down. This half
 * subscribes with useTina, the same as every other page on the site.
 *
 * ============================================================================
 * THIS ONE PAGE IS DELIBERATELY NOT IN THE HOUSE STYLE.
 * ============================================================================
 * The client asked for Rivian's 404 specifically, so this follows Rivian's
 * arrangement rather than the left-margin editorial layout the rest of the
 * site is set on:
 *
 *   one full-bleed film, drained of colour, running behind everything
 *   the numeral very large, in white, centred over the vehicle
 *   the sentence centred under it, and one short line under that
 *   a single white pill, centred, and nothing else on the page
 *
 * There is no list of other places to go, and that is the point of copying
 * this particular page. Rivian offers exactly one way out and trusts the
 * navigation above to do the rest. Adding a four-row index underneath would
 * be the old 404 wearing a new photograph.
 *
 * The film is the wet-interstate dashcam, which is Mark's own footage shot
 * forward out of the truck. It is the only one of the three dashcam clips not
 * already used somewhere else on the site, so this page is not a second
 * showing of the Journey or Safety band.
 *
 * TO CHANGE THE FILM: it is a field at /admin under "Page Not Found (404)".
 * Anything in the videos folder works as long as its "-720" version is there
 * too. Read the note on the sub-line's colour first, because the darkness of
 * the film is what makes that text readable.
 *
 * IF THIS EVER NEEDS TO GO BACK TO THE HOUSE STYLE, the thing to keep is the
 * film. The centring is the borrowed part.
 */

/** The shape of the content, taken from the file itself. See quote-view.tsx. */
type Content = typeof import("@/content/pages/not-found.json");

export default function NotFoundView(
  props: TinaPage<{ notFoundPage: unknown }>,
) {
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.notFoundPage as unknown as Content;
  const { hero } = page;

  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-k-void px-6 py-32 text-center">
      {/* THE FILM, DRAINED OF COLOUR, which is what Rivian's page does.
          It is the wet-interstate dashcam: Mark's own footage, shot forward
          out of the truck, and the only one of the three clips not already
          spent elsewhere on the site. It is the right weather for the page
          without the page having to make a joke about it.

          The grade is heavier than the site's usual film stock because this
          clip is an overcast day and its sky is close to white. Left alone it
          is far too bright to set white type over. */}
      <HeroVideo
        name={hero.video ?? "dash-rain"}
        poster={hero.poster ?? "/videos/dash-rain-poster.jpg"}
        label="the background film"
        className="absolute inset-0 -z-10 h-full w-full object-cover filter-[grayscale(1)_contrast(1.08)_brightness(0.5)]"
      />
      {/* Sits the type on ink rather than on whichever frame happens to be
          passing. A dashcam clip changes exposure as it drives, so the type
          cannot rely on the picture staying as dark as it starts. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.66) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* The numeral. Decorative: the h1 under it is what a screen reader is
          told happened, and hearing "four zero four" first would be a code
          read out to somebody who did not ask for one. */}
      <span
        aria-hidden="true"
        className="block select-none font-display text-[clamp(5.5rem,20vw,14rem)] font-black leading-[0.8] tracking-[-0.04em] text-k-on-dark"
      >
        {fill(hero.numeral)}
      </span>

      {/* text-wrap balance so a short sentence does not drop its last word
          onto a line of its own. Without it "That page does not exist." breaks
          after "not" and leaves "exist." stranded under a full-width line. */}
      <h1 className="mt-10 max-w-[22ch] text-balance font-display text-[clamp(2rem,5vw,4rem)] font-black leading-[1.05] tracking-tight text-k-on-dark">
        {fill(hero.heading)}
      </h1>

      {/* NEAR-WHITE, NOT THE SOFT GREY THIS SITE USUALLY GIVES A SUB-LINE, and
          it was measured rather than chosen. Sampling the brightest pixels
          behind this line across the whole loop, then applying the grade and
          the scrim, the soft grey falls to 4.29:1 when the road opens out and
          the sky fills the frame. That is under the 4.5:1 that 20px regular
          text needs. #fcfcfc holds about 15:1 at the same frame. Rivian's own
          sub-line is white for what is presumably the same reason.

          Re-measure if the film, the grade or the scrim ever changes: the
          three of them together decide this, not the colour on its own. */}
      <p className="mt-5 max-w-[46ch] font-text text-k-lede text-k-on-dark">
        {fill(hero.subheading)}
      </p>

      <Link
        href={link(hero.cta).href}
        className="mt-12 inline-block rounded-full bg-k-on-dark px-9 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
      >
        {link(hero.cta).label}
      </Link>
    </section>
  );
}
