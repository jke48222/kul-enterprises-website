import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Dark intro band shared by every inner page. Keeps the fixed header legible
 * everywhere and gives each page one cinematic breath before the light
 * editorial body. Pass an image for a photographic backdrop; the scrim
 * keeps the headline readable either way.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt = "",
  imagePosition = "center",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {image && (
        <div aria-hidden className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            quality={80}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.92)_0%,rgba(11,11,11,0.7)_50%,rgba(11,11,11,0.35)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(11,11,11,0.9))]" />
        </div>
      )}
      <div className="relative mx-auto max-w-content px-6 pb-16 pt-40 md:pb-20 md:pt-48">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold">{eyebrow}</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-display-xl font-bold text-white">
            {title}
          </h1>
          {lede && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graywarm-light">
              {lede}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
