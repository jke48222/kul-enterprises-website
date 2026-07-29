"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import LegalPage from "@/components/k/LegalPage";
import { Prose } from "@/components/k/Copy";
import { fill } from "@/lib/content";
import type { TinaPage } from "@/lib/tina";

/**
 * The half that draws. app/legal-notices/page.tsx fetches and hands the document down;
 * this subscribes with useTina so the document redraws in /admin as the client
 * edits a clause.
 *
 * THE CLAUSES ARE ONE TEXT BOX EACH. Inside a clause, leave a blank line
 * between paragraphs, start a line with "- " for a bullet, with "* " for an
 * unmarked item, and write "Term :: what it means" for a defined term. A link
 * is [the words you see](/the-page). See components/k/Copy.tsx.
 */
type Content = typeof import("@/content/legal/legal-notices.json");

export default function LegalNoticesView(props: TinaPage<{ legal: unknown }>) {
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const doc = data.legal as unknown as Content;

  return (
    <LegalPage
      titleField={tinaField(doc, "title")}
      eyebrow={fill(doc.eyebrow)}
      title={fill(doc.title)}
      updated={doc.updated}
      sectionFields={(doc.sections ?? [])
        .filter((s) => !s.onlyWithAnalytics || Boolean(process.env.NEXT_PUBLIC_GA_ID))
        .map((s) => tinaField(s, "heading"))}
      sections={(doc.sections ?? [])
        // A clause marked "only when analytics is on" is dropped from the
        // document unless the site is actually running Google Analytics. It is
        // the same build-time flag that renders the tag in app/layout.tsx, so
        // this page can never describe measurement that is switched off.
        .filter((s) => !s.onlyWithAnalytics || Boolean(process.env.NEXT_PUBLIC_GA_ID))
        .map((s) => ({
          heading: fill(s.heading),
          body: <Prose text={s.body} linkClassName="underline underline-offset-2" />,
        }))}
    />
  );
}
