import type { Metadata } from "next";
import PacketForm from "@/components/forms/PacketForm";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill, link, linkHref } from "@/lib/content";
import page from "@/content/pages/carrier-packet.json";

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
  title: fill(page.meta.title),
  description: fill(page.meta.description),
};

/**
 * WHAT IS IN THE PACKET, AND WHO ACTUALLY ISSUES EACH ONE.
 *
 * The certificate of insurance matters most of the four. A carrier cannot
 * issue its own certificate, the agent does, which is why no turnaround is
 * promised for it. Do not add one in the CMS.
 *
 * THE FEDERAL RECORD BELOW IT is set out in the register's own vocabulary, and
 * every value is either a token filled from Business Facts or a plain count.
 * CHANGE THE COUNTS THE DAY A SECOND TRUCK OR A SECOND DRIVER IS REAL, and not
 * before. Power units and drivers both read 1 on purpose: a broker who learns
 * that later feels misled, and one who reads it here reads it as candour.
 */

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
          <Breadcrumb
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "Carrier Packet" }]}
          />

          <div className="max-w-[640px]">
            <Reveal variant="wipe">
              <h1 className="font-display text-k-d1 font-black text-k-ink">
                {fill(page.start.heading)}
              </h1>
            </Reveal>

            <Reveal>
              {/* Cut from five clauses to two on 29 Jul 2026. The original
                  explained that there are no files on the page, who sends
                  them, that they arrive as a reply, which two matter most and
                  that both can be read without asking. The federal record is
                  linked in its own section further down with the same point
                  made there, so this only has to say what to do here. */}
              <Copy
                text={page.start.body}
                className="pt-8 font-text text-k-body text-k-ink-soft"
                linkClassName="underline underline-offset-4"
              />
            </Reveal>

            <Reveal variant="settle">
              <a
                href={link(page.start.cta).href}
                className="mt-9 inline-flex w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90"
              >
                {link(page.start.cta).label}
              </a>
            </Reveal>

            <RuleDraw className="mt-14" />

            <Reveal variant="settle">
              <h2 className="pt-10 font-text text-k-micro uppercase text-k-ink-soft">
                {fill(page.start.listLabel)}
              </h2>
            </Reveal>

            <ol className="flex flex-col gap-6 pt-6">
              {page.start.documents.map((doc, i) => (
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
                      {fill(doc.name)}
                    </span>
                    <Copy
                      as="span"
                      text={doc.note}
                      className="font-text text-k-small text-k-ink-soft"
                      linkClassName="underline underline-offset-4"
                    />
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
              {fill(page.record.heading)}
            </h2>
          </Reveal>

          <div className="mt-9 max-w-[820px]">
            {page.record.rows.map((row, i) => (
              <div key={row.field} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal
                  variant="settle"
                  index={i}
                  className="flex flex-wrap items-baseline gap-x-8 gap-y-1 py-4"
                >
                  <span className="w-[220px] shrink-0 font-text text-k-micro uppercase text-k-ink-soft">
                    {fill(row.field)}
                  </span>
                  <span className="font-text text-k-body tabular-nums text-k-ink">
                    {fill(row.value)}
                  </span>
                </Reveal>
              </div>
            ))}
            <RuleDraw index={page.record.rows.length} />

            <Reveal variant="settle" className="flex flex-col gap-3 pt-8">
              <Copy
                text={page.record.note}
                className="max-w-[62ch] font-text text-k-small text-k-ink-soft"
                linkClassName="underline underline-offset-4"
              />
              {/* These open in a new tab because they leave for a government
                  site, and a broker checking the record should not lose the
                  page they were checking it against. */}
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {page.record.links.map((item) => (
                  <a
                    key={item.href}
                    href={linkHref(item.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-text text-k-small font-semibold text-k-gold underline underline-offset-4"
                  >
                    {fill(item.label)}
                  </a>
                ))}
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
              {fill(page.request.heading)}
            </h2>
          </Reveal>

          <Reveal className="pt-10">
            <PacketForm />
          </Reveal>

          <Reveal variant="settle">
            <Copy
              text={page.request.footnote}
              className="pt-10 font-text text-k-small text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
