import { defineConfig } from "tinacms";
import {
  TOKENS,
  TOKENS_AND_LINKS,
  text,
  longText,
  paragraphs,
  image,
  cta,
  links,
  seo,
  page,
  group,
} from "./fields";

/**
 * TINACMS: THE EDITING LAYER OVER THE WHOLE SITE.
 *
 * Every word, number, photograph, link and list on this website is in a JSON
 * file under content/, and every one of those files is a collection below.
 * Edits made at /admin commit straight to the GitHub repository the client
 * owns, and Vercel redeploys from the commit. No database, no second copy of
 * the content, nothing to keep in sync.
 *
 * ------------------------------------------------------------------
 * WHAT IS EDITABLE AND WHAT IS NOT, ON PURPOSE
 * ------------------------------------------------------------------
 * Editable: all copy, every photograph and video, every button and where it
 * points, the navigation, the footer, the forms, the legal documents, and the
 * search engine listing for each page.
 *
 * Not editable: the layout, the typography, the motion, and the drawn marks.
 * Those are the design, they are measured, and several of them carry contrast
 * sums recorded in the components. A page builder that let those be dragged
 * around would break the thing the client paid for. See the notes at the top
 * of app/page.tsx and components/k/Footer.tsx for what that means in practice.
 *
 * ------------------------------------------------------------------
 * HOW THE SIDEBAR IS ORDERED
 * ------------------------------------------------------------------
 * Tina lists collections in the order they appear here, so they are grouped
 * the way somebody thinks about the site rather than the way the files sit on
 * disk: the things changed most often first, then a page each in menu order,
 * then the shared furniture, then the legal documents last.
 *
 * ------------------------------------------------------------------
 * RUNNING IT
 * ------------------------------------------------------------------
 * Locally:     npm run dev:cms   then open /admin
 * In production it needs a free Tina Cloud project connected to this repo,
 * with NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN set in the Vercel
 * environment and the build switched to `build:cms`. Until then the site
 * simply reads the JSON files directly, so nothing depends on Tina at runtime
 * and the site cannot break because the CMS is down.
 */
export default defineConfig({
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      /* ============================================================
         THE FACTS EVERY PAGE READS
         ============================================================ */
      {
        name: "site",
        label: "Business Facts",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Company name",
            description:
              "Change this and it changes everywhere on the site at once, including the search listings.",
            required: true,
          },
          text("legalName", "Legal name", "As registered. Used in the footer and the legal documents."),
          text("tagline", "Tagline, on one line"),
          {
            type: "string",
            name: "taglineLines",
            label: "Tagline, stacked",
            description: "One entry per line, as it appears in the opening film.",
            list: true,
          },
          text("usdot", "USDOT number", "Printed on the home page, the safety page, the carrier packet and the footer. Type it once here."),
          text("mc", "MC number", "Same as above: this is the only place it is written down."),
          text("email", "Dispatch email", "Form replies and every mailto link use this address."),
          text("phone", "Phone", "Digits and dashes, for example 678-972-1148. Every click-to-call link is built from it."),
          text("city", "City"),
          text("state", "State"),
          text("serviceArea", "Service area line", "For example: Southeast Based · Nationwide Authority."),
          text("url", "Website address", "The address this site is actually served from right now, with no trailing slash. It is not a label: when someone shares a link, the preview picture is fetched from this address, and search engines treat it as the site's real home. Point it at a domain the site is not on yet and the preview picture and the search listing both break. Change it on the day the new domain starts serving the site, not before."),
          {
            type: "object",
            name: "geo",
            label: "Map coordinates",
            description: "Used by search engines to place the business on a map.",
            fields: [
              { type: "number", name: "latitude", label: "Latitude" },
              { type: "number", name: "longitude", label: "Longitude" },
            ],
          },
        ],
      },

      /* ============================================================
         THE SEVEN SERVICES
         ============================================================ */
      {
        name: "services",
        label: "Services",
        path: "content",
        format: "json",
        match: { include: "services" },
        ui: {
          allowedActions: { create: false, delete: false },
          /**
           * The preview opens on the services page, because that is the one
           * address that shows all seven at once and this is a single document
           * holding all seven.
           *
           * KEEPING THEM IN ONE DOCUMENT IS THE REASON THE CLIENT CAN REORDER
           * THEM. A collection of seven separate files would give each its own
           * preview URL, and would take the drag handle away, because files in
           * a folder have no order. The order is what numbers the rows 01 to 07
           * on the home page, so it is worth more than a per-service route.
           *
           * Nothing is lost in the preview: from /services the client clicks
           * into any individual service and app/services/[slug] keeps editing
           * live, because it subscribes to this same document.
           */
          router: () => "/services",
        },
        fields: [
          {
            type: "object",
            name: "services",
            label: "Services",
            description:
              "Each one gets its own page automatically. Adding a service here adds it to the home page list, the services page, the carousel and the freight type dropdown on the quote form.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name || "Service" }) },
            fields: [
              text(
                "slug",
                "Web address (do not change)",
                "This is the page's address. Changing it breaks every existing link to this service.",
              ),
              text("name", "Name"),
              longText("short", "One-line summary", "Shown on the home page and the services list."),
              // NO PER-SERVICE TAGLINE FIELD. There used to be one, required,
              // and all seven values were invented slogans ("Cold chain,
              // unbroken", "When it cannot wait") of exactly the kind the
              // client banned. Nothing ever rendered them, so they sat in the
              // CMS waiting to be wired to a component. Do not add it back.
              longText("description", "Description", "The paragraph at the top of this service's own page."),
              paragraphs("bestFor", "Best for", "One entry per bullet."),
              paragraphs("commitments", "What we commit to", "One entry per bullet."),
              text("blurb", "Card blurb", "One short line under the name on the services page."),
              text("bestForShort", "Best for, in three or four words", "Used in the comparison list, so keep it short."),
              image("card", "Card photograph", "Portrait crop, shown on the services list."),
              image("wide", "Wide photograph", "Landscape crop, shown at the top of this service's page."),
              text("equipment", "Equipment", "For example: Tractor only, or 53 ft dry van."),
              text("equipmentNote", "Equipment note", "The small grey line under Equipment."),
              text("lane", "Typical lane", "For example: Regional, or Over the road."),
              text("laneNote", "Lane note", "The small grey line under Typical lane."),
              text("leadTime", "Lead time", "For example: 24 to 48 hrs. Type 'By contract' to print it without the words 'Lead time' in front."),
              {
                type: "object",
                name: "dimensions",
                label: "Trailer dimensions",
                description:
                  "The measurements printed on the blueprint drawing. These are book figures for a standard 53 foot van and nobody has put a tape over the real trailer, which is what the caveat under them says. Correct them here once they are measured.",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label ? `${item.label}: ${item.value ?? ""}` : "Dimension",
                  }),
                },
                fields: [
                  text("ref", "Drawing letter", "The letter used on the drawing: A, B, C and so on."),
                  text("label", "What is measured"),
                  text("value", "Measurement", "As it should read, for example 13 ft 6 in."),
                ],
              },
            ],
          },
        ],
      },

      /* ============================================================
         THE QUESTIONS
         ============================================================ */
      {
        name: "faq",
        label: "FAQ",
        path: "content",
        format: "json",
        match: { include: "faq" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Questions",
            description:
              "Shown on the home page, and given to Google as structured data so they can appear directly in search results.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.q || "Question" }) },
            fields: [
              text("q", "Question"),
              longText(
                "a",
                "Answer",
                "Heads up: the licensed-and-insured answer spells out the USDOT and MC numbers. Write them as {usdot} and {mc} so they can never disagree with Business Facts.",
              ),
            ],
          },
        ],
      },

      /* ============================================================
         ONE COLLECTION PER PAGE, IN MENU ORDER
         ============================================================ */
      page("homePage", "Home page", "home", [
        seo(),
        group("hero", "Opening film and headline", [
          {
            type: "string",
            name: "headlineLines",
            label: "Headline",
            description:
              "One entry per line. Two lines is what the design is measured for; a third will stack but read the note in app/page.tsx first, because this is the largest type on the site.",
            list: true,
          },
          longText("lede", "Sentence under the headline"),
          cta("primaryCta", "Filled button"),
          cta("secondaryCta", "Outlined button"),
          text("credentials", "Authority line", `Bottom left of the opening screen. ${TOKENS}`),
          text("locationLine", "Location line", `Bottom right, in gold. ${TOKENS}`),
          image("poster", "Film still", "Shown before the film loads, and instead of it for anyone who has asked their computer to reduce motion."),
        ]),
        group("statement", "The driver statement", [
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          cta("cta", "Link"),
        ]),
        group("equipment", "The equipment", [
          text("eyebrow", "Small gold label"),
          image("image", "Large truck drawing"),
          text("imageAlt", "Truck drawing description", "Read aloud to anyone using a screen reader. Describe what is in the picture."),
          {
            type: "object",
            name: "specs",
            label: "The four figures",
            description:
              "Four is what the row is built for: it is two across on a phone and four across on a desktop, so a fifth leaves a gap.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.value ?? ""} ${item?.label ?? ""}` }) },
            fields: [
              text("value", "Figure", "For example 53, or 45,000."),
              text("unit", "Unit", "Printed small beside the figure, for example ' ft'. Leave empty for none."),
              text("label", "What it is"),
              { type: "boolean", name: "accent", label: "Print this one in gold" },
            ],
          },
          {
            type: "object",
            name: "elevations",
            label: "The four small drawings",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "View" }) },
            fields: [
              image("image", "Drawing"),
              text("label", "Caption"),
              text("alt", "Description for screen readers"),
            ],
          },
        ]),
        group("services", "What we haul", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          longText("note", "Paragraph on the right"),
          {
            type: "object",
            name: "tags",
            label: "Equipment tag per service",
            description:
              "The small grey words closing each row. The service must match one in the Services collection, or its row simply closes with nothing.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.slug ?? ""}: ${item?.tag ?? ""}` }) },
            fields: [
              text("slug", "Service web address", "For example dry-van. Must match a service."),
              text("tag", "Tag"),
            ],
          },
        ]),
        group("vision", "The road ahead", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          cta("cta", "Button"),
          image("image", "Background photograph"),
        ]),
        group("faq", "Questions we get asked", [
          text("heading", "Headline"),
          longText("intro", "Sentence underneath", "Put {phone} where the number should fall and it becomes a working click-to-call link."),
        ]),
        group("closing", "The closing: lion, slogan, Jamaica", [
          image("mark", "The lion mark"),
          text("markAlt", "Lion description", "Read aloud to screen readers and shown if the image fails."),
          text("journeyLabel", "The line under the lion", "The lion and this line together are the door into the Journey."),
          {
            type: "object",
            name: "photos",
            label: "Jamaica photographs",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.alt ?? "Photograph" }) },
            fields: [
              image("image", "Photograph"),
              text("alt", "Description"),
            ],
          },
          text("photosCaption", "Word under the photographs"),
        ]),
      ], "/"),

      page("servicesPage", "Services page", "services-index", [
        seo(),
        group("title", "Title row", [
          text("heading", "Page title"),
          text("serviceAreaBefore", "Service line, first part", "For example: Serving"),
          text("serviceAreaHighlight", "Service line, underlined part", TOKENS),
          text("serviceAreaAfter", "Service line, last part", "For example: and 48 states"),
          text("countSuffix", "Word after the number of services", "The number itself is counted automatically."),
        ]),
        group("compare", "The comparison list", [
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          text("quoteLabel", "Quote button on each row"),
          text("detailLabel", "Words after the service name on the detail link", "For example: in detail"),
          text("leadTimePrefix", "Words before the lead time", "For example: Lead time"),
          group("labels", "Column headings", [
            text("equipment", "Equipment column"),
            text("lane", "Lane column"),
            text("bestFor", "Best for column"),
          ]),
        ]),
        group("detail", "Wording on every individual service page", [
          text("metaTitleSuffix", "Words after the service name in the search result"),
          longText("metaDescriptionTail", "Words after the service name in the search summary"),
          text("quoteCta", "Filled button"),
          text("callCta", "Outlined button"),
          text("bestForLabel", "Best for heading"),
          text("commitmentsLabel", "Commitments heading"),
          text("sizeHeading", "Dimensions section heading"),
          longText(
            "dimensionsCaveat",
            "Line under the measurements",
            "THIS SENTENCE IS LOAD BEARING. The figures are nominal for a standard van and nobody has measured the real trailer. A broker could quote against them. Do not delete it; if the trailer is ever measured, change the words rather than dropping them.",
          ),
          text("previousLabel", "Previous service label"),
          text("nextLabel", "Next service label"),
        ]),
        group("howItMoves", "How a load moves", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          cta("cta", "Button"),
          {
            type: "object",
            name: "steps",
            label: "The four steps",
            description:
              "The drawn mark beside each step is chosen by its number, and only 01 to 04 have one. A fifth step would print without a mark.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.n ?? ""} ${item?.name ?? ""}` }) },
            fields: [
              text("n", "Number", "01, 02, 03 or 04. This is what picks the drawing."),
              text("name", "Step name"),
              longText("body", "Paragraph"),
            ],
          },
        ]),
      ], "/services"),

      page("driversPage", "Drivers page", "drivers", [
        seo(),
        group("film", "The film behind the notice", [
          text(
            "video",
            "Which film plays",
            "The file name with no .mp4 on the end, for example dash-daylight. It plays in colour on this page. Both that file and its -720 version have to be in the videos folder.",
          ),
          image("poster", "The still shown before it loads"),
        ]),
        group("notice", "The notice at the top", [
          text("heading", "Page title"),
          longText("lead", "The bold line"),
          longText(
            "body",
            "The paragraph under it",
            "This paragraph must stay plain with applicants: there is no seat today and no start date to give, and a driver is being asked for a licence number and a work history all the same.",
          ),
        ]),
        group("seat", "The seat, when it opens", [
          text("heading", "Section heading"),
          {
            type: "object",
            name: "rows",
            label: "What the job is",
            description:
              "Each entry prints as one paragraph with its opening words in bold. Keep the bold part to two or three words or it stops reading as a sentence.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.lead || "Row" }) },
            fields: [
              text("lead", "Bold opening", "Include the full stop, for example: The licence."),
              longText("body", "The rest of the sentence"),
            ],
          },
          {
            type: "object",
            name: "rail",
            label: "The two cards beside it",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Card" }) },
            fields: [
              text("label", "Small heading"),
              longText("body", "Paragraph"),
              cta("cta", "Link", "Leave the text empty for no link."),
            ],
          },
        ]),
        group("form", "The application form", [
          text("heading", "Section heading"),
          longText("intro", "Sentence above the form"),
          text("equalOpportunityLine", "Line under the form", TOKENS),
        ]),
      ], "/drivers"),

      page("safetyPage", "Safety page", "safety", [
        seo(),
        group("opening", "The opening", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          longText("lede", "Paragraph"),
        ]),
        group("credentials", "Authority and insurance", [
          text("heading", "Section heading"),
          image("decal", "Photograph of the door decal"),
          text("decalAlt", "Decal description for screen readers", TOKENS),
          {
            type: "object",
            name: "items",
            label: "The checkable facts",
            description:
              "EVERY LINE HERE MUST BE SOMETHING A BROKER CAN CHECK WITHOUT ASKING US. That is the whole argument of this page, and a line that cannot be checked undoes the rest of it.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Fact" }) },
            fields: [
              text("label", "What it is"),
              text("value", "The value", TOKENS),
              text("note", "The note beside it"),
              text("href", "Link the note to", "Leave empty for plain text. Accepts a page like /carrier-packet or a full web address."),
            ],
          },
        ]),
        group("dashcam", "The dashcam band", [
          text("video", "Video name", "The file in public/videos, without the extension. Currently dash-night."),
          image("poster", "Still frame"),
          longText("caption", "Sentence over the film"),
        ]),
        group("commitments", "What we hold ourselves to", [
          text("heading", "Section heading"),
          text("note", "Line underneath"),
          {
            type: "object",
            name: "items",
            label: "The clauses",
            description:
              "The drawn mark beside each clause is chosen by the Mark name below, and only four drawings exist. A clause with any other name prints without one.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Clause" }) },
            fields: [
              {
                type: "string",
                name: "icon",
                label: "Mark",
                options: ["maintenance", "hours", "communication", "cargo"],
              },
              text("title", "Clause heading"),
              longText("body", "Clause"),
            ],
          },
        ]),
        group("testimonials", "Customer quotations", [
          text("heading", "Section heading"),
          {
            type: "object",
            name: "items",
            label: "Quotations",
            description:
              "EMPTY ON PURPOSE, and the whole section stays hidden while it is. Add the first real one and the section appears by itself. NEVER PUBLISH ONE NOBODY SAID: the argument of this entire page is that every line on it can be checked, and an invented quotation cannot.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.company || "Quotation" }) },
            fields: [
              longText("quote", "What they said"),
              text("name", "Who said it"),
              text("company", "Their company"),
              text("lane", "The lane"),
            ],
          },
        ]),
      ], "/safety"),

      page("carrierPacketPage", "Carrier Packet page", "carrier-packet", [
        seo(),
        group("start", "The opening", [
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          cta("cta", "Button"),
          text("listLabel", "Heading above the list"),
          {
            type: "object",
            name: "documents",
            label: "What is in the packet",
            description:
              "NO TURNAROUND IS PROMISED ANYWHERE ON THIS PAGE and none should be added. The certificate of insurance is issued by the agent rather than by KUL, so it is not KUL's to promise.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name || "Document" }) },
            fields: [
              text("name", "Document"),
              longText("note", "Who issues it and what it is"),
              text(
                "file",
                "Download file",
                "Leave empty until the real document exists; an empty field means the row simply has no download. When it arrives, put the file in public/packet and write its address here, for example /packet/w9.pdf.",
              ),
            ],
          },
        ]),
        group("record", "The federal record", [
          text("heading", "Section heading"),
          {
            type: "object",
            name: "rows",
            label: "The record",
            description:
              "Only what the federal register itself shows, under its own labels. The fleet counts were removed at the first walkthrough and must not come back; the SAFER links below let a broker read them from the government instead.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.field ?? ""}: ${item?.value ?? ""}` }) },
            fields: [text("field", "Field"), text("value", "Value", TOKENS)],
          },
          longText("note", "Line under the record"),
          links("links", "The two government lookups"),
        ]),
        group("request", "The request form", [
          text("heading", "Section heading"),
          longText("footnote", "Line under the form"),
        ]),
      ], "/carrier-packet"),

      page("aboutPage", "About page", "about", [
        seo(),
        group("opening", "The opening", [
          text("heading", "Headline"),
          text("caption", "Small line above the photograph", `This describes the company, not the photograph. ${TOKENS}`),
          image("image", "Photograph"),
          text("imageAlt", "Photograph description"),
        ]),
        group("community", "The belief", [
          text("eyebrow", "Small label in the margin", TOKENS),
          longText(
            "statement",
            "The line set large",
            "One sentence. The same sentence closes the page in Our Commitment below; if it changes here, change it there too.",
          ),
          paragraphs("paragraphs", "The paragraphs under it", "Two paragraphs."),
        ]),
        group("founding", "More than transportation", [
          text("eyebrow", "Small gold label"),
          longText(
            "lead",
            "The founding belief, set large on the left",
            "Keep it to a sentence or two. If it grows past that it stops reading as a lead.",
          ),
          paragraphs("paragraphs", "The paragraphs on the right"),
        ]),
        group("experience", "Built through experience", [
          text("eyebrow", "Small gold label"),
          paragraphs(
            "paragraphs",
            "The column of text",
            "Four short paragraphs beside the film. The column is narrow, so a long paragraph reads as a wall.",
          ),
          image("posterImage", "Still frame behind the film"),
          text("posterImageAlt", "Still frame description"),
          text("video", "Video file", "The dashcam clip that plays in place of the still."),
        ]),
        group("standards", "The way we do business", [
          text("eyebrow", "Small label"),
          paragraphs(
            "paragraphs",
            "The paragraphs above the grid",
            "The last entry is the lead-in that ends with a colon.",
          ),
          {
            type: "string",
            name: "commitments",
            label: "The six commitments",
            description:
              "One entry per square on the grid. Keep each to a few words: they are set at display size, and one that wraps to three lines stops reading as a standard.",
            list: true,
          },
          longText("closing", "The line under the grid"),
        ]),
        group("forward", "Looking forward", [
          text("eyebrow", "Small gold label"),
          paragraphs(
            "paragraphs",
            "The column of text",
            "Growth in words, not figures. The numbers live on the Road Ahead page; keep them there so the two pages cannot drift apart.",
          ),
        ]),
        group("commitment", "Our commitment", [
          text("eyebrow", "Small gold label"),
          paragraphs("paragraphs", "The quiet paragraphs"),
          longText(
            "closing",
            "The last line, set large",
            "The same sentence the page opened on, on purpose. If it changes in The Belief above, change it here too.",
          ),
        ]),
        group("imprint", "The particulars", [
          longText(
            "statement",
            "The sentence beside the mark",
            "It is the tagline, filled in by the {tagline} token, so the words live once in Business Facts.",
          ),
          image("logo", "The mark"),
          {
            type: "object",
            name: "particulars",
            label: "The particulars",
            description:
              "Five columns of small print at the foot of the page. Their widths are uneven on purpose so the block ends on a ragged edge; that is the design, not an accident. A sixth will wrap to a new row.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Entry" }) },
            fields: [
              text("label", "Heading"),
              { type: "boolean", name: "gold", label: "Print the heading in gold" },
              longText("body", "The entry", "A blank line starts a new line of text."),
            ],
          },
        ]),
      ], "/about"),

      /**
       * THE JOURNEY: A FILM AND AN INDEX.
       *
       * The seventeen-scene scroll build and every line of its screenplay
       * were removed at the first walkthrough (project-docs/32): the page
       * starts fresh as a documentary film. A dashcam clip stands in until
       * the real film arrives from Mark's family; the index entries are
       * placeholders for the film's eventual sections.
       */
      page("journeyPage", "The Journey page", "journey", [
        seo(),
        group("film", "The film", [
          text(
            "video",
            "Which film plays",
            "The file name with no .mp4 on the end. A dashcam clip stands in until the real Journey film arrives; the day it lands, put the file and its -720 version in the videos folder and change this.",
          ),
          image("poster", "The still shown before it loads"),
        ]),
        text("exitLabel", "The leave control", "Read to screen readers and shown at the top right."),
        text("exitHint", "The keys reminder", "For example: Esc or space"),
        text("pauseLabel", "The pause control's word"),
        text("playLabel", "The play control's word"),
        text("indexLabel", "The word above the index"),
        {
          type: "object",
          name: "chapters",
          label: "The index",
          description:
            "Each entry is a click-to-jump point in the film: a name and the second it starts at. Placeholders until the real film arrives with its own sections.",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label || "Chapter" }) },
          fields: [
            text("label", "Section name"),
            { type: "number", name: "time", label: "Starts at (seconds)" },
          ],
        },
      ], "/journey"),

      page("roadAheadPage", "Road Ahead page", "road-ahead", [
        seo(),
        group("opening", "The opening", [
          text("heading", "Headline"),
          longText("body", "Paragraph"),
        ]),
        group("position", "Where it stands today", [
          text("eyebrow", "Small label"),
          group("leadFigure", "The large figure", [
            text("value", "Figure"),
            text("label", "What it is"),
            longText("note", "The note under it"),
          ]),
          {
            type: "object",
            name: "facts",
            label: "The three figures beside it",
            description: "CHANGE THESE THE DAY THEY ARE TRUE, and not before.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.value ?? ""} ${item?.label ?? ""}` }) },
            fields: [text("value", "Figure"), text("label", "What it is"), longText("note", "The note under it")],
          },
        ]),
        group("plan", "The plan", [
          text("heading", "Section heading"),
          {
            type: "object",
            name: "stages",
            label: "The stages",
            description:
              "In the order they have to happen. A STATUS, NEVER A DATE: nothing on this page is dated until it is booked. When a stage is done, set its status to Done and leave it in place so the page keeps its own record.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.n ?? ""} ${item?.title ?? ""}` }) },
            fields: [
              text("n", "Number"),
              text("title", "Stage"),
              text("status", "Status", "For example: Next, After that, Done."),
              longText("body", "Paragraph"),
            ],
          },
        ]),
        group("fixed", "What does not change", [
          text("heading", "Section heading"),
          paragraphs("items", "The list", "One entry per line."),
        ]),
        group("limits", "What this page is not", [
          text("heading", "Section heading"),
          longText("body", "Paragraph"),
        ]),
      ], "/road-ahead"),

      page("quotePage", "Quote page", "quote", [
        seo(),
        group("opening", "The opening", [
          text("heading", "Headline"),
          longText("body", "Paragraph"),
        ]),
        group("request", "Beside the form", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          text("skipLabel", "Label above the phone number"),
          longText("skipNote", "Line under the phone number"),
          {
            type: "object",
            name: "nextSteps",
            label: "What happens next",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Step" }) },
            fields: [text("title", "Small gold heading"), longText("body", "Paragraph")],
          },
        ]),
        group("credentials", "The closing row of facts", [
          paragraphs("items", "The facts", `One entry each. ${TOKENS}`),
          text("locationLine", "The gold line on the right", TOKENS),
        ]),
      ], "/quote"),

      page("contactPage", "Contact page", "contact", [
        seo(),
        group("opening", "The opening", [
          text("heading", "Headline"),
          longText("lede", "Paragraph"),
        ]),
        group("locationCard", "The location card", [
          image("image", "Photograph"),
          text("imageAlt", "Photograph description", "Describe what is actually in the picture. This one is an empty road, not a truck."),
          text("heading", "Card heading", TOKENS),
          paragraphs("addressLines", "Left column", `One entry per line. ${TOKENS}`),
          paragraphs("hoursLines", "Right column", `One entry per line. ${TOKENS}`),
          cta("emailCta", "Filled button"),
          cta("mapCta", "Link beside it"),
        ]),
        group("dispatchCard", "The dispatch card", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          cta("cta", "Button"),
        ]),
        group("routes", "Where to send it", [
          text("heading", "Section heading"),
          longText("intro", "Paragraph"),
          {
            type: "object",
            name: "items",
            label: "The rows",
            description: "One row per reason somebody writes in. The whole row is the link.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Row" }) },
            fields: [
              text("label", "Reason"),
              longText("body", "What to send"),
              text("action", "The gold words on the right"),
              text("href", "Where the row goes"),
            ],
          },
        ]),
        group("map", "The service area map", [text("heading", "Headline")]),
        group("catchAll", "Anything else", [
          text("heading", "Section heading"),
          text("emailLabel", "The address", TOKENS),
        ]),
      ], "/contact"),

      /**
       * NO route ON THIS ONE. Every other page collection wires `route` to
       * its real address, which is what lets the visual editor open a live
       * preview beside the fields. This page has no address of its own: it
       * renders for whatever wrong URL somebody typed, and there is no
       * single path that would preview it correctly. It still gets the
       * ordinary form, which edits the same content just as well.
       */
      page("notFoundPage", "Page Not Found (404)", "not-found", [
        seo(),
        group("hero", "The whole page", [
          text(
            "video",
            "Which film plays behind it",
            "The file name with no .mp4 on the end, for example kul-hero or dash-night. It plays in black and white on this page. Both that file and its -720 version have to be in the videos folder.",
          ),
          image("poster", "Still shown before the film starts"),
          text("numeral", "The very large number"),
          text("heading", "Headline"),
          longText("subheading", "Line under the headline"),
          cta("cta", "Button", "The only way out on this page. It should go to the home page."),
        ]),
      ]),

      /* ============================================================
         THE SHARED FURNITURE
         ============================================================ */
      {
        name: "navigation",
        label: "Menu & Footer",
        path: "content",
        format: "json",
        match: { include: "navigation" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          group(
            "bar",
            "The menu bar",
            [
              links("leftLinks", "Left of the lion", "The freight: what we haul, who drives it, how it is kept safe, and the paperwork a broker needs."),
              links("rightLinks", "Right of the lion", "The company and the conversation."),
              links("menuOnlyLinks", "In the menu only", "Pages the bar has no room for. THE BAR IS FULL: adding a link to either side above will start clipping it on medium screens. Read the note on MENU_BREAKPOINT in components/k/Nav.tsx before moving anything up."),
            ],
            "Each link can also name a preview panel. Leave that alone unless a panel has been built for the page.",
          ),
          group("footer", "The footer", [
            text("heading", "Headline"),
            text("dispatchLead", "The bold line above the contact links"),
            text("pagesLabel", "Heading above the page list"),
            links("pages", "The page list", "In the order a stranger reads the company: what it hauls, whether it is safe, what to send a broker, who it is, where it came from, where it is going, who it is hiring, how to talk."),
            text("authorityLabel", "Heading above the numbers"),
            text("usdotLabel", "USDOT label"),
            text("mcLabel", "MC label"),
            text("verifyLabel", "Verify button"),
            text("verifyHref", "Verify button link", TOKENS),
            text("copyright", "Copyright line", `The year is added automatically. ${TOKENS}`),
            links("legalLinks", "Legal links"),
            image("logo", "The mark in the corner"),
          ]),
          group("legalChrome", "Wording shared by the legal documents", [
            text("updatedPrefix", "Before the date", "For example: Last updated"),
            text("indexLabel", "Heading above the clause list"),
            text("otherDocumentsLabel", "Heading above the other documents"),
            longText("questionLine", "The closing line"),
            links("documents", "The five documents", "Each document links to the other four from this list."),
          ]),
        ],
      },

      {
        name: "search",
        label: "Search",
        path: "content",
        format: "json",
        match: { include: "search" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          text(
            "label",
            "What the search is called",
            "Read aloud by screen readers on the magnifier button, and carried by the panel itself.",
          ),
          text(
            "placeholder",
            "The grey line in the empty box",
            "The invitation. Before anything is typed the panel is only this box, so this line does the welcoming.",
          ),
          longText(
            "empty",
            "The line when nothing matches",
            "Write {query} where the words the visitor typed should be quoted back.",
          ),
          longText("emptyAction", "The line under it", "A good place for the phone number."),
        ],
      },

      {
        name: "forms",
        label: "Forms",
        path: "content",
        format: "json",
        match: { include: "forms" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          group("shared", "Used by every form", [
            text("sendingLabel", "Button text while sending"),
            longText("genericError", "Fallback failure message"),
          ]),
          ...(
            [
              ["quote", "Quote form", ["origin", "destination", "freightType", "pickupDate", "contact", "details"]],
              ["contact", "Contact form", ["name", "email", "message"]],
              ["driver", "Driver form", ["name", "contact", "experience", "note"]],
              ["packet", "Carrier packet form", ["company", "authority", "email"]],
            ] as const
          ).map(([name, label, fieldNames]) =>
            group(name, label, [
              ...(name === "packet"
                ? [
                    group("sentence", "The sentence around the blanks", [
                      text("before", "Before the company name"),
                      text("afterCompany", "After the company name"),
                      text("afterAuthority", "After the authority number"),
                      text("end", "After the address"),
                    ]),
                  ]
                : []),
              group(
                "fields",
                "The questions",
                fieldNames.map((f) =>
                  group("" + f, f, [
                    text("label", "Question"),
                    text("placeholder", "Example answer, shown greyed out"),
                    ...(f === "experience"
                      ? [paragraphs("options", "The choices", "One entry per option in the dropdown.")]
                      : []),
                    ...(f === "freightType"
                      ? [
                          text(
                            "notSureOption",
                            "The last option",
                            "The freight types themselves come from the Services collection, so adding a service adds it here automatically.",
                          ),
                        ]
                      : []),
                  ]),
                ),
              ),
              longText("consent", "The agreement text"),
              text("submitLabel", "Send button"),
              text("successHeading", "Confirmation heading"),
              ...(name === "contact" || name === "driver"
                ? [text("successThanks", "Thank you line", "Write {sender} where their name should go.")]
                : []),
              longText("successBody", "Confirmation paragraph"),
              longText("successAnnouncement", "Read aloud on success", "Heard by anyone using a screen reader. Never seen on the page."),
              longText("error", "Failure message"),
            ]),
          ),
        ],
      },

      /* ============================================================
         THE LEGAL DOCUMENTS
         ============================================================ */
      {
        name: "legal",
        label: "Legal documents",
        path: "content/legal",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          /**
           * Unlike the page collections, this one holds five documents rather
           * than one, so the route cannot be a constant. Each document's
           * filename is its address: privacy-policy.json is served at
           * /privacy-policy. That is a convention rather than a coincidence,
           * and it is the reason creating documents here is switched off. A
           * sixth file would need its own folder under app/ before it had a
           * page to preview.
           */
          router: ({ document }) => `/${document._sys.filename}`,
        },
        fields: [
          seo(),
          text("eyebrow", "Breadcrumb label", "Usually Legal."),
          text("title", "Document title"),
          text("updated", "Last updated", "For example: July 2026. Update it whenever a clause changes."),
          longText("pull", "Opening statement", "One sentence set large before the document. Leave empty for none."),
          {
            type: "object",
            name: "sections",
            label: "Clauses",
            description:
              "One box per clause. Inside a clause: leave a BLANK LINE between paragraphs, start a line with '- ' for a bullet, start a line with '* ' for a list item with no bullet, and write 'Term :: what it means' for a defined term. A link is [the words you see](/the-page).",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "Clause" }) },
            fields: [
              text("heading", "Clause heading"),
              {
                type: "string",
                name: "body",
                label: "Clause",
                description: TOKENS_AND_LINKS,
                ui: { component: "textarea" },
              },
              {
                type: "boolean",
                name: "onlyWithAnalytics",
                label: "Only show when analytics is switched on",
                description:
                  "For the cookie page's traffic measurement clause. It is hidden unless the site is actually running Google Analytics, so the page can never describe measurement that is switched off.",
              },
            ],
          },
        ],
      },
    ],
  },
});
