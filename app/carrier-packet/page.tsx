import type { Metadata } from "next";
import Link from "next/link";
import PacketForm from "@/components/forms/PacketForm";
import { site } from "@/lib/site";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * CARRIER PACKET
 *
 * What a broker wants before giving a carrier a load: the operating authority,
 * the W-9, the certificate of insurance and a signed agreement.
 *
 * The Paper artboard is "Carrier Packet, desktop 1440". Note the order it
 * happened in: this page was built from the written plan and the artboard was
 * drawn afterwards to record it. Every other page went the other way round,
 * which is the house rule, and this one is the exception rather than a new
 * precedent.
 *
 * THE HONEST POSITION, AND WHY THE PAGE IS SHAPED LIKE THIS. KUL has not
 * supplied those documents to the website, so there is nothing here to
 * download and this page does not pretend otherwise. What it can do is tell a
 * broker where each document comes from, hand them the two facts they can
 * check for themselves right now without asking anybody, and take the request
 * in three fields.
 *
 * WHAT WAS REMOVED AND MUST NOT COME BACK. The old version promised the full
 * packet "the same business day", four times over, for documents nobody had
 * produced. It also listed "broker and shipper references you can call" while
 * the about page published, as a fact, that KUL has no customer references.
 * One of those two pages was lying and it was this one. No turnaround is
 * stated anywhere here until Mark gives one he will hold to in writing.
 *
 * ON THE RECORD SECTION. It borrows the federal register's own field names
 * because those are KUL's own facts under the government's labels. It must
 * never carry FMCSA marks, colours or chrome: the moment it looks like an
 * official screenshot it stops being a summary and becomes a forged record.
 * Power units and drivers both read 1 on purpose. A broker who learns that
 * later feels misled; a broker who reads it here reads it as candour.
 */

export const metadata: Metadata = {
  title: "Carrier Packet",
  description: `Operating authority, W-9 and certificate of insurance for KUL Enterprises, USDOT ${site.usdot}, MC ${site.mc}. Authority and insurance can be checked on the federal record without asking us.`,
};

/**
 * What is in the packet, and who actually issues each one.
 *
 * The third line matters most. A carrier cannot issue its own certificate of
 * insurance, the agent does, which is why no turnaround is promised for it.
 */
const PACKET = [
  {
    name: "Operating authority",
    // "Without asking us" is the hero lede's line and it stays there. Said a
    // third time on one page it stops being a point and becomes a refrain.
    note: "KUL's own, and already public. It is set out on the federal record below.",
  },
  {
    name: "W-9",
    note: "KUL's own, completed and signed for KUL Enterprises LLC.",
  },
  {
    name: "Certificate of insurance",
    note: "Issued by KUL's insurance agent rather than by KUL. Your company is named as holder on request, which the agent has to do.",
  },
  {
    name: "Carrier or broker agreement",
    note: "KUL signs your paper. A one truck carrier does not have an agreement of its own to send you.",
  },
] as const;

/**
 * The federal record, in the register's own vocabulary.
 *
 * Every value comes from content/site.json or is a plain count. Change the
 * counts here the day a second truck or a second driver is real, and not
 * before.
 */
const RECORD = [
  { field: "Legal name", value: site.legalName },
  { field: "USDOT number", value: site.usdot },
  { field: "MC number", value: site.mc },
  { field: "Entity type", value: "Carrier" },
  { field: "Operating status", value: "Active" },
  { field: "Physical address", value: site.location },
  { field: "Power units", value: "1" },
  { field: "Drivers", value: "1" },
  { field: "Operating radius", value: "48 states" },
] as const;

const SAFER = `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${site.usdot}`;
const LI = "https://li-public.fmcsa.dot.gov/LIVIEW/pkg_menu.prc_menu";

export default function CarrierPacketPage() {
  return (
    <>
      {/* THE START
          Shape taken from a GOV.UK service start page: a title, one plain
          sentence saying what the service is for, the action itself, then a
          short list of what you get and what to have ready.

          That pattern exists for exactly this situation, a page whose job is
          a request that gets fulfilled somewhere else, which is why there is
          no photograph and no second column. */}
      <section className="bg-k-paper px-6 pb-28 pt-36 md:px-12 lg:px-24 lg:pt-44">
        <div className="mx-auto max-w-[1248px]">
          <p className="flex items-center gap-2.5 pb-10">
            <span className="font-text text-k-micro uppercase text-k-ink-soft">
              KUL
            </span>
            <span className="font-text text-k-micro text-k-ink-soft">/</span>
            <span className="font-text text-k-micro uppercase text-k-gold">
              Carrier Packet
            </span>
          </p>

          <div className="max-w-[640px]">
            <Reveal variant="wipe">
              <h1 className="font-display text-k-d1 font-black text-k-ink">
                The packet comes by email.
              </h1>
            </Reveal>

            <Reveal>
              <p className="pt-8 font-text text-k-body text-k-ink-soft">
                There are no files on this page. The documents are sent by the
                person who drives the truck, so ask here and they come back in
                a reply. The two that matter most, the operating authority and
                the insurance filing, are on the federal record and you can
                read both without asking us at all.
              </p>
            </Reveal>

            <Reveal variant="settle">
              <a
                href="#request"
                className="mt-9 inline-flex w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90"
              >
                Request the packet
              </a>
            </Reveal>

            <RuleDraw className="mt-14" />

            <Reveal variant="settle">
              <h2 className="pt-10 font-text text-k-micro uppercase text-k-ink-soft">
                What you get
              </h2>
            </Reveal>

            <ol className="flex flex-col gap-6 pt-6">
              {PACKET.map((doc, i) => (
                <Reveal
                  key={doc.name}
                  variant="settle"
                  index={i}
                  className="flex gap-5"
                >
                  <span className="w-6 shrink-0 pt-1 font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-text text-k-body font-semibold text-k-ink">
                      {doc.name}
                    </span>
                    <span className="font-text text-k-small text-k-ink-soft">
                      {doc.note}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* THE RECORD
          Set out the way the federal register sets it out, as a field grid of
          labels and values rather than as a list of selling points. This is
          not the safety page's credential list: that one is four wide rows at
          heading size with a note under each, this is a dense small grid that
          reads as a printed record.

          Deliberately plain. No badges, no seals, no agency colours. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="settle">
            <h2 className="font-text text-k-micro uppercase text-k-ink-soft">
              On the federal record
            </h2>
          </Reveal>

          <div className="mt-9 max-w-[820px]">
            {RECORD.map((row, i) => (
              <div key={row.field} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal
                  variant="settle"
                  index={i}
                  className="flex flex-wrap items-baseline gap-x-8 gap-y-1 py-4"
                >
                  <span className="w-[220px] shrink-0 font-text text-k-micro uppercase text-k-ink-soft">
                    {row.field}
                  </span>
                  <span className="font-text text-k-body tabular-nums text-k-ink">
                    {row.value}
                  </span>
                </Reveal>
              </div>
            ))}
            <RuleDraw index={RECORD.length} />

            <Reveal variant="settle" className="flex flex-col gap-3 pt-8">
              <p className="max-w-[62ch] font-text text-k-small text-k-ink-soft">
                Both of these are the government&rsquo;s own lookups, not ours.
                Neither needs an account and neither tells us you looked.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <a
                  href={SAFER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-text text-k-small font-semibold text-k-gold underline underline-offset-4"
                >
                  Check the authority on FMCSA SAFER
                </a>
                <a
                  href={LI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-text text-k-small font-semibold text-k-gold underline underline-offset-4"
                >
                  Check the insurance filing
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE REQUEST
          The whole request is one sentence, so it is set as one sentence with
          the three answers written into it. The other three forms on the site
          are a dark capture panel, a warm band under a heading and a column
          beside its fields, and this is none of them.

          The page ends here. No closing call to action: the footer carries
          one, and a "get a quote" band under a document request would be
          asking for the next thing before delivering the first. */}
      <section
        id="request"
        className="scroll-mt-24 bg-k-warm px-6 py-28 md:px-12 lg:px-24"
      >
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              Ask for the packet
            </h2>
          </Reveal>

          <Reveal className="pt-10">
            <PacketForm />
          </Reveal>

          <Reveal variant="settle">
            <p className="pt-10 font-text text-k-small text-k-ink-soft">
              Already set up and just need a price?{" "}
              <Link href="/quote" className="underline underline-offset-4">
                Send the lane
              </Link>
              . Or call{" "}
              <a href={site.phoneHref} className="underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
