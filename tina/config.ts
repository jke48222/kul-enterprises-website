import { defineConfig } from "tinacms";

/**
 * TinaCMS: the no-code editing layer over content/*.json (04-tech-foundation).
 * Edits made in /admin commit straight to the GitHub repository the client
 * owns, and Vercel redeploys the site from the commit — no database, no
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
          {
            type: "object",
            name: "stories",
            label: "Story sections (About page)",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "Story" }),
            },
            fields: [
              {
                type: "string",
                name: "slug",
                label: "Slug (do not change)",
                required: true,
              },
              { type: "image", name: "image", label: "Photo", required: true },
              {
                type: "string",
                name: "alt",
                label: "Photo description (for screen readers)",
                required: true,
              },
              { type: "string", name: "eyebrow", label: "Small label", required: true },
              { type: "string", name: "title", label: "Headline", required: true },
              {
                type: "string",
                name: "body",
                label: "Paragraph",
                required: true,
                ui: { component: "textarea" },
              },
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
              { type: "string", name: "tagline", label: "Tagline", required: true },
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
              {
                type: "object",
                name: "image",
                label: "Photo",
                fields: [
                  { type: "image", name: "src", label: "Image", required: true },
                  {
                    type: "string",
                    name: "alt",
                    label: "Photo description (for screen readers)",
                    required: true,
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
