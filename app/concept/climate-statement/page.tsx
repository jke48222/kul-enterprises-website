import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";

export const metadata: Metadata = { title: "Climate Statement" };

// Draft for client and attorney review before launch.
export default function ClimateStatement() {
  return (
    <LegalPage
      gradient="linear-gradient(90deg,#161616,#3D2A5A)"
      eyebrow="Responsibility"
      title="Climate Statement"
      sections={[
        {
          heading: "Where we stand",
          body: [
            "Trucking moves the country, and it burns fuel doing it. We do not pretend otherwise. Our responsibility as a growing carrier is to move every load with as little waste as the job allows.",
          ],
        },
        {
          heading: "What we practice today",
          body: [
            "Disciplined route planning that cuts empty miles. Preventive maintenance that keeps engines running clean and tires at pressure. Idle-reduction habits at docks and rest stops. Right-sized equipment for the load, so we are not pulling more truck than the freight needs.",
          ],
        },
        {
          heading: "As we grow",
          body: [
            "Our fleet plan through 2029 prioritizes newer, cleaner tractors as we add capacity. We evaluate fuel efficiency at every purchase and will adopt cleaner technology as it becomes practical for the lanes we run.",
          ],
        },
        {
          heading: "Honesty over slogans",
          body: [
            "We would rather report real practices than print a green logo. As our sustainability work matures, this page will grow with it.",
          ],
        },
      ]}
    />
  );
}
