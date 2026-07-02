import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import DriverForm from "@/components/forms/DriverForm";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = { title: "Drive With KUL" };

const props = [
  {
    name: "Respect, not lip service",
    body: "You are a professional, not a truck number. Dispatch answers when you call and never asks you to run outside the rules.",
  },
  {
    name: "Home time that holds",
    body: "Regional and dedicated lanes built around real home time. When we commit to a schedule, we protect it.",
  },
  {
    name: "Equipment you can trust",
    body: "Well-maintained tractors and trailers, preventive maintenance on schedule, zero pressure to roll on anything unsafe.",
  },
  {
    name: "Room to grow",
    body: "We are building toward fifty tractors by 2029. Drivers who grow with us now become the trainers and leaders later.",
  },
];

export default function ConceptDrivers() {
  return (
    <>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <Image
          src="/images/stock/driver-portrait-semi-cab-night.jpg"
          alt="A professional driver standing at his semi cab"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.45),transparent_40%,rgba(22,22,22,0.92))]" />
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Drive With KUL
          </p>
          <h1 className="mt-4 max-w-2xl font-omnibus text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight text-[#F8F8F8]">
            Drive for a company that knows your name.
          </h1>
          <p className="mt-4 max-w-xl text-graywarm-light">
            KUL was founded by a driver. That changes how drivers get treated,
            starting with a dispatch line where a person answers.
          </p>
        </Reveal>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {props.map((p) => (
              <Reveal key={p.name} className="bg-ink2 p-8">
                <h2 className="font-omnibus text-xl text-cream">
                  {p.name}
                </h2>
                <p className="mt-3 leading-relaxed text-graywarm-light">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8F8]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <Reveal className="text-center">
            <h2 className="font-mont text-[15px] font-semibold uppercase tracking-[0.35em] text-ink">
              Start the Conversation
            </h2>
            <p className="mt-3 text-sm text-graywarm-deep">
              Thirty seconds, four fields. We call you back. Questions first?
              Call{" "}
              <a href={site.phoneHref} className="font-semibold text-ink underline-offset-4 hover:underline">
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
          <Reveal className="mt-12 rounded-2xl border border-ink/10 bg-white p-8 md:p-10">
            <DriverForm />
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
