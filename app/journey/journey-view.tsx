"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTina, tinaField } from "tinacms/dist/react";
import { useReducedMotionLive } from "@/components/k/useReducedMotionLive";
import { fill } from "@/lib/content";
import type { TinaPage } from "@/lib/tina";

/**
 * THE JOURNEY, STARTED FRESH AS A FILM.
 *
 * The seventeen-scene scroll build that lived here, and every line of its
 * screenplay, was removed at the first walkthrough (project-docs/32). Mark's
 * direction: clicking the journey icon turns the screen into a documentary
 * film, his stepmother is producing the actual video, and until it arrives a
 * dashcam clip stands in. So this page is deliberately nothing but the
 * machine the real film will drop into:
 *
 *   - the film, full screen, over everything including the nav
 *   - Esc or space leaves (his spec, word for word)
 *   - a clickable index that jumps the playhead to a section
 *
 * When the real film lands: swap the file in the CMS, write the real
 * sections into the index, and revisit sound (the placeholder is muted
 * because a clip that autoplays with audio is not legal in any browser; the
 * real film will need a deliberate play-with-sound moment instead).
 *
 * WHY IT IS position: fixed OVER THE CHROME. "The screen turns into a
 * documentary movie" is the brief; a film sitting between the nav and the
 * footer is a page with a video on it, which is exactly what this replaced.
 * Body scroll is locked while it is mounted so the page behind it cannot
 * wander.
 *
 * SPACE IS AN EXIT EVERYWHERE EXCEPT ON A CONTROL. For a keyboard reader
 * whose focus is on a chapter button, space is the activation key, and
 * stealing it would make the index unusable by keyboard. Esc always leaves.
 *
 * THE PAUSE CONTROL IS A REQUIREMENT, NOT A FLOURISH: WCAG 2.2.2, the same
 * rule HeroVideo documents. Reduced-motion readers get the poster and the
 * film only plays if they start it themselves.
 */

/** The shape of the content, taken from the file itself. See quote-view.tsx. */
type Content = typeof import("@/content/pages/journey.json");

export default function JourneyView(props: TinaPage<{ journeyPage: unknown }>) {
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.journeyPage as unknown as Content;
  const router = useRouter();
  const reducedMotion = useReducedMotionLive();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const chapters = page.chapters ?? [];

  /**
   * Where "leave" goes. Back if there is a back, home otherwise, so the film
   * behaves like something laid over the site rather than a place you get
   * stranded in when it was opened from a shared link.
   */
  const leave = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        leave();
        return;
      }
      if (
        e.key === " " &&
        !(e.target instanceof HTMLButtonElement) &&
        !(e.target instanceof HTMLAnchorElement)
      ) {
        e.preventDefault();
        leave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leave]);

  /** The page behind the film must not scroll while the film is up. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /**
   * The file is chosen on the client so phones get the -720 cut, the same
   * bargain HeroVideo strikes. Until the effect runs the poster holds the
   * frame, which is also the whole story for reduced-motion readers unless
   * they press play themselves.
   */
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const name = page.film.video || "dash-night";
    const small = window.matchMedia("(max-width: 767px)").matches;
    setSrc(`/videos/${name}${small ? "-720" : ""}.mp4`);
  }, [page.film.video]);

  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let current = 0;
    chapters.forEach((chapter, i) => {
      if (t >= (chapter.time ?? 0)) current = i;
    });
    setActive(current);
  };

  const seek = (time: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = time;
    void v.play().catch(() => undefined);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  };

  return (
    <main className="fixed inset-0 z-[80] bg-k-void">
      <h1 className="sr-only">The Journey</h1>

      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={page.film.poster}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* One frame of poster while the effect picks the file. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.film.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* The chrome bands. Dark where the controls sit, clear in the middle
          so the film is the page. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0)_100%)]"
      />

      {/* Leave, top right, with the keys beside it. */}
      <div className="absolute right-6 top-6 flex items-center gap-4 md:right-10 md:top-8">
        <span
          data-tina-field={tinaField(page, "exitHint")}
          className="font-text text-k-micro uppercase text-k-on-dark-soft"
        >
          {fill(page.exitHint)}
        </span>
        <button
          type="button"
          onClick={leave}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-k-on-dark-faint text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
        >
          <span aria-hidden="true" className="text-[18px] leading-none">
            &#215;
          </span>
          <span className="sr-only">{fill(page.exitLabel)}</span>
        </button>
      </div>

      {/* The index, bottom left. Each entry drops the playhead on a section. */}
      <nav
        aria-label={fill(page.indexLabel)}
        className="absolute bottom-8 left-6 md:bottom-10 md:left-10"
      >
        <p
          data-tina-field={tinaField(page, "indexLabel")}
          className="pb-4 font-text text-k-micro uppercase text-k-on-dark-soft"
        >
          {fill(page.indexLabel)}
        </p>
        <ol className="flex flex-col gap-2.5">
          {chapters.map((chapter, i) => (
            <li key={chapter.label}>
              <button
                type="button"
                onClick={() => seek(chapter.time ?? 0)}
                aria-current={active === i ? "true" : undefined}
                className={`group flex items-baseline gap-3 font-text transition-colors duration-200 ${
                  active === i ? "text-k-gold-lit" : "text-k-on-dark-soft hover:text-k-on-dark"
                }`}
              >
                <span className="font-text text-k-micro uppercase tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-k-small uppercase tracking-[0.08em]">
                  {fill(chapter.label)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Pause, bottom right. WCAG 2.2.2; see the header note. */}
      <button
        type="button"
        onClick={togglePlay}
        className="absolute bottom-8 right-6 font-text text-k-micro uppercase text-k-on-dark-soft transition-colors duration-200 hover:text-k-on-dark md:bottom-10 md:right-10"
      >
        {paused ? fill(page.playLabel) : fill(page.pauseLabel)}
      </button>
    </main>
  );
}
