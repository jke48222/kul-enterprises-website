import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup. The real KUL mark (gold KUL letters, lion head, ENTERPRISES
 * LLC) cropped from Mark's concept board. Sized for dark surfaces, which is
 * every surface the header and footer touch.
 */
export default function BrandMark({ large = false }: { large?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KUL Enterprises home"
      className="inline-flex items-center"
    >
      <Image
        // REPLACEABLE ASSET: lockup cropped from the concept board; swap for the vector logo
        src="/images/brand/kul-logo-lockup.png"
        alt="KUL Enterprises LLC"
        width={244}
        height={91}
        priority
        className={large ? "h-14 w-auto" : "h-10 w-auto"}
      />
    </Link>
  );
}
