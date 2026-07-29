import type { Metadata } from "next";
import LegalPage from "@/components/k/LegalPage";

export const metadata: Metadata = {
  title: "Climate Statement",
  description:
    "What KUL Enterprises does about fuel and emissions today, and what it does not claim.",
};

/**
 * REWRITTEN 28 JUL 2026, because the previous version was not true.
 *
 * It opened on climate change being "one of the most fundamental threats
 * facing our planet", promised to do "everything in our power to be part of
 * the answer", and then described a set of fleet practices: idle reduction at
 * docks, right-sized equipment so the company never pulls more truck than the
 * freight requires, and fuel efficiency weighed in every purchasing decision.
 *
 * KUL has one tractor and one driver. It cannot right-size equipment it does
 * not own a choice of, and it has made one purchasing decision in its life.
 * The old page also carried the line "we would rather report real practices
 * than print slogans", which is itself a slogan, printed above four
 * paragraphs of them.
 *
 * A climate page from a one truck carrier is worth reading only if it is
 * specific about being a one truck carrier. Everything below is either
 * something a single truck genuinely does, or an explicit statement that
 * something is not claimed.
 *
 * WHEN THE SECOND TRUCK ARRIVES this page can say more, and it should. Until
 * then, do not add targets, offsets or percentages to it. Nothing is
 * measuring them.
 */
export default function ClimateStatement() {
  return (
    <LegalPage
      eyebrow="Responsibility"
      // THE HEADCOUNT STAYS IN THE BODY OF THIS PAGE, ON PURPOSE, and it is
      // the one place on the site that is true of. The whole argument here is
      // that KUL will not publish a fleet emissions programme because it does
      // not have a fleet to apply one to, and that argument does not survive
      // having its premise taken out: what is left reads as a policy with no
      // reason for being so thin. The title and the search description are
      // chrome rather than argument, so those are neutral now.
      title="Fuel, emissions and what we do not claim"
      updated="July 2026"
      sections={[
        {
          heading: "What this company is",
          body: (
            <>
              <p>
                KUL Enterprises runs one tractor. Mark Brown drives it and
                answers dispatch. That is the whole operation as this page is
                written, and it is the reason the page is short.
              </p>
              <p>
                A climate programme needs a fleet to apply it to. What follows
                is what one truck actually does, which is a smaller thing than
                a policy, and setting it out as a policy would be dishonest.
              </p>
            </>
          ),
        },
        {
          heading: "What is true today",
          body: (
            <>
              <p>
                Empty miles are planned out of a route wherever the freight
                allows it. That is not an environmental initiative, it is how a
                one truck carrier stays solvent, because a mile run empty is
                paid for and not billed. The environmental effect and the
                commercial interest happen to point the same way, and it is
                worth saying plainly that the commercial one came first.
              </p>
              <p>
                The tractor is maintained on a schedule rather than on failure.
                Tyres are kept at pressure and the engine is serviced when it
                is due. A truck kept properly burns less fuel than the same
                truck neglected, and the inspection that catches a fuel problem
                is the one that catches a safety problem.
              </p>
              <p>
                Loads that cannot be run legally inside hours of service are
                turned down rather than run badly. Rushing a lane costs fuel
                along with everything else it costs.
              </p>
            </>
          ),
        },
        {
          heading: "What is not claimed here",
          body: (
            <>
              <p>
                KUL does not measure its emissions. There is no carbon
                accounting behind this page, no independent audit and no
                certification. No figure appears anywhere on it, because
                nothing is producing one.
              </p>
              <p>
                KUL does not buy offsets and does not describe any load as
                carbon neutral. It has set no reduction target and no target
                date. It runs a diesel tractor, which is what the freight it
                carries currently requires.
              </p>
              <p>
                Nothing here is a commitment to a customer, and none of it
                should be relied on for a shipper&apos;s own reporting. If you
                need emissions data for a lane, ask when you book and you will
                be told honestly what can and cannot be provided, which today
                is very little.
              </p>
            </>
          ),
        },
        {
          heading: "What would change this page",
          body: (
            <>
              <p>
                A second tractor, and then more of them, is the point where
                equipment choice becomes a real decision rather than a
                description of the only truck available. Lower emission
                drivetrains are worth weighing when KUL is buying, rather than
                while it is running what it already has.
              </p>
              <p>
                This page is updated when one of those things is true, and not
                before. If it has not changed in a year, nothing on it has
                changed in a year.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
