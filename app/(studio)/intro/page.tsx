import type { Metadata } from "next";
import StudioDocument from "@/components/studio/StudioDocument";
import { readStudioDoc } from "@/lib/studio";

/** The opening film — v6 is the approved cut, canvas particle engine as the alt mode. */

export const metadata: Metadata = {
  title: "KUL — Opening Film",
  robots: { index: false },
};

export default function IntroPage() {
  return <StudioDocument doc={readStudioDoc("intro")} />;
}
