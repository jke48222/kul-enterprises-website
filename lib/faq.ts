import faq from "@/content/faq.json";

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

export const FAQ_ITEMS = faq.items as FaqItem[];

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
