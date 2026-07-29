import Image from "next/image";
import Reveal from "@/components/k/Reveal";

/**
 * ONE FRAME OF THE ROAD
 *
 * A single photograph filling the screen, with a time of day in small capitals
 * and one line of text sitting at the bottom. Chapter five is made of eleven of
 * these and nothing else.
 *
 * THE ORDER IS THE LIGHT. The photographs run from violet pre-dawn through
 * night, mist, sunrise and full daylight to sun high, because that is the order
 * Mark saw them in over eleven years and the order the curation put them in.
 * Reordering them for visual variety would throw away the only structure the
 * chapter has.
 *
 * THE TEXT ALTERNATES SIDES down the sequence, which is the whole of the
 * variation. Eleven frames with the words in the same corner reads as a
 * slideshow; eleven frames with a different treatment each reads as a scrapbook.
 * Alternating is enough.
 *
 * The scrim is a hand-written gradient rather than a colour with a transparency
 * added to it, because the transparency shortcuts do not work on this project's
 * colours and fail by rendering nothing at all, which on a scrim means unreadable
 * white text on a bright photograph.
 *
 * ITS NUMBERS WERE MEASURED, NOT GUESSED. Every one of the eleven photographs
 * was sampled pixel by pixel in the band where the words sit, the scrim
 * composited over it, and the contrast computed against the exact text colours
 * below. A gentler first attempt failed on two frames at 4.13:1 and 4.14:1.
 * These stops put the brightest pixel behind the headline at 9.33:1 on the
 * worst frame, and behind the small time of day at 8.05:1. Both worst cases are
 * s17-road-to-horizon, which is the last frame and the brightest sky in the
 * set. If a photograph is ever swapped, measure again rather than assuming: the
 * frames that failed the first attempt were not the ones that looked brightest.
 *
 * THE TIME OF DAY IS FULL WHITE FOR THE SAME REASON. It was a soft grey, which
 * measured 3.47:1 on the worst frame and failed on five of the eleven. It is
 * small uppercase type under a headline four times its size, so it still reads
 * as subordinate without being dimmed.
 */
export default function JourneyFrame({
  src,
  alt,
  time,
  line,
  align = "left",
  index = 0,
  priority = false,
}: {
  src: string;
  alt: string;
  /** Time of day or light condition, printed small above the line. */
  time: string;
  line: string;
  align?: "left" | "right";
  index?: number;
  /** Only the first frame should load eagerly. */
  priority?: boolean;
}) {
  return (
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-k-void">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.6)_62%,rgba(0,0,0,0.95)_100%)]"
      />
      <div className="relative mx-auto w-full max-w-[1248px] px-6 pb-20 md:px-12 lg:px-24">
        <Reveal
          variant="settle"
          index={index}
          className={align === "right" ? "flex flex-col items-end" : "flex flex-col"}
        >
          <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark">
            {time}
          </span>
          <p
            className={`max-w-[640px] pt-4 font-display text-k-d3 font-black text-k-on-dark ${
              align === "right" ? "text-right" : ""
            }`}
          >
            {line}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
