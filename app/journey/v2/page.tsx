import type { Metadata } from "next";
import SmoothScroll from "@/components/k/journey/SmoothScroll";
import Scene01Beginning from "@/components/k/journey/Scene01Beginning";
import Scene02Jamaica from "@/components/k/journey/Scene02Jamaica";
import Scene03Work from "@/components/k/journey/Scene03Work";
import Scene04Questions from "@/components/k/journey/Scene04Questions";
import Scene05Independence from "@/components/k/journey/Scene05Independence";
import Scene06Challenge from "@/components/k/journey/Scene06Challenge";
import Scene07Discipline from "@/components/k/journey/Scene07Discipline";
import Scene08StraightLine from "@/components/k/journey/Scene08StraightLine";
import Scene09Trust from "@/components/k/journey/Scene09Trust";
import Scene10TheRoad from "@/components/k/journey/Scene10TheRoad";
import Scene11People from "@/components/k/journey/Scene11People";
import Scene12MoreThan from "@/components/k/journey/Scene12MoreThan";
import Scene13Promise from "@/components/k/journey/Scene13Promise";
import Scene14MeetKul from "@/components/k/journey/Scene14MeetKul";
import Scene15Values from "@/components/k/journey/Scene15Values";
import Scene16RoadAhead from "@/components/k/journey/Scene16RoadAhead";
import Scene17Next from "@/components/k/journey/Scene17Next";

/**
 * THE JOURNEY REBUILD: ALL SEVENTEEN SCENES.
 *
 * The harness this page began as (seventeen empty sections proving the light
 * arc end to end) has done its job: every scene is built and the spine in
 * lib/journey-spine.ts is still the single source of truth for every colour,
 * plate number and height on the page. Scroll it top to bottom and the ground
 * still moves through one unbroken sunrise; that check outlives the harness.
 *
 * STILL NOT LINKED AND STILL NOT INDEXED. The live page remains /journey
 * until this replaces it, which is a deliberate, reviewable cutover rather
 * than a side effect of a build finishing.
 */

export const metadata: Metadata = {
  title: "The Journey (rebuild harness)",
  // Scaffolding. It must never turn up in a search result.
  robots: { index: false, follow: false },
};

export default function JourneyRebuild() {
  return (
    <>
      {/* The scroll wheel is the transport control for this whole page, so it
          is smoothed here and nowhere else on the site. See the header of
          SmoothScroll.tsx for why this is the one dependency worth adding. */}
      <SmoothScroll />

      <Scene01Beginning />
      <Scene02Jamaica />
      <Scene03Work />
      <Scene04Questions />
      <Scene05Independence />
      <Scene06Challenge />
      <Scene07Discipline />
      <Scene08StraightLine />
      <Scene09Trust />
      <Scene10TheRoad />
      <Scene11People />
      <Scene12MoreThan />
      <Scene13Promise />
      <Scene14MeetKul />
      <Scene15Values />
      <Scene16RoadAhead />
      <Scene17Next />
    </>
  );
}
