import Hero3 from "../../../assets/1.jpg";
import Hero2 from "../../../assets/2.jpg";
import Hero from "../../../assets/hero.png";
import { Button } from "../button";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { useRef, useState } from "react";

const slides = [
  {
    image: Hero2,
    title: "Birthing Destinies.",
    subtitle:
      "We are a community of believers on a journey to fulfilling the God purpose",
    description:
      "Gathering together for the purpose of Word, Worship and Warfare",
  },
  {
    image: Hero,
    title: "Empowered by His covenant.",
    subtitle:
      "We are a people of prayer. We access the supernatural to fulfill God's mandate",
    description:
      "Those who have made a covenant with me by sacrifice - Psalm 50:5",
  },
  {
    image: Hero3,
    title: "Raising a Tribe of Intercessors.",
    subtitle:
      "You and I maturing into complete people in Christ Jesus growing into a tribe, spread over the globe",
  },
];

export function HeroSlider() {
  const carouselRef = useRef<CarouselRef>(null);
  const [current, setCurrent] = useState(0);

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={5000}
        effect="fade"
        speed={1000}
        dots={false}
        draggable
        beforeChange={(_, to) => setCurrent(to)}
      >
        {slides.map((slide, index) => (
          <div key={slide.title}>
            <div className="relative h-[60vh] md:h-[90vh] w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-black/50" />

              <div
                key={current === index ? "active" : "idle"}
                className={`relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white ${
                  current === index
                    ? "animate-in fade-in slide-in-from-bottom-8 duration-1000"
                    : "opacity-0"
                }`}
              >
                <h1 className="mb-1 text-3xl font-semibold md:text-5xl font-['Montserrat']">
                  {slide.title}
                </h1>
                <p className="mb-2 w-full md:max-w-2xl pt-2 text-lg md:text-2xl font-['Figtree']">
                  {slide.subtitle}
                </p>
                {slide.description && (
                  <p className="mb-8 max-w-2xl text-sm md:text-base font-['Figtree']">
                    {slide.description}
                  </p>
                )}
                <div className="flex gap-2 md:gap-4">
                  <Button
                    className="border border-gray-300 !text-white"
                    size="lg"
                    asChild
                  >
                    <a href="#about">Learn More</a>
                  </Button>
                  <Button
                    className="border !bg-white border-gray-300 !text-gray-600"
                    size="lg"
                    asChild
                  >
                    <a href="#prayer">Prayer Request</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => carouselRef.current?.goTo(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-white" : "w-3 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
