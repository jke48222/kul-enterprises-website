import Image from "next/image";
import { stories } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The five story sections. Mark's own photographs from the road, mapped to
 * the brand's themes per the Blueprint. Editorial light ground, alternating
 * layout, wide margins. This is the part no competitor can copy.
 */
export default function Stories() {
  return (
    <section className="section-light">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <Reveal className="mb-20">
          <div className="flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold-dim">The road behind us</span>
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-display-l font-bold">
            Built from real miles.
          </h2>
          <p className="mt-4 max-w-xl text-graywarm-deep">
            These photographs are ours, taken over years on and off the road.
            They are the story of how this company came to be.
          </p>
        </Reveal>

        <div className="space-y-24 md:space-y-32">
          {stories.map((story, i) => (
            <Reveal key={story.slug}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Image
                  src={story.image}
                  alt={story.alt}
                  width={1920}
                  height={1440}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-auto w-full"
                />
                <div className="max-w-xl">
                  <p className="eyebrow text-gold-dim">{story.eyebrow}</p>
                  <h3 className="mt-4 font-display text-h2 font-bold">
                    {story.title}
                  </h3>
                  <p className="mt-5 leading-relaxed text-graywarm-deep">
                    {story.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
