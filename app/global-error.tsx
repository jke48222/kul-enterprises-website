"use client";

/**
 * Catastrophic error boundary, the only thing that catches a throw in the
 * ROOT LAYOUT itself (design bible §4.11). It REPLACES `app/layout.tsx`
 * entirely, so it must render its own <html> and <body>, and it gets no
 * chrome, no fonts and no Tailwind guarantee: if the layout died, the
 * className that carries --font-omnibus / --font-mont never reached <html>.
 *
 * Everything is therefore inline-styled against the raw brand hexes
 * (ink #0B0B0B, cream #E3DED0, paper #F7F5F0, gold #B59352) with a system
 * font stack, so this screen renders correctly with zero external CSS. Kept
 * deliberately minimal, because every dependency added here is another thing that
 * can fail at the exact moment nothing else is working.
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
          backgroundColor: "#0B0B0B",
          color: "#F7F5F0",
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
              color: "rgba(247, 245, 240, 0.6)",
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
              color: "#E3DED0",
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
              color: "rgba(247, 245, 240, 0.7)",
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
                backgroundColor: "#B59352",
                color: "#0B0B0B",
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
                border: "1px solid rgba(247, 245, 240, 0.3)",
                color: "#F7F5F0",
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
                color: "rgba(247, 245, 240, 0.4)",
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
