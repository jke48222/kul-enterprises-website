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
          text("url", "Website address", "Leave as-is unless the domain changes."),
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
        ui: { allowedActions: { create: false, delete: false } },
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
        group("journey", "The Journey invitation", [
          text("eyebrow", "Small gold label"),
          text("heading", "Headline"),
          longText("body", "Paragraph"),
          cta("cta", "Link"),
          image("image", "Photograph"),
          text("imageAlt", "Photograph description"),
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
      ]),  // visual editing not wired yet; route is "/services"

      page("driversPage", "Drivers page", "drivers", [
        seo(),
        group("notice", "The notice at the top", [
          text("heading", "Page title"),
          longText("lead", "The bold line"),
          longText(
            "body",
            "The paragraph under it",
            "This is the one place on the site that still says plainly that the seat opens with the second truck, and it has to. A driver is being asked for a licence number and a work history for a seat that does not exist yet.",
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
      ]),  // visual editing not wired yet; route is "/drivers"

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
      ]),  // visual editing not wired yet; route is "/safety"

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
            fields: [text("name", "Document"), longText("note", "Who issues it and what it is")],
          },
        ]),
        group("record", "The federal record", [
          text("heading", "Section heading"),
          {
            type: "object",
            name: "rows",
            label: "The record",
            description:
              "CHANGE THE COUNTS THE DAY A SECOND TRUCK OR A SECOND DRIVER IS REAL, and not before. Power units and drivers both read 1 on purpose.",
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
      ]),  // visual editing not wired yet; route is "/carrier-packet"

      page("aboutPage", "About page", "about", [
        seo(),
        group("opening", "The opening", [
          text("heading", "Headline"),
          text("caption", "Small line above the photograph", `This describes the company, not the photograph. ${TOKENS}`),
          image("image", "Photograph"),
          text("imageAlt", "Photograph description"),
        ]),
        group("founder", "The founder's note", [
          text("eyebrow", "Small gold label"),
          paragraphs("paragraphs", "The note", "Three paragraphs. A fourth pushes the signature off the picture beside it."),
          text("signatureName", "Name"),
          text("signatureRole", "Role", TOKENS),
          image("posterImage", "Still frame beside the note"),
          text("posterImageAlt", "Still frame description"),
          text("video", "Video file", "The dashcam clip that plays in place of the still."),
        ]),
        group("today", "How it runs today", [
          text("eyebrow", "Small label"),
          paragraphs(
            "paragraphs",
            "The statement",
            "Two paragraphs. At this size the type is doing the work of a headline, which is why the section has no headline, and a third stops reading as a statement and starts reading as an essay.",
          ),
        ]),
        group("imprint", "The particulars", [
          longText("statement", "The sentence beside the mark", TOKENS),
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
      ]),  // visual editing not wired yet; route is "/about"

      page("journeyPage", "The Journey page", "journey", [
        seo(),
        longText(
          "pinnedStatement",
          "The held statement",
          "The one place on the site where the page waits for the reader. Keep it short enough to read while it is held.",
        ),
        group("chapterOne", "Chapter 01", [
          text("eyebrow", "Chapter label"),
          text("heading", "Chapter title"),
          paragraphs("paragraphs", "The chapter"),
          text(
            "closingLine",
            "The closing line",
            "Set very large and alone. Mark marks this one 'long pause, stands alone', which is why it is a separate field.",
          ),
          image("image", "Photograph"),
          text("imageAlt", "Photograph description"),
        ]),
        group("chapterFive", "Chapter 05, the photographs", [
          text("eyebrow", "Chapter label"),
          text("heading", "Chapter title"),
          longText("body", "Paragraph"),
          text("video", "Dashcam video name"),
          image("poster", "Still frame"),
          {
            type: "object",
            name: "frames",
            label: "The eleven photographs",
            description:
              "THE ORDER IS THE ORDER OF THE LIGHT: night, before dawn, mist, sunrise, daylight, sun high. That is the only structure eleven windscreen photographs have. Do not reorder them for visual variety.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.time || "Frame" }) },
            fields: [
              image("src", "Photograph"),
              text("alt", "Photograph description"),
              text("time", "What the light is doing", "Not a clock reading. The timestamps on the older files are wrong, and a false time on this page would be the one lie on it."),
              longText("line", "The line beside it"),
            ],
          },
        ]),
        group("contactSheet", "The contact sheet", [
          text("eyebrow", "Small label"),
          longText("statement", "The held sentence"),
          {
            type: "image",
            name: "tiles",
            label: "The photographs that stream past",
            description:
              "Decoration, described once by the sentence held over them, so they carry no individual descriptions on purpose.",
            list: true,
          },
        ]),
        group("chapterSix", "Chapter 06", [
          text("eyebrow", "Chapter label"),
          text("heading", "Chapter title"),
          paragraphs("paragraphs", "The chapter"),
          text("footnote", "The registration line"),
          image("imageWide", "Wide photograph"),
          text("imageWideAlt", "Wide photograph description"),
          image("imageInset", "Inset photograph"),
          text("imageInsetAlt", "Inset photograph description"),
          text("imageInsetCaption", "Caption under the inset"),
        ]),
        group("close", "About the photographs", [
          text("heading", "Section heading"),
          paragraphs(
            "paragraphs",
            "The note",
            "THIS IS THE ONLY THING KEEPING THE CHAPTER COVERS HONEST. Chapters 02, 03 and 04 carry photographs that are not of what they describe, and nothing else on the page says so. If a cover is changed, check this still tells the truth.",
          ),
          links("links", "The two links at the end"),
        ]),
      ]),  // visual editing not wired yet; route is "/journey"

      {
        name: "journeyChapters",
        label: "The Journey, chapters",
        path: "content",
        format: "json",
        match: { include: "journey" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "chapters",
            label: "The six chapters",
            description:
              "These words appear twice: on the sleeve at the top of the Journey page and in the chapter itself further down. Both read from here, so they can never disagree. EVERY LINE IS MARK'S OWN, from the screenplay. Copy is sacred on this project.",
            list: true,
            ui: { itemProps: (item) => ({ label: `${item?.n ?? ""} ${item?.title ?? ""}` }) },
            fields: [
              text("n", "Number", "01 to 06. The sleeve scrolls to the chapter with this number."),
              text("title", "Title"),
              text("blurb", "One line under the title"),
              text("lesson", "The closing line, printed on the back of the sleeve"),
              image("cover", "Cover photograph"),
              text("clip", "Dashcam clip", "Only on the two driving chapters. The road is not a construction site: do not put one on chapter 02 to even the row up. Leave empty for none."),
              {
                type: "string",
                name: "ground",
                label: "Background",
                description: "The chapters walk from dark to light across the six. That progression is the point.",
                options: ["void", "coal", "blueprint", "warm", "paper"],
              },
              paragraphs(
                "lines",
                "The chapter's lines",
                "One entry per line. THE LAST ONE IS THE HELD STATEMENT on chapters 02, 03 and 04: it is printed large and alone under a rule, so it must stay last.",
              ),
            ],
          },
        ],
      },

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
      ]),  // visual editing not wired yet; route is "/road-ahead"

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
      ]),  // visual editing not wired yet; route is "/quote"

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
      ]),  // visual editing not wired yet; route is "/contact"

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
        ui: { allowedActions: { create: false, delete: false } },
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
