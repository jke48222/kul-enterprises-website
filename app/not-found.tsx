import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center bg-ink">
      <div className="mx-auto w-full max-w-content px-6 py-32 text-center">
        <Image
          src="/images/brand/doctor-bird-display.png"
          alt=""
          aria-hidden
          width={302}
          height={261}
          className="mx-auto h-auto w-44"
        />
        <p className="eyebrow mt-8 text-graywarm">404. Off the route.</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-display-l font-bold text-white">
          This page isn&apos;t on the manifest.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-graywarm-light">
          The Doctor Bird flew ahead and couldn&apos;t find it either.
          Let&apos;s get you back on the road.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-gold">
            Back to Home
          </Link>
          <Link href="/quote" className="btn-ghost-dark">
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
