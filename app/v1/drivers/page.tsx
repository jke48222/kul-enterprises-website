import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import DriverForm from "@/components/concept/forms/DriverForm";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "Drive With KUL",
  description:
    "Drive for a Georgia carrier that knows your name: honest dispatch, home time that holds, safe equipment, and room to grow. CDL-A.",
};

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
      <section className="relative min-h-[80svh] overflow-hidden">
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
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Drive With KUL
          </h1>
        </div>
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
