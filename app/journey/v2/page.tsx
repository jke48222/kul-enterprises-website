import type { Metadata } from "next";
import SceneSection from "@/components/k/journey/SceneSection";
import SmoothScroll from "@/components/k/journey/SmoothScroll";
import Scene01Beginning from "@/components/k/journey/Scene01Beginning";
import Scene02Jamaica from "@/components/k/journey/Scene02Jamaica";
import Scene07Discipline from "@/components/k/journey/Scene07Discipline";
import Scene10TheRoad from "@/components/k/journey/Scene10TheRoad";
import Scene11People from "@/components/k/journey/Scene11People";
import Scene14MeetKul from "@/components/k/journey/Scene14MeetKul";
import { SCENES, TOTAL_VH, PLATES, inkFor } from "@/lib/journey-spine";

/**
 * THE JOURNEY REBUILD, STEP 0: THE HARNESS.
 *
 * Seventeen empty sections carrying nothing but the light arc and the
 * furniture. No scene has been written yet and that is deliberate.
 *
 * WHY THIS EXISTS BEFORE ANY OF THE WRITING. The seventeen scenes were designed
 * separately, and when they were read end to end the things they were all meant
 * to share had drifted: the clock ran backwards in six places, one photograph
 * carried two different plate numbers, and the ramp had never been checked as
 * one continuous run. Every one of those faults is invisible inside a single
 * scene and obvious when the whole page scrolls past. So the spine gets proved
 * on its own, over the full thirty-one screens, before a word is set on it.
 *
 * What this page is for: scroll it top to bottom and check that the ground
 * moves through one unbroken sunrise with no visible seam at any join, that the
 * scene number counts up, that the light stage never goes backwards, and that
 * the strap stays legible on every ground it crosses.
 *
 * IT IS NOT LINKED FROM ANYWHERE AND IT IS NOT INDEXED. The live page is still
 * /journey. This becomes it when the seventeen are built.
 */

export const metadata: Metadata = {
  title: "The Journey (rebuild harness)",
  // Scaffolding. It must never turn up in a search result.
  robots: { index: false, follow: false },
};

export default function JourneyHarness() {
  return (
    <>
      {/* The scroll wheel is the transport control for this whole page, so it
          is smoothed here and nowhere else on the site. See the header of
          SmoothScroll.tsx for why this is the one dependency worth adding. */}
      <SmoothScroll />

      {/* ACT I. Built. Everything below is still the harness placeholder. */}
      <Scene01Beginning />
      <Scene02Jamaica />

      {/* Everything from scene 3 on, in order. A scene that has been built
          renders itself; the rest are still the harness placeholder, so the
          light arc and the furniture can be read end to end at any point in
          the build rather than only once all seventeen exist.

          SCENE 14 IS BUILT OUT OF ORDER ON PURPOSE. It is the payoff, it proves
          the lightest end of the light arc, and it is the scene most likely to
          sink the project if the backstage snapshot cannot carry the climax.
          Better to find that out now than in month two. */}
      {SCENES.filter((s) => s.n > 2).map((scene) =>
        scene.n === 7 ? (
          <Scene07Discipline key={scene.n} />
        ) : scene.n === 10 ? (
          <Scene10TheRoad key={scene.n} />
        ) : scene.n === 11 ? (
          <Scene11People key={scene.n} />
        ) : scene.n === 14 ? (
          <Scene14MeetKul key={scene.n} />
        ) : (
        <SceneSection
          key={scene.n}
          scene={scene}
          className="flex h-full flex-col items-center justify-center px-6"
        >
          {/* Placeholder only. Every one of these is replaced by a scene. */}
          {/* Scaffolding text. Full strength on purpose: a dimmed placeholder
              makes the contrast sweep report failures that are not real, and
              hides the ones that are. */}
          <p
            className="font-display text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: inkFor(scene) }}
          >
            {scene.pinned ? "pinned" : "flow"} · {scene.vh}vh
          </p>
          <h2
            id={`${scene.slug}-heading`}
            className="mt-4 max-w-[16ch] text-balance text-center font-display text-[clamp(1.75rem,4vw,3.25rem)] font-black leading-[1.05] tracking-[-0.02em]"
            style={{ color: inkFor(scene) }}
          >
            {scene.title}
          </h2>
          <p
            className="mt-4 font-text text-[11px] uppercase tracking-[0.14em]"
            style={{ color: inkFor(scene) }}
          >
            {scene.from} → {scene.to}
          </p>
        </SceneSection>
        ),
      )}

      {/* The two assertions this harness exists to make, printed where I can
          read them off the page rather than trusting the maths in a comment. */}
      <section className="bg-[#eff1f3] px-6 py-16 text-[#12141A] md:px-10">
        <div className="mx-auto max-w-[900px] font-text text-[13px] leading-relaxed">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em] opacity-60">
            Harness readout
          </p>
          <p className="mt-4">
            {SCENES.length} scenes · {TOTAL_VH}vh total ·{" "}
            {(TOTAL_VH / 100).toFixed(0)} screens ·{" "}
            {SCENES.filter((s) => s.pinned).length} pinned (
            {SCENES.filter((s) => s.pinned)
              .map((s) => s.n)
              .join(", ")}
            )
          </p>
          <p className="mt-2">
            {PLATES.length} plates registered ·{" "}
            {new Set(PLATES.map((p) => p.n)).size} distinct numbers ·{" "}
            {new Set(PLATES.map((p) => p.file)).size} distinct files
          </p>
        </div>
      </section>
    </>
  );
}
