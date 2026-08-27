# KUL Enterprises website

The public website for a small Georgia freight trucking company. It tells shippers what the
company hauls and where it runs, gives drivers a way to apply, and lets the owner rewrite every
word on it himself without calling a developer.

**Live at [kulenterprises.com](https://kulenterprises.com)** (USDOT 7638788, MC 66389691,
Loganville, GA).

## What problem this solves

A freight broker deciding whether to hand a load to an unfamiliar carrier spends about a minute
looking them up. They want the DOT and MC numbers, proof of insurance, a real address, and a
phone number that a human answers. A carrier who cannot produce that in a minute does not get the
load.

KUL Enterprises is one truck growing toward fifty. It competes for that minute against carriers
with a hundred trucks and a marketing department. The usual answer, a template site with stock
photography and invented testimonials, fails the exact test it is trying to pass: a broker who
has read a hundred carrier sites recognises the template. So the site is built the opposite way.
Every number on it is checkable against a public federal record, the photographs are the owner's
own, and there are no testimonials, client logos, or fleet counts, because there are none to
report yet. Honesty is the strategy, not a constraint on it.

The second problem is maintenance. A one-truck carrier cannot pay a developer to change a phone
number. So the site's entire text lives in editable content files with an editor bolted on, and
the site keeps working whether or not that editor is running.

## How it works

Twenty-two public pages, every one of them generated at build time as a static HTML file. There
is no server rendering per request anywhere in the app: no page opts into dynamic rendering and
nothing revalidates on a timer.

```
content/*.json   ──►  lib/content.ts  ──►  app/**/page.tsx  ──►  22 static pages
      ▲                                          │
      │                                          ├──►  lib/search-data.ts ──► lib/search.ts
   TinaCMS at /admin                             │       (in-browser site search)
   (19 collections)                              │
                                                 └──►  app/api/{contact,driver,packet,quote}
                                                          ──► rate limit ──► Resend ──► inbox
```

### Content, and why the editor cannot take the site down

All copy lives as JSON under `content/`. TinaCMS, a content editor that commits its changes back
to the repository as ordinary files, provides the editing screens at `/admin`. There are
**19 collections**: business facts, services, FAQ, twelve individual page collections built by a
shared `page()` factory in [`tina/config.ts`](tina/config.ts), navigation, search copy, form copy,
and legal documents. The same nineteen are enumerated independently in
[`tina/tina-lock.json`](tina/tina-lock.json).

The pages never call Tina at runtime. They import the JSON directly, so a build with no CMS
credentials is a complete working website that simply has no `/admin` on it.
[`scripts/build.mjs`](scripts/build.mjs) enforces that: it compiles the editor first when the two
Tina Cloud values are present, and if that step fails it prints the reason loudly and builds the
site anyway. This exists because the first deployment with real credentials was answered by Tina
Cloud with a 403 and took the whole site down with it. A mistyped CMS token is not a reason for a
trucking company to have no website.

### Site search, with no search library

[`lib/search.ts`](lib/search.ts) is 482 lines and there is no search dependency in
`package.json`. The whole site is a few hundred paragraphs of JSON, so the file reads every word
once, holds them in memory, and scores them directly. On content this size that beats an index,
and there is nothing to install or pay for.

The scoring ladder runs from strongest to weakest: the whole word, the start of a word (so
results appear while a word is still being typed), one edit off the spelling (a transposition or
an extra letter should not turn a real page into "no results"), inside a word, and two words run
together, so typing `dryvan` finds the page that says "dry van". Words next to each other on the
page in the order they were typed score extra. Singulars and plurals are the same word. In a long
query, one word the site never uses is forgiven instead of zeroing out everything the other words
found.

The part that matters commercially is the synonym sheet: **36 entries** mapping the freight
industry's vocabulary onto the site's own words, at a slight discount so a literal match always
wins. A shipper types `refrigerated`, the site says Reefer. A driver types `hiring`, the site says
Drivers. A broker types `coi`, the site says insurance certificate. Someone types `rates`, the
site says quote.

### Four forms, one shared spine

`app/api/contact`, `driver`, `packet`, and `quote` are structurally identical. Each calls
`rateLimit()` from [`lib/ratelimit.ts`](lib/ratelimit.ts) (a sliding window held in memory, five
per key per ten minutes, which throttles bursts rather than guaranteeing a global cap), then
`readForm()` and `sendViaResend()` from [`lib/email.ts`](lib/email.ts). Each form renders a
`Honeypot` component: a hidden text input named `botcheck` that a person never sees and a bot
fills in. `readForm()` checks it at [`lib/email.ts:151`](lib/email.ts), logs a bounded slice of
the payload, and returns success so the bot learns nothing.

Every submission is also written to the server log as one structured JSON line, and mirrored to
`LEAD_WEBHOOK_URL` if that is set, so an email outage does not lose a lead.

### The coverage map is projected, not drawn

[`lib/map-states.ts`](lib/map-states.ts) holds the lower 48 as SVG paths generated from the
PublicaMundi public-domain US states GeoJSON, projected with Albers Equal Area Conic at the
standard US parallels (29.5N and 45.5N, origin 37.5N 96W). That is the projection printed US maps
use, and it is why the country reads as the shape people know rather than the stretched one a raw
latitude/longitude plot gives. Points closer together than half a pixel at the rendered size are
dropped, which keeps the whole country under 30 KB of path data with every border where it
actually is. Loganville is projected with the same transform, so the home pin lands on the town.

Georgia and the five states it borders are marked as the home region. Nothing else is, because the
operating authority is nationwide but the same-day coverage is not.

### Scroll reveals that cannot hide the page

[`components/k/Reveal.tsx`](components/k/Reveal.tsx) is a 334 line client component driving 94
call sites across the site. It is not pure CSS: there is no `animation-timeline` or `view()`
anywhere in the stylesheet. One shared IntersectionObserver (the browser API that reports when an
element scrolls into view) watches every waiting element, with a requestAnimationFrame and timer
sweep behind it as a backstop.

It was rebuilt on 29 Jul 2026 because the previous version could hide the page. That version used
framer-motion's `whileInView` with an invisible start state, which means the animation was the
only thing making the content visible. It was caught on the About page: measured at 928 px wide,
fifteen elements were invisible at once and the h1 was frozen part way through its wipe reading
"Ele / car / ow". Scrolling them back into view recovered none of them. That failure mode was
reachable from 105 call sites.

Three things now prevent it, and the current system keeps all three. The visible state is the CSS
default, so `.kul-rv` alone is an ordinary visible element and the hiding rule is scoped to
`html[data-reveal]`, an attribute set by an inline pre-paint script in
[`app/layout.tsx:223`](app/layout.tsx). The entrance is a CSS keyframe animation, which runs to
completion in a background tab and pins its final state, rather than a JavaScript animation that
can stall. And the shared sweep shows anything on screen that is still unplayed, whether or not
the observer ever fired.

That same inline script is where reduced motion is handled. It sets the attribute only when
scripting is on, IntersectionObserver exists, and the visitor has not asked for less motion, so a
reader with `prefers-reduced-motion` set never has anything hidden in the first place. The
stylesheet switches the animations off as well, and there are nine `prefers-reduced-motion`
references across the codebase.

## Design decisions

### The contrast work, including two figures it caught being wrong

[`app/globals.css`](app/globals.css) carries 88 unique custom properties, each with its measured
contrast ratio in a comment beside it. Text ink is `#2c2c2c` at 12.25:1 on the paper ground. The
gold is split into two values, `#a05c08` at 4.57:1 on light and `#d6a145` at 7.70:1 on dark,
because one gold cannot clear AA on both.

The reason this section exists is that the file also records catching two of its own published
figures being wrong, and re-deriving them:

| Token | Published as | Measured against | Actually | Replaced with |
| --- | --- | --- | --- | --- |
| `--color-ink-faint` | `#767676`, 4.60:1 | pure white | 3.99:1 on paper, 4.03:1 on warm | `#6a6a6a`, 4.75:1 on paper |
| `--color-on-dark-faint` | `#7c7c7c`, 4.50:1 | pure black | 4.08:1 on charcoal, 3.72:1 on blueprint | `#8c8c8c`, 4.62:1 on blueprint |

Both original figures were correct arithmetic against grounds the site does not use. The site has
no pure white and almost no pure black. Under the real grounds, every 11 px label wearing the
first colour and all the footer small print, legal links, and DOT numbers wearing the second were
below the readable minimum on every page. The replacements are the lightest steps that clear
4.5:1 against the hardest ground in each family, and the comments now name that ground so a future
replacement is measured against the right thing.

The same discipline shows in the warm panel. It was `#f8f0e8` until the client rejected it: with
sixteen points between its red and its blue it read as peach next to a black and gold brand. It is
now `#f2efe9`, the same tone with the pink removed. Every colour that sits on it was re-measured,
because lightening a ground moves all of them at once, and the note records that gold clears by
0.04 and that darkening this ground by more than about two points breaks it.

If you count 83 rather than 88, that is the count with five component-scoped `--k-sc-*`
scroll-carousel variables excluded.

### The opening film was two attempts, not one pipeline

The homepage opens once per tab session with a short film: a gold star grows into the Jamaican
Doctor Bird flying at the lens, it taps the screen, and the tap ignites a molten whiteout out of
which the KUL lockup materialises. It is the owner's twenty-panel storyboard.

**The shipped film is Higgsfield only.** Per
[`components/brand/LoadingOverlay.tsx:108-110`](components/brand/LoadingOverlay.tsx), it was
produced in Higgsfield Cinema Studio 3.5 and cut in Final Cut Pro, and per
[`project-docs/33-higgsfield-intro-plan.md`](project-docs/33-higgsfield-intro-plan.md) the clips
were generated and the film cut by Jalen. Two cuts ship: a 1080p landscape master at 15.93 s
(9.3 MB) and a 720x1280 portrait cut at 15.79 s (3.2 MB), both silent, each with its own tagline
composited in at encode time because neither Final Cut master carries one.

An earlier five-second Blender film was built first and then superseded. It is documented in
[`project-docs/22-blender-intro-sequence.md`](project-docs/22-blender-intro-sequence.md) as a
300 frame render at 60fps, and its cost still shows in the overlay's own history: the ceremony cap
was 2500 ms when the film ended on the bare lion, 5000 ms for the Blender film, and is 15950 ms
for the Higgsfield one.

Six things protect a visitor from the film: reduced motion gets a still frame instead, it renders
nothing on the server so search engines never see it, it plays once per tab session on the
homepage only, a skip control is always present, a 4 second play deadline abandons it if the video
has not started, and an 18500 ms ceiling removes it no matter what happens. The 4 second deadline
was 1500 ms until a phone-only bug: iOS does not honour `preload="auto"` on cellular, so the fetch
does not begin until `play()` is called and nobody arriving on mobile data ever saw the opening.

## Results

Everything below is a count or a measurement traceable to a file in this repository. Nothing here
is a benchmark, because none was run.

| Measured | Value | Where |
| --- | --- | --- |
| Public pages, all statically generated | 22 (15 hand-kept routes plus 7 service slugs) | [`app/sitemap.ts`](app/sitemap.ts), [`content/services.json`](content/services.json) |
| Pages opting into dynamic rendering | 0 | no `force-dynamic` or `revalidate` in the repo |
| CMS collections | 19 | [`tina/config.ts`](tina/config.ts), [`tina/tina-lock.json`](tina/tina-lock.json) |
| Design tokens | 88 unique custom properties | [`app/globals.css`](app/globals.css) |
| Search engine | 482 lines, 0 dependencies | [`lib/search.ts`](lib/search.ts), `package.json` |
| Freight synonym entries | 36 | [`lib/search.ts`](lib/search.ts) |
| Reveal call sites | 94 | grep for `<Reveal` across `app/` and `components/` |
| Reduced-motion references | 9 | across `.ts`, `.tsx`, `.css` |
| Application source | 17,054 lines across 84 TypeScript files | `app/`, `components/`, `lib/`, `tina/` |
| Static assets | 44 MB in `public/` | `du -sh public/` |
| Design exploration | 20 built variants from 12 style directions | [`briefs/README.md`](briefs/README.md) |

On that last row: styles 01 to 08 were each built twice from the same brief by two different
builders who did not see each other's work, and styles 09 to 12 were recreations of four confirmed
reference sites reskinned to the brand. Eight doubled plus four is twenty. See Status for what
happened to them.

**Not measured, and therefore not claimed:** Lighthouse scores, Core Web Vitals, bundle sizes, and
frame rates. No audit artifact, profiler output, or performance budget is committed here.

**Not tested:** this repository has no test suite. No Jest, Vitest, or Playwright configuration and
no test files. Cross-browser behavior was handled by hand, including the iOS cellular preload bug
above.

## Running it

Requires Node 20.9 or newer, which is what Next 16 declares in its own `engines` field. This
repository sets no `engines` field of its own.

```bash
npm install
npm run dev              # http://localhost:3000
npm run dev:cms          # the same site, with the TinaCMS editor at /admin
```

`npm run dev` gives a fully working site. `npm run dev:cms` additionally compiles and serves the
editor, and needs no cloud credentials for local editing.

```bash
npm run build            # compiles the editor if credentials exist, then the site
npm run build:site-only  # skips the editor entirely
npm run lint             # eslint
```

A successful `npm run build` prints Next's route table with 22 static entries and the four API
routes. If the Tina step fails it says so loudly and the site build continues.

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. Nothing is required for local development:
with no `RESEND_API_KEY` the form endpoints stub the send and log it, so the forms stay testable.

**In production, `RESEND_FROM` is required and its absence is silent.** Resend is the
transactional email service the forms deliver through, and its shared `onboarding@resend.dev`
sender can only deliver to the address that owns the Resend account. It cannot deliver to
`dispatch@kulenterprises.com`. So with `RESEND_API_KEY` set and `RESEND_FROM` unset, every form on
the site returns success to the visitor, Resend rejects the message, and the lead is never seen.
[`lib/email.ts`](lib/email.ts) logs a warning on every such send for exactly this reason, but a
warning in a hosting log is not something anyone reads.

The fix is once only: verify `kulenterprises.com` as a domain in Resend, then set
`RESEND_FROM="KUL Enterprises <dispatch@kulenterprises.com>"` alongside `RESEND_API_KEY`. This
repository cannot tell you whether that has been done, because the answer lives in the hosting
environment. Check it before trusting the contact forms.

| Variable | When | What happens without it |
| --- | --- | --- |
| `RESEND_API_KEY` | production | Forms fail visibly with a 502 and tell the visitor to call. Deliberate. |
| `RESEND_FROM` | production | Forms appear to work and every lead is silently dropped. See above. |
| `LEAD_WEBHOOK_URL` | optional | No spreadsheet mirror. Leads still reach the server log. |
| `NEXT_PUBLIC_GA_ID` | at launch | No analytics. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | at launch | No Search Console verification tag. |
| `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` | production editing | No `/admin` on the deployed site. Site is unaffected. |

## Project layout

```
app/
├── page.tsx + 14 route folders   The 15 hand-kept pages, each a thin page.tsx
│                                 over a *-view.tsx that holds the markup
├── services/[slug]/              The 7 service pages, prerendered via
│                                 generateStaticParams from services.json
├── api/                          contact, driver, packet, quote
├── globals.css                   The design system: 88 tokens with their
│                                 measured contrast ratios, plus the reveal
│                                 keyframes
├── layout.tsx                    Fonts, JSON-LD, the pre-paint reveal script,
│                                 and the film's pre-paint cover
└── sitemap.ts robots.ts          Deliberately hand-kept route list, see its header

components/
├── k/                            The site's own component set: Nav, Footer,
│                                 Search, Reveal, ServiceMap, ServiceCarousel
├── forms/                        The four forms and their shared shell,
│                                 including the Honeypot
├── brand/LoadingOverlay.tsx      The opening film and its six escape hatches
└── motion/                       Lenis smooth-scroll provider

lib/
├── search.ts search-data.ts      The search engine and the flattener that
│                                 feeds it every word on the site
├── email.ts ratelimit.ts         Delivery, honeypot, lead log, throttling
├── map-states.ts                 The lower 48, Albers projected. Generated.
├── content.ts site.ts            Placeholder filling and business facts
└── tina.ts                       Folds Tina Cloud asset URLs back to repo paths

content/                          Every word on the site, as JSON. What the
                                  client edits at /admin.
tina/                             The 19 collection schemas
briefs/                           Surviving design briefs and the Journey screenplay
project-docs/                     The engagement record: 33 numbered documents from
                                  the first reply through scope, agreement, design
                                  research, build plans, both film pipelines, and
                                  the launch meeting outcomes
public/                           Brand marks, journey photography, service imagery,
                                  and the films (44 MB)
scripts/build.mjs                 The build that will not let a broken editor take
                                  the site down
```

## Status

Shipped and live, returning HTTP 200 at kulenterprises.com. 161 commits between 2 Jul 2026 and
19 Aug 2026. Next.js 16 (`^16.3.1`), React 19, Tailwind CSS 4, TinaCMS 3.

Known gaps and open items, in the order I would address them:

- **`RESEND_FROM` must be verified in the hosting environment.** Until it is, every lead is
  silently dropped. This is the single highest-consequence unknown in the project and the repository
  cannot answer it. See Environment variables above.
- **The 20 design variants are documented but not recoverable from this repository.** Their code
  was removed when the winning direction was promoted to the root.
  [`briefs/README.md`](briefs/README.md) names commit `f9395be` as the recovery point and that
  commit does not exist in this history. Three style briefs survive under `briefs/`; the built
  variants do not.
- **No tests.** The highest-value first test would assert that every route in
  [`app/sitemap.ts`](app/sitemap.ts) resolves to a page that builds, since that list is hand-kept
  on purpose and a renamed folder would silently unpublish a page from search.
- **No Content-Security-Policy on the document.** Deliberately deferred rather than guessed: the
  page renders inline JSON-LD and an inline pre-paint script, so an enforcing policy needs
  per-request nonces threaded through the layout, and a guessed policy fails silently in
  production. [`next.config.mjs`](next.config.mjs) documents the intent to roll one out in
  Report-Only first. The other baseline headers (HSTS, nosniff, Referrer-Policy,
  Permissions-Policy, and a `frame-ancestors` allow list) are in place.
- **Rate limiting is per serverless instance.** [`lib/ratelimit.ts`](lib/ratelimit.ts) holds its
  window in memory, so it throttles bursts rather than enforcing a global cap. Correct for a
  marketing site with no external dependencies, and the file names Upstash as the swap if abuse
  appears.
- **`briefs/README.md` documents a three-way filename rotation** in the source journey photos,
  verified pixel by pixel, where three of five filenames do not describe their subjects. Alt text
  and photo choices were made from the pixels. Anyone adding photography should read that table
  before trusting a filename.

---

Built for KUL Enterprises LLC by Jalen Edusei,
[jalenedusei.com](https://www.jalenedusei.com).
