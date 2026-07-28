import Image from "next/image";

type WordmarkProps = {
  /** Rendered width in CSS pixels. Height follows the 140:94 artwork ratio. */
  width?: number;
  className?: string;
};

/**
 * The KUL lockup, wordmark plus lion, from the vector traced in Paper
 * ("Home, desktop 1440" nav).
 *
 * Delivery format is deliberate. The Paper vector is 924 paths / 247 KB
 * optimised (84 KB gzipped) because it traces the lion's fur, so it is
 * effectively raster art in vector clothing. At the 140px the nav actually
 * uses, a WebP with alpha is pixel-identical and 17.7 KB, roughly 5× lighter
 * on a mark that ships fixed on every page.
 *
 * The full vector lives at `public/images/brand/kul-logo.svg` for anywhere it
 * needs to scale large, hero marks, print, the Doctor Bird opening.
 */
export default function Wordmark({ width = 140, className }: WordmarkProps) {
  return (
    <Image
      src="/images/brand/kul-logo-nav.webp"
      alt="KUL Enterprises LLC"
      width={width}
      height={Math.round((width * 94) / 140)}
      priority
      className={className}
    />
  );
}
