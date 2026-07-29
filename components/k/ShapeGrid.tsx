"use client";

import { useEffect, useRef } from "react";

/**
 * THE DRAFTING GRID
 *
 * A field of outlined shapes that drifts slowly behind a section and lights up
 * under the pointer, with a fading trail behind it.
 *
 * It replaces a pair of CSS repeating-gradients that did the same job without
 * moving or responding to anything. The client asked for this shape of thing by
 * name and by API, so the props below are theirs; what is underneath is written
 * here rather than installed, because the whole effect is about sixty lines of
 * canvas and a dependency for that is a dependency to keep updated forever.
 *
 * ============================================================================
 * IT IS ONE CANVAS, NOT A THOUSAND ELEMENTS.
 * ============================================================================
 *
 * At 40px on a 1440 by 700 section this is roughly 630 cells. As DOM nodes that
 * is 630 elements to lay out, hit-test and repaint on every pointer move, on a
 * page that already carries a video, a carousel and a footer that animates. As
 * one canvas it is a single element, one draw call per frame, and the pointer
 * position is arithmetic rather than hit testing.
 *
 * WHAT IT COSTS WHEN NOBODY IS LOOKING: nothing. The loop is started by an
 * IntersectionObserver when the section scrolls into view and stopped when it
 * leaves, and it stops again whenever the tab is hidden. A background canvas
 * that keeps animating off screen is the most common way a page like this ends
 * up draining a battery.
 *
 * ANYONE WHO HAS ASKED FOR REDUCED MOTION gets the grid without the drift. It
 * is drawn once, and it still answers the pointer, because a hover response is
 * a reply to something the reader did rather than motion played at them.
 *
 * ON COLOUR AND CONTRAST. Everything here is drawn UNDER the words and only
 * ever darkens a light ground, so it cannot pull text below its contrast
 * minimum as long as the caller passes a faint enough border. The section that
 * uses it documents the sum. Do not draw filled shapes at high alpha behind
 * body copy.
 */

export type ShapeGridShape = "square" | "circle" | "triangle" | "hexagon";
export type ShapeGridDirection = "up" | "down" | "left" | "right" | "diagonal";

type ShapeGridProps = {
  /** Cells per side, in CSS pixels. */
  squareSize?: number;
  /** Drift, in cells per second. 0 holds it still. */
  speed?: number;
  direction?: ShapeGridDirection;
  /** The outline. Any CSS colour; use an alpha low enough to sit under text. */
  borderColor?: string;
  /** The fill painted into the cell under the pointer. */
  hoverFillColor?: string;
  shape?: ShapeGridShape;
  /** How many previously hovered cells stay lit behind the pointer. 0 for none. */
  hoverTrailAmount?: number;
  className?: string;
};

/** Which way one unit of drift moves the grid, per direction. */
const VECTOR: Record<ShapeGridDirection, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  // Normalised, so a diagonal drift is not 41% faster than a straight one.
  diagonal: [Math.SQRT1_2, Math.SQRT1_2],
};

export default function ShapeGrid({
  squareSize = 40,
  speed = 0.1,
  direction = "diagonal",
  borderColor = "rgba(44,44,44,0.06)",
  hoverFillColor = "rgba(160,92,8,0.05)",
  shape = "square",
  hoverTrailAmount = 0,
  className,
}: ShapeGridProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf: number | null = null;
    let last = 0;
    /** How far the grid has drifted, in CSS pixels, before wrapping. */
    let offset = 0;
    /** The cells under and behind the pointer, newest first. `x,y` keys. */
    let lit: string[] = [];

    /** Draws one cell outline at the given top-left, and fills it if lit. */
    const drawCell = (x: number, y: number, fill: boolean) => {
      const s = squareSize;
      ctx.beginPath();
      if (shape === "circle") {
        ctx.arc(x + s / 2, y + s / 2, s / 2 - 0.5, 0, Math.PI * 2);
      } else if (shape === "triangle") {
        ctx.moveTo(x + s / 2, y + 1);
        ctx.lineTo(x + s - 1, y + s - 1);
        ctx.lineTo(x + 1, y + s - 1);
        ctx.closePath();
      } else if (shape === "hexagon") {
        const r = s / 2 - 0.5;
        for (let i = 0; i < 6; i++) {
          // Flat-top hexagon, so a field of them tiles into a honeycomb rather
          // than a row of loose badges.
          const a = (Math.PI / 3) * i;
          const px = x + s / 2 + r * Math.cos(a);
          const py = y + s / 2 + r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        ctx.rect(x + 0.5, y + 0.5, s - 1, s - 1);
      }
      if (fill) {
        ctx.fillStyle = hoverFillColor;
        ctx.fill();
      }
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      const [dx, dy] = VECTOR[direction];
      // The grid is drawn one cell beyond every edge and shifted by the
      // wrapped offset, so it slides for ever without a seam appearing.
      const shiftX = ((dx * offset) % squareSize) - squareSize;
      const shiftY = ((dy * offset) % squareSize) - squareSize;
      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const key = `${c},${r}`;
          const i = lit.indexOf(key);
          if (i === -1) {
            drawCell(c * squareSize + shiftX, r * squareSize + shiftY, false);
          } else {
            // The trail fades with age, so the newest cell is the brightest.
            ctx.save();
            ctx.globalAlpha = 1 - i / (hoverTrailAmount + 1);
            drawCell(c * squareSize + shiftX, r * squareSize + shiftY, true);
            ctx.restore();
          }
        }
      }
    };

    const frame = (now: number) => {
      // CLAMPED, because `now` jumps by however long the tab was in the
      // background. Unclamped, coming back to the tab after a minute advances
      // the offset by a minute's worth of drift in a single frame and the grid
      // teleports. A twentieth of a second is three frames' worth: enough that
      // a stutter is absorbed, small enough that a resume is invisible.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      offset += dt * speed * squareSize;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf !== null || reduced || speed === 0) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf === null) return;
      cancelAnimationFrame(raf);
      raf = null;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Backing store at device resolution, drawn in CSS pixels, so the
      // hairlines are hairlines on a retina screen rather than 2px smudges.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Only run while it is on screen. See the note at the top of this file.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(host);

    /* ==================================================================
       THERE IS DELIBERATELY NO visibilitychange HANDLER HERE, AND THE ONE
       THAT WAS HERE IS WHY THE GRID SHIPPED FROZEN.
       ==================================================================
       It stopped the loop when the tab went to the background and started it
       again on the way back, which sounds careful and is worse than nothing
       twice over.

       It is unnecessary: requestAnimationFrame already stops being called in a
       background tab. There is no work to save.

       And it is a trap: once `stop()` has run, the only thing that can restart
       the loop is a `visibilitychange` event arriving. Measured here, the grid
       was drawn once and then never moved again, with rAF running at 121fps in
       the same page, because the component mounted in a hidden tab, stopped
       itself, and the visible event that would have revived it never arrived.
       An optimisation whose failure mode is "the feature silently never runs"
       is not worth having for work the browser was not doing anyway.

       The IntersectionObserver below stays, because that one earns its keep:
       rAF does NOT pause for a section scrolled off the screen, and this page
       is long. */

    /**
     * THE POINTER IS WATCHED ON THE WINDOW, NOT ON THIS ELEMENT.
     *
     * This element is `pointer-events: none`, because it is decoration sitting
     * under a headline and a link and it must never take a click meant for
     * either. That also means it can never receive a pointermove of its own,
     * which is the bug this replaced: the handler was attached to a node that
     * by definition never fires one, so the grid never lit up at all.
     *
     * Listening on the window and testing the rectangle gets the behaviour
     * without the cost: the trail follows the pointer across the whole
     * section, including over the words, and nothing anywhere is swallowed.
     */
    const onPointer = (e: PointerEvent) => {
      // A coarse pointer has no hover; a finger "hovering" a decoration would
      // just light cells up as the reader tries to scroll past it.
      if (e.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        if (lit.length) {
          lit = [];
          if (reduced || speed === 0) draw();
        }
        return;
      }
      const [dx, dy] = VECTOR[direction];
      const shiftX = ((dx * offset) % squareSize) - squareSize;
      const shiftY = ((dy * offset) % squareSize) - squareSize;
      const c = Math.floor((e.clientX - rect.left - shiftX) / squareSize);
      const r = Math.floor((e.clientY - rect.top - shiftY) / squareSize);
      const key = `${c},${r}`;
      if (lit[0] === key) return;
      lit = [key, ...lit.filter((k) => k !== key)].slice(0, hoverTrailAmount + 1);
      // ALWAYS REPAINT HERE. IT MUST NOT DEPEND ON THE DRIFT LOOP.
      // This used to redraw only when the drift was switched off, on the
      // reasoning that a running loop would repaint on the next frame anyway.
      // True, and it makes the hover response conditional on a second thing
      // being alive: with the loop paused for any reason at all, and it is
      // paused whenever the section is scrolled away or the tab is in the
      // background, the pointer did nothing and there was no way to tell that
      // apart from the feature being broken. One extra canvas pass on a
      // pointer move is not worth that coupling.
      draw();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [
    squareSize,
    speed,
    direction,
    borderColor,
    hoverFillColor,
    shape,
    hoverTrailAmount,
  ]);

  return (
    <div
      ref={hostRef}
      // Decoration. It carries no information and answering the pointer is the
      // whole of its behaviour, so it is hidden from assistive technology and
      // never takes a click meant for what is on top of it.
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
