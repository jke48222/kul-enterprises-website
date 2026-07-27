import type { Metadata } from "next";
import LegalPage from "@/components/v3/LegalPage";

export const metadata: Metadata = {
  title: "Climate Statement",
  description:
    "KUL Enterprises' commitments to responsible, efficient freight operations.",
};

// Draft for client and attorney review before launch.
// Audited v2 body copy ported verbatim; template = v3 LegalPage.
export default function ClimateStatement() {
  return (
    <LegalPage
      eyebrow="Responsibility"
      title="KUL Enterprises Climate Statement"
      updated="July 2026"
      pull="We would rather report real practices than print slogans."
      sections={[
        {
          heading: "Our commitment",
          body: (
            <>
              <p>
                KUL Enterprises believes that climate change is one of the
                most fundamental threats facing our planet and the communities
                we serve. Our leadership has spent years on America&apos;s
                highways and has seen the effects of weather extremes
                firsthand, from flooded interstates to heat that punishes
                equipment and drivers alike. We are committed to doing
                everything in our power to be part of the answer.
              </p>
              <p>
                The transportation industry carries a great deal of
                responsibility when it comes to tackling climate change, and
                KUL Enterprises intends to play its part. As a growing
                carrier, we have a clear opportunity to build our fleet the
                right way from the start: disciplined route planning that
                eliminates empty miles, preventive maintenance that keeps
                engines running clean and tires at pressure, idle-reduction
                practices at docks and rest stops, and right-sized equipment
                so we never pull more truck than the freight requires.
              </p>
              <p>
                As we expand toward fifty tractors by the end of 2029, fuel
                efficiency is weighed in every purchasing decision, and we are
                watching the development of cleaner drivetrain technology
                closely. We will adopt lower-emission equipment as it becomes
                practical for the lanes we run, and we are exploring long-term
                approaches to recycling, materials, and equipment longevity
                for the best lasting results.
              </p>
              <p>
                As our sustainability work matures, this statement will grow
                with it.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
