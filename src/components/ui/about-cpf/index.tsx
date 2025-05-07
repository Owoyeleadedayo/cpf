import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
// import Image from "next/image";
import About from "../../../assets/convenant.jpeg";

export default function AboutSession() {
  return (
    <motion.section
      id="about"
      className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center grid-col-row-dense md:grid-col-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Left Content with Slide Up Animation */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              About Covenant People Fellowship
            </h2>
            <p className="text-muted-foreground leading-7">
              Covenant People Fellowship (CPF) began as a vision in 2006, when
              God spoke clearly about raising a people dedicated to birthing
              destinies through prayer, sacrifice, and wholehearted pursuit of
              Him. In 2007, the burden grew stronger, and CPF was born as a
              response to that divine call.
            </p>
            <p className="text-muted-foreground leading-7">
              After years of waiting, nurturing, and preparation, CPF was
              officially inaugurated in May 2024. What began as a vision has now
              become a gathering place for Word, Worship, and Warfare. We come
              together to enjoy God’s presence, discover purpose, and fulfill
              destiny, individually and collectively.
            </p>
            <p className="text-muted-foreground leading-7">
              CPF is more than a fellowship; it is a covenant walk. It’s a call
              to a life of sacrifice, devotion, and alignment with the
              covenant-keeping God, who rewards those who diligently seek Him.”
            </p>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button className="gap-1">
                Learn More <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image with Scale Animation */}
          <motion.div
            className="lg:order-last"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src={About}
              alt="Fellowship gathering"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
