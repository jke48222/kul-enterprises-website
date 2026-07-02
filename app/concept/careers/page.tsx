import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import DriverForm from "@/components/forms/DriverForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Driver Careers",
  description:
    "Drive for KUL Enterprises, a growing Loganville, GA carrier where dispatch answers, equipment is maintained, and drivers are treated like professionals. CDL-A drivers welcome.",
};

const props = [
  {
    name: "Respect, not lip service",
    body: "You are a professional, not a truck number. Dispatch answers when you call, plans routes with you, and never asks you to run outside the rules.",
  },
  {
    name: "Home time that holds",
    body: "Regional and dedicated lanes built around real home time. When we commit to a schedule, we protect it.",
  },
  {
    name: "Equipment you can trust",
    body: "Well-maintained tractors and trailers, preventive maintenance on schedule, and zero pressure to roll on anything unsafe.",
  },
  {
    name: "Room to grow",
    body: "We are building toward fifty tractors by 2029. Drivers who grow with us now become the trainers, the leaders, and the first pick of lanes later.",
  },
];

const lookingFor = [
  "A valid CDL-A and a safety record you are proud of",
  "Professionalism at the dock. You represent the lion on the door.",
  "Communication. See something, say something, early.",
  "Pride in the craft. Clean truck, clean logs, clean handoffs.",
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Driver Careers"
        title="Drive for a company that knows your name."
        lede="KUL was founded by a driver. That changes how drivers get treated, starting with a dispatch line where a person answers."
        image="/images/stock/driver-in-cab-gold-truck.jpg"
        imagePosition="center 30%"
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_420px]">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="gold-rule" />
                  <span className="eyebrow text-gold-dim">Why drivers stay</span>
                </div>
                <h2 className="mt-5 max-w-2xl font-display text-display-l font-bold">
                  Built by a driver. Run like it.
                </h2>
              </Reveal>

              <RevealGroup className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
                {props.map((p) => (
                  <RevealItem key={p.name} className="bg-paper p-8">
                    <h3 className="font-display text-lg font-bold">{p.name}</h3>
                    <p className="mt-3 leading-relaxed text-graywarm-deep">
                      {p.body}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal className="mt-16">
                <h2 className="font-display text-h2 font-bold">
                  What we look for
                </h2>
                <ul className="mt-6 space-y-4">
                  {lookingFor.map((item) => (
                    <li key={item} className="flex gap-3 text-graywarm-deep">
                      <span
                        aria-hidden
                        className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-gold-dim"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 max-w-xl leading-relaxed text-graywarm-deep">
                  We treat drivers like the company depends on them, because
                  it does. Questions first? Call{" "}
                  <a
                    href={site.phoneHref}
                    className="font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>{" "}
                  or read our{" "}
                  <Link
                    href="/concept/safety"
                    className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dim"
                  >
                    safety practices
                  </Link>
                  .
                </p>
              </Reveal>
            </div>

            <Reveal className="lg:sticky lg:top-32">
              <Image
                src="/images/stock/driver-portrait-semi-cab-night.jpg"
                alt="A driver standing in front of his semi cab"
                width={2400}
                height={3600}
                sizes="(min-width: 1024px) 420px, 100vw"
                className="h-auto w-full"
              />
              <div id="apply" className="border border-ink/10 border-t-0 bg-white p-8">
                <h2 className="font-display text-xl font-bold">
                  Start the conversation
                </h2>
                <p className="mb-8 mt-2 text-sm text-graywarm-deep">
                  Thirty seconds, four fields. We call you back.
                </p>
                <DriverForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
