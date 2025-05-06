import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { Button } from "../button";
import { PrayerRequestForm } from "../PrayerRequestForm"; // Adjust the path based on your file structure

export default function CTAPrayerSession() {
  return (
    <>
      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full py-12 md:py-24 bg-primary text-primary-foreground flex flex-col items-center justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Get Involved Today
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join us in birthing destinies and fulfilling God&apos;s purpose.
                Together, we can make a difference.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button variant="secondary" size="lg" className="gap-1">
                Join Our Fellowship <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prayer Request Section */}
      <section
        id="prayer"
        className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Send Your Prayer Request
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-lg/relaxed pt-5">
                &quot;Call unto me and I will answer you and show you great and
                mighty things which you do not know&quot; - Jeremiah 33:3
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-lg py-12">
            <PrayerRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
