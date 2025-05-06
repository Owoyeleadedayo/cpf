import Hero3 from "../../../assets/1.png";
import Hero2 from "../../../assets/2.png";
import Hero from "../../../assets/hero.png";
import { Button } from "../button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    image: Hero,
    title: "Birthing Destinies",
    subtitle:
      "We are a community of believers on a journey to fulfilling the God purpose",
    description:
      "Gathering together for the purpose of Word, Worship and Warfare",
  },
  {
    image: Hero2,
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
      " You and I maturing into complete people in Christ Jesus growing into a tribe, spread over the globe",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={index}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Overlay */}
                <div className="absolute inset-0 z-10 bg-black/50" />

                {/* Background image (behind everything) */}
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Text Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
                  <h1 className="text-3xl md:text-6xl font-extrabold mb-2">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-4 pt-5">
                    {slide.subtitle}
                  </p>
                  <p className="max-w-2xl text-base md:text-lg mb-8">
                    {slide.description}
                  </p>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="lg" asChild>
                      <a href="#about">Learn More</a>
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
                      size="lg"
                      asChild
                    >
                      <a href="#prayer">Prayer Request</a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
