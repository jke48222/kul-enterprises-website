import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import JourneyScroll from "@/components/home/JourneyScroll";
import Vision from "@/components/home/Vision";
import Stories from "@/components/home/Stories";
import ClosingCTA from "@/components/home/ClosingCTA";

/**
 * Home. The narrative arc: cinematic dark hero, trust facts, light services,
 * the pinned freight journey, light story beats, the pinned Vision, then the
 * closing ask.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <JourneyScroll />
      <Stories />
      <Vision />
      <ClosingCTA />
    </>
  );
}
