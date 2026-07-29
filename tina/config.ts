import { defineConfig } from "tinacms";

/**
 * TinaCMS: the no-code editing layer over content/*.json (04-tech-foundation).
 * Edits made in /admin commit straight to the GitHub repository the client
 * owns, and Vercel redeploys the site from the commit. No database, no
 * separate content copy, nothing to keep in sync.
 *
 * Local editing:  npm run dev:cms  → http://localhost:3000/admin/index.html
 * Production editing requires a (free) Tina Cloud project connected to the
 * repo; set NEXT_PUBLIC_TINA_CLIENT_ID + TINA_TOKEN in the hosting env and
 * switch the build script to build:cms. Until then the site simply reads
 * the JSON files directly, so nothing depends on Tina at runtime.
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
      {
        name: "site",
        label: "Business Facts & Story",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "name", label: "Company name", required: true },
          { type: "string", name: "legalName", label: "Legal name", required: true },
          {
            type: "string",
            name: "tagline",
            label: "Tagline (one line)",
            required: true,
          },
          {
            type: "string",
            name: "taglineLines",
            label: "Tagline lines (as stacked in the intro)",
            list: true,
          },
          { type: "string", name: "usdot", label: "USDOT number", required: true },
          { type: "string", name: "mc", label: "MC number", required: true },
          {
            type: "string",
            name: "email",
            label: "Dispatch email",
            description: "Form submissions and mailto links use this address.",
            required: true,
          },
          {
            type: "string",
            name: "phone",
            label: "Phone",
            description: "Digits and dashes, e.g. 678-972-1148. Click-to-call links derive from it.",
            required: true,
          },
          { type: "string", name: "city", label: "City", required: true },
          { type: "string", name: "state", label: "State", required: true },
          {
            type: "string",
            name: "serviceArea",
            label: "Service area line",
            required: true,
          },
          {
            type: "string",
            name: "url",
            label: "Website URL",
            description: "Leave as-is unless the domain changes.",
            required: true,
          },
          {
            type: "object",
            name: "geo",
            label: "Map coordinates",
            fields: [
              { type: "number", name: "latitude", label: "Latitude" },
              { type: "number", name: "longitude", label: "Longitude" },
            ],
          },
        ],
      },
      {
        name: "services",
        label: "Services",
        path: "content",
        format: "json",
        match: { include: "services" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "services",
            label: "Services",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name || "Service" }),
            },
            fields: [
              {
                type: "string",
                name: "slug",
                label: "URL slug (do not change)",
                required: true,
              },
              { type: "string", name: "name", label: "Name", required: true },
              {
                type: "string",
                name: "short",
                label: "One-line summary",
                required: true,
                ui: { component: "textarea" },
              },
              // NO PER-SERVICE TAGLINE FIELD. There used to be one, required,
              // and all seven values were invented slogans ("Cold chain,
              // unbroken", "When it cannot wait") of exactly the kind the
              // client banned. Nothing ever rendered them, so they sat in the
              // CMS waiting to be wired to a component. Do not add it back.
              {
                type: "string",
                name: "description",
                label: "Description",
                required: true,
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "bestFor",
                label: "Best for (bullets)",
                list: true,
              },
              {
                type: "string",
                name: "commitments",
                label: "Our commitments (bullets)",
                list: true,
              },

              /* ==============================================================
                 EVERYTHING BELOW WAS IN THE CONTENT AND NOT IN THE CMS.
                 ==============================================================
                 content/services.json carries sixteen fields per service and
                 this collection exposed six of them, so ten things that are
                 visibly on a service page could only be changed by editing JSON
                 in the repository. That included both photographs, every figure
                 in the specification table, and the short lines used on the
                 services index.

                 It matters most for the dimensions. Those are nominal 53 foot
                 values that nobody has measured against the real trailer, and
                 correcting them is on the client's own list. He could not do it
                 from the CMS he is paying for.

                 The two lines that are still not here are `slug`, which is
                 above and marked do not change because URLs depend on it, and
                 nothing else. Sixteen of sixteen are now reachable. */

              {
                type: "string",
                name: "blurb",
                label: "Card blurb (services index)",
                description:
                  "One short line under the service name on the services page.",
              },
              {
                type: "string",
                name: "bestForShort",
                label: "Best for, in three or four words",
                description: "Used in the comparison list, so keep it short.",
              },
              {
                type: "image",
                name: "card",
                label: "Card photograph",
                description: "Portrait crop, shown on the services index.",
              },
              {
                type: "image",
                name: "wide",
                label: "Wide photograph",
                description: "Landscape crop, shown at the top of this service.",
              },
              {
                type: "string",
                name: "equipment",
                label: "Equipment",
                description: "For example: Tractor only, or 53 ft dry van.",
              },
              {
                type: "string",
                name: "equipmentNote",
                label: "Equipment note",
                description: "The small grey line under Equipment.",
              },
              {
                type: "string",
                name: "lane",
                label: "Lane",
                description: "For example: Regional, or Over the road.",
              },
              {
                type: "string",
                name: "laneNote",
                label: "Lane note",
                description: "The small grey line under Lane.",
              },
              {
                type: "string",
                name: "leadTime",
                label: "Lead time",
                description: "For example: 24 to 48 hrs.",
              },
              {
                type: "object",
                name: "dimensions",
                label: "Trailer dimensions",
                description:
                  "The measurements drawn on the blueprint. Check these against the real trailer before trusting them.",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label
                      ? `${item.label}: ${item.value ?? ""}`
                      : "Dimension",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "ref",
                    label: "Drawing reference",
                    description: "The letter used on the drawing, A, B, C and so on.",
                  },
                  { type: "string", name: "label", label: "What is measured" },
                  {
                    type: "string",
                    name: "value",
                    label: "Measurement",
                    description: "As it should read, for example 13 ft 6 in.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content",
        format: "json",
        match: { include: "faq" },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Questions",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.q || "Question" }),
            },
            fields: [
              { type: "string", name: "q", label: "Question", required: true },
              {
                type: "string",
                name: "a",
                label: "Answer",
                description:
                  "Heads up: the licensed-and-insured answer spells out the USDOT and MC numbers. If those ever change in Business Facts, update them here too.",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },
});
