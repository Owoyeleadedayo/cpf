import { Helmet } from "react-helmet";
import ReactLenis from "lenis/react";
import AboutSession from "../components/ui/about-cpf";
// import VisionSession from "../components/ui/vision";
import Footer from "../components/ui/footer";
import { HeroSlider } from "../components/ui/hero";
import MissionSession from "../components/ui/mission";
import Navbar from "../components/ui/navbar";
import CTAPrayerSession from "../components/ui/prayer-request";
import SmoothScroll from "../components/ui/smooth-scroll";
import { DevotionalCarousel } from "../components/devotional/DevotionalCarousel";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Covenant People Fellowship</title>
        <meta
          name="description"
          content="Covenant People Fellowship was birthed in 2007 as a response to God's call."
        />
        <meta name="keywords" content="church, worship, community, prayer" />
        <meta name="author" content="Covenant People Fellowship" />
        <meta property="og:title" content="Covenant People Fellowship" />
        <meta property="og:description" content="We are a community of believers." />
        <meta property="og:image" content="/images/social-preview.png" />
        <meta property="og:url" content="https://cpfellowship.org" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main className="flex min-h-screen flex-col">
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
          <SmoothScroll />
          <Navbar />
          <HeroSlider />
          <DevotionalCarousel />
          <AboutSession />
          {/* <VisionSession /> */}
          <MissionSession />
          <CTAPrayerSession />
          <Footer />
        </ReactLenis>
      </main>
    </>
  );
}
