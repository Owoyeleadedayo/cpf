import Hero3 from "../../../assets/1.png";
import Hero2 from "../../../assets/2.png";
import Hero from "../../../assets/hero.png";
import { Button } from "../button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

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
      "You and I maturing into complete people in Christ Jesus growing into a tribe, spread over the globe",
  },
];

// Animation variants
const imageVariants = {
  enter: (direction: number) => ({
    scale: 1.2,
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    scale: 1,
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    scale: 0.8,
    opacity: 0,
    x: direction > 0 ? "-100%" : "100%",
  }),
};

const textVariants = {
  enter: {
    opacity: 0,
    y: 50,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -50,
  },
};

const transition = {
  duration: 0.8,
  ease: [0.32, 0.72, 0, 1],
};

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, nextSlide]);

  // Progress bar component
  const ProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      if (isHovered) {
        setProgress(0);
        return;
      }

      const duration = 5000;
      let start: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed < duration) {
          requestAnimationFrame(animate);
        }
      };

      const raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, [isHovered]);

    return (
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/80 z-30"
        style={{ width: `${progress}%` }}
      />
    );
  };

  return (
    <section
      className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-10 bg-black/50" />
          <motion.img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial="enter"
          animate="center"
          exit="exit"
          variants={textVariants}
          transition={{ ...transition, delay: 0.2 }}
          className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4"
        >
          <motion.h1
            className="text-3xl md:text-6xl font-extrabold mb-2"
            initial={{ letterSpacing: "2px" }}
            animate={{ letterSpacing: "0px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-4 pt-5 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          {slides[currentSlide].description && (
            <motion.p
              className="max-w-2xl text-base md:text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              {slides[currentSlide].description}
            </motion.p>
          )}

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          >
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
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.7)" }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white p-3 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.7)" }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white p-3 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>

      <ProgressBar />

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, ease: "easeOut" }}
      >
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </section>
  );
}