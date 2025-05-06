import { Helmet } from "react-helmet";
import ReactLenis from "lenis/react";
import SmoothScroll from "./components/ui/smooth-scroll";
import AboutSession from "./components/ui/about-cpf";
import Footer from "./components/ui/footer";
import { HeroSlider } from "./components/ui/hero";
import MissionSession from "./components/ui/mission";
import Navbar from "./components/ui/navbar";
import CTAPrayerSession from "./components/ui/prayer-request";
import WhatsAppButton from "./components/ui/whatsapp";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Covenant People Fellowship</title>
        <meta
          name="Covenant People Fellowship was birthed in 2007 as a response to
              God's call."
          content=" Covenant People Fellowship was birthed in 2007 as a response to
              God's call. It is a fellowship where we travail in the labor
              room of Prayer to bring about God's purpose as stated in
              Isaiah 66:8 &quot;As soon as Zion travailed, she brought
              forth.&quot;"
        />
        <meta name="keywords" content="church, worship, community, prayer" />
        <meta name="author" content="Covenant People Fellowship" />
        <meta property="og:title" content="Covenant People Fellowship" />
        <meta
          property="og:description"
          content="We are a community of believers."
        />
        <meta property="og:image" content="/images/social-preview.png" />
        <meta property="og:url" content="https://cpfellowship.org" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main className="flex min-h-screen flex-col">
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
          <SmoothScroll />
          <Navbar />
          <HeroSlider />
          <AboutSession />
          <MissionSession />
          <CTAPrayerSession />
          <WhatsAppButton />
          <Footer />
        </ReactLenis>
      </main>
    </>
  );
}
