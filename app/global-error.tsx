"use client";

/**
 * Catastrophic error boundary, the only thing that catches a throw in the
 * ROOT LAYOUT itself. It REPLACES `app/layout.tsx` entirely, so it must
 * render its own <html> and <body>, and it gets no chrome, no fonts and no
 * Tailwind guarantee: if the layout died, none of the site's CSS reached
 * this document.
 *
 * Everything is therefore inline-styled against the k system's own raw
 * values (void #000000, on-dark #FCFCFC, on-dark-soft #A8A8A8, gold-lit
 * #D6A145) with a system font stack, so this screen renders correctly with
 * zero external CSS and still looks like the site that broke. Kept
 * deliberately minimal, because every dependency added here is another thing
 * that can fail at the exact moment nothing else is working. The copy is
 * hardcoded for the same reason, as the one sanctioned exception to the
 * everything-in-the-CMS rule: this screen exists for the moment the rest of
 * the machine is not available.
 *
 * In practice this almost never renders; `app/error.tsx` handles page-level
 * failures with the full design system. Note that global-error is production
 * -only in effect: in dev, Next's error overlay takes precedence.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const SANS =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#000000",
          color: "#FCFCFC",
          fontFamily: SANS,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "760px",
            margin: "0 auto",
            padding: "clamp(20px, 5vw, 90px)",
          }}
        >
          {/* Attached hairline plus tracked label, the Eyebrow at rest (§3.4). */}
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              margin: 0,
              fontSize: "12px",
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(252, 252, 252, 0.62)",
            }}
          >
            <span
              aria-hidden
              style={{
                height: "1px",
                width: "64px",
                flexShrink: 0,
                backgroundColor: "currentColor",
              }}
            />
            <span>Off the road</span>
          </p>
          <h1
            style={{
              margin: "24px 0 0",
              fontSize: "clamp(2.5rem, 1.5rem + 5vw, 5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              fontWeight: 700,
              color: "#FCFCFC",
            }}
          >
            The whole rig
            <br />
            went down.
          </h1>
          <p
            style={{
              margin: "24px 0 0",
              maxWidth: "52ch",
              fontSize: "1.0625rem",
              lineHeight: 1.55,
              color: "#A8A8A8",
            }}
          >
            KUL Enterprises hit an unexpected error. Reload the page to get
            moving again.
          </p>
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                display: "inline-flex",
                height: "44px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
                border: "none",
                borderRadius: "9999px",
                backgroundColor: "#D6A145",
                color: "#000000",
                fontFamily: "inherit",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain <a> on purpose: a client-side <Link> would re-render the
                same root layout that just threw and strand the visitor on
                this screen. A full document request refetches fresh server
                HTML, which is the only navigation that can actually recover. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                height: "44px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
                borderRadius: "9999px",
                border: "1px solid rgba(252, 252, 252, 0.3)",
                color: "#FCFCFC",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Back home
            </a>
          </div>
          {error.digest && (
            <p
              style={{
                marginTop: "40px",
                fontSize: "11px",
                lineHeight: 1.4,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8C8C8C",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
