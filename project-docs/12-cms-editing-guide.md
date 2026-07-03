# Editing Your Website Without Code — TinaCMS Guide

*Written for Mark. This is the working reference for the 60-minute training
session and for everyday edits afterward.*

## What you can edit

Everything a visitor reads that is likely to change lives in three places,
all reachable from the **/admin** editing screen:

| Section in /admin | What it controls |
|---|---|
| **Business Facts & Story** | Phone, dispatch email, USDOT/MC, tagline, city/state, service-area line, and the five story photo sections on the About page |
| **Services** | All seven freight services: names, taglines, descriptions, "best for" and "our commitments" bullets, and each service's photo |
| **FAQ** | Every question and answer in the FAQ band at the bottom of the pages |

Change the phone number once in Business Facts and it updates everywhere at
the same time — the nav, the footer, the quote page, click-to-call links,
and the search-engine markup.

## How it works (30 seconds of background)

There is no separate content database. Your edits are saved as changes to
files inside the website's own GitHub repository — the one you own. Each
save becomes a commit, Vercel rebuilds the site from it automatically, and
the change is live in about a minute. Because content is in the repository,
every edit is versioned: nothing you change can ever be lost, and any edit
can be rolled back.

## Editing, step by step

1. Go to `www.kulenterprises.com/admin` and log in.
2. Pick the section (Business Facts & Story, Services, or FAQ).
3. Click into a field and type. Photos have an upload button; uploaded
   images land in the site's image library.
4. Press **Save**. The site rebuilds and your change is live in ~1 minute.

Two fields are marked **"do not change"** (the URL slugs). They are part of
the page addresses; changing them would break links. Everything else is
yours.

## One-time production setup (developer task, at launch)

1. Create a free project at **app.tina.io**, connect it to the
   `kul-enterprises-website` GitHub repository.
2. Copy the Client ID and a read/write token into the Vercel environment:
   `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`.
3. Change the Vercel build command to `npm run build:cms` (it compiles the
   /admin screen and then builds the site).
4. Invite Mark's email as an editor in the Tina Cloud project.

Until that setup is done, the site works exactly the same — it reads the
same content files directly — there is just no /admin screen on the live
domain. Local preview editing is always available with `npm run dev:cms`.
