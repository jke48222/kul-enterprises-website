"use client";

import PacketForm from "@/components/forms/PacketForm";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill, link, linkHref } from "@/lib/content";
import { useTina, tinaField } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";

/**
 * CARRIER PACKET, THE HALF THAT DRAWS.
 *
 * app/carrier-packet/page.tsx fetches on the server and hands the result down. This half
 * subscribes with useTina, which is what makes the visual editor work: inside
 * /admin the page redraws as the client types, and any element carrying a
 * data-tina-field can be clicked to jump straight to its field.
 *
 * Outside the editor useTina hands back exactly what it was given, so on the
 * live site this renders once and costs nothing.
 *
 * The markup below was moved here unchanged. Only the data source differs: it
 * is the live document now rather than the JSON file, and lib/tina.ts falls
 * back to that file whenever Tina cannot be reached.
 */

/**
 * The shape of the content, taken from the file itself.
 *
 * Tina's generated types mark every field optional because every field in
 * the CMS can be emptied, which would mean writing `?.` through markup that
 * is otherwise readable. The JSON on disk is the canonical shape and the
 * schema mirrors it, so the live data is read against that. `typeof
 * import(...)` is type-only and adds nothing to the browser bundle.
 *
 * Fields really can come back empty, so fill() and link() tolerate null and
 * every list is guarded before it is mapped.
 */
type Content = typeof import("@/content/pages/carrier-packet.json");

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
 * THE HONEST POSITION, AND WHY THE PAGE IS SHAPED LIKE THIS. KUL has not yet
 * supplied the real documents, and this page does not pretend otherwise: the
 * download machinery below is built and waiting, but every document row
 * ships with an empty `file` field, so nothing renders as downloadable until
 * a real file exists. What the page can do meanwhile is tell a broker where
 * each document comes from, hand them the facts they can check for
 * themselves right now, and take the request in three fields.
 *
 * THE PLACEHOLDER DOCUMENTS ARE DEV-ONLY. public/packet/ holds watermarked
 * placeholder PDFs for building against, and that folder is gitignored so
 * they can never deploy. The day Mark's real documents arrive: commit them
 * to public/packet (remove the ignore line), and write each file's address
 * into its row's "Download file" field in the CMS. Nothing else changes.
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
 * The fleet counts it used to carry came off at the first walkthrough
 * (project-docs/32) and must not come back; the SAFER links let a broker
 * read those from the government's own page instead.
 */


/**
 * WHAT IS IN THE PACKET, AND WHO ACTUALLY ISSUES EACH ONE.
 *
 * The certificate of insurance matters most of the four. A carrier cannot
 * issue its own certificate, the agent does, which is why no turnaround is
 * promised for it. Do not add one in the CMS.
 *
 * THE FEDERAL RECORD BELOW IT is set out in the register's own vocabulary,
 * and every value is a token filled from Business Facts or a plain label.
 * The fleet counts were removed at the first walkthrough and stay removed.
 */

export default function CarrierPacketView(props: TinaPage<{ carrierPacketPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.carrierPacketPage as unknown as Content;

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
              <h1
              data-tina-field={tinaField(page.start, "heading")}
              className="font-display text-k-d1 font-black text-k-ink"
            >
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
              <h2
              data-tina-field={tinaField(page.start, "listLabel")}
              className="pt-10 font-text text-k-micro uppercase text-k-ink-soft"
            >
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
                    {/* The download exists the moment the CMS names a file,
                        and not a moment before. Rows ship empty until Mark's
                        real documents land; see the header note. */}
                    {fill(doc.file) ? (
                      <a
                        href={fill(doc.file)}
                        download
                        className="w-fit border-b border-k-gold pb-0.5 font-text text-k-micro uppercase text-k-gold"
                      >
                        Download
                      </a>
                    ) : null}
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
            <h2
              data-tina-field={tinaField(page.record, "heading")}
              className="font-text text-k-micro uppercase text-k-ink-soft"
            >
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
                    /* Standalone controls in a row of their own, so 24px of
                       target applies and a 22px line box was short. The 8px row
                       gap absorbs the 2px the pseudo-element adds each side. */
                    className="relative font-text text-k-small font-semibold text-k-gold underline underline-offset-4 before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-['']"
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
            <h2
              data-tina-field={tinaField(page.request, "heading")}
              className="font-display text-k-d3 font-black text-k-ink"
            >
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
