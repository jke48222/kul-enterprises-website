import faq from "@/content/faq.json";
import { fill } from "@/lib/content";

/**
 * THE QUESTIONS, AND THE STRUCTURED DATA THAT MIRRORS THEM.
 *
 * This module has no "use client" on it, and that is the whole reason it
 * exists. The FAQ section itself has to be a client component because it opens
 * and closes, but the FAQPage JSON-LD has to be emitted by the server, and a
 * server component cannot call a function that lives in a client module. The
 * first attempt put the builder next to the component and the home page threw:
 *
 *   Attempted to call faqJsonLd() from the server but faqJsonLd is on the
 *   client.
 *
 * So the data and the builder live here, where both sides can read them, and
 * the questions can never drift apart: the words on the page and the words in
 * the search result come out of the same array.
 */

export type FaqItem = { q: string; a: string };

/**
 * Filled ONCE, here, for both consumers. The answers may carry {tokens}
 * ({usdot}, {mc}, {location} and the rest), so an authority-number edit in
 * Business Facts reaches the FAQ and its JSON-LD without anyone remembering
 * this file exists. The literals this replaced were the one place on the
 * site a number was typed twice.
 */
export const FAQ_ITEMS: FaqItem[] = (faq.items as FaqItem[]).map((item) => ({
  q: fill(item.q),
  a: fill(item.a),
}));

/** The same eight questions as schema.org FAQPage. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
