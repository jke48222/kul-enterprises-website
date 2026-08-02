"use client";

import { useTina } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";
import SmoothScroll from "@/components/k/journey/SmoothScroll";
import RouteThread from "@/components/k/journey/RouteThread";
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
 * THE JOURNEY, THE HALF THAT DRAWS.
 *
 * app/journey/page.tsx fetches on the server and hands the result down; this
 * half subscribes with useTina, the same as every other page on the site, and
 * deals each scene its own words.
 *
 * Seventeen scenes, one sunrise: the ground travels from near-black to
 * daylight across the page, painted as one unbroken ramp by the scenes
 * themselves. Every colour, height, plate number and pin decision comes from
 * lib/journey-spine.ts; every word comes from content/pages/journey.json
 * through this component. A scene never holds a local copy of either.
 */

/** The shape of the content, taken from the file itself. See quote-view.tsx. */
type Content = typeof import("@/content/pages/journey.json");

export default function JourneyView(props: TinaPage<{ journeyPage: unknown }>) {
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.journeyPage as unknown as Content;

  return (
    <div className="relative">
      {/* The scroll wheel is the transport control for this whole page, so it
          is smoothed here and nowhere else on the site. See the header of
          SmoothScroll.tsx for why this is the one dependency worth adding. */}
      <SmoothScroll />

      {/* One continuous route line from scene 1 to the sign-off, filling as
          the reader travels. The film's answer to reading as slides: the
          seams stay, the line does not break. See RouteThread.tsx. */}
      <RouteThread />

      <Scene01Beginning copy={page.s01} />
      <Scene02Jamaica copy={{ ...page.s02, lessonWord: page.lessonWord }} />
      <Scene03Work copy={page.s03} />
      <Scene04Questions copy={page.s04} />
      <Scene05Independence copy={page.s05} />
      <Scene06Challenge copy={page.s06} />
      <Scene07Discipline copy={page.s07} />
      <Scene08StraightLine copy={page.s08} />
      <Scene09Trust copy={{ ...page.s09, lessonWord: page.lessonWord }} />
      <Scene10TheRoad copy={page.s10} />
      <Scene11People copy={page.s11} />
      <Scene12MoreThan copy={page.s12} />
      <Scene13Promise copy={{ ...page.s13, lessonWord: page.lessonWord }} />
      <Scene14MeetKul copy={page.s14} />
      <Scene15Values copy={page.s15} />
      <Scene16RoadAhead copy={page.s16} />
      <Scene17Next copy={page.s17} />
    </div>
  );
}
