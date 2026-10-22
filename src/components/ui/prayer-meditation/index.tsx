import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "../../../lib/supabaseClient";
import type { WeeklyMeditation } from "../../../types/meditation";

// ─── Fallback content ────────────────────────────────────────────────────────
// Update this object when you need a quick content change without touching the DB.
// Once Supabase returns data this fallback is not shown.
const FALLBACK: WeeklyMeditation = {
  id: "fallback",
  title: "Daily Prayer & Meditation",
  greeting: "Good morning Covenant People of God 😊.",
  scripture_reference: "Psalm 115:9–15",
  scripture_text:
    "O Israel, trust and take refuge in the Lord! [Lean on, rely on, and be confident in Him!] He is their Help and their Shield. O house of Aaron [the priesthood], trust in and lean on the Lord! He is their Help and their Shield. You who [reverently] fear the Lord, trust in and lean on the Lord! He is their Help and their Shield. The Lord has been mindful of us, He will bless us: He will bless the house of Israel, He will bless the house of Aaron [the priesthood], He will bless those who reverently and worshipfully fear the Lord, both small and great. May the Lord give you increase more and more, you and your children. May you be blessed of the Lord, Who made heaven and earth!",
  declaration:
    "This week, trust and take refuge in the Lord God, the maker of heaven and earth, and there shall be showers of blessings upon you and your household in Jesus' name. Amen!",
  week_date: "",
  status: "published",
  is_active: true,
  author_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function PrayerMeditation() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [meditation, setMeditation] = useState<WeeklyMeditation>(FALLBACK);

  const fetchActive = useCallback(async () => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("weekly_meditations")
        .select("*")
        .eq("status", "published")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("PrayerMeditation: Supabase error, using fallback.", error.message);
        return;
      }
      if (data) setMeditation(data as WeeklyMeditation);
    } catch {
      // Silently fall back to default content
    }
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  // Shared Framer Motion variants (mirrors Mission component style)
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <motion.section
      ref={ref}
      id="weekly-meditation"
      aria-label="Daily Prayer and Meditation"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="w-full py-16 md:py-24 bg-white flex flex-col items-center justify-center"
    >
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
          <h2 className="text-3xl font-bold font-['Montserrat'] tracking-tighter md:text-4xl">
            Prayer &amp; Meditation
          </h2>
        </div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_8px_32px_rgba(31,38,135,0.20),inset_0_1px_0_rgba(255,255,255,0.6)]"
        >
          {/* Card accent strip */}
          <div className="h-1.5 w-full bg-primary" />

          <div className="p-6 md:p-10 space-y-6">
            {/* Date / week indicator */}
            {meditation.week_date && (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {meditation.week_date}
              </p>
            )}

            {/* Greeting */}
            {/* {meditation.greeting && (
              <p className="text-base font-['Montserrat'] font-semibold text-foreground md:text-lg">
                {meditation.greeting}
              </p>
            )} */}

            {/* Scripture reference */}
            <div className="flex items-center gap-2">
              <span className="inline-block font-['Montserrat'] rounded-md bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {meditation.scripture_reference}
              </span>
            </div>

            {/* Scripture text */}
            <blockquote className="relative border-l-4 border-primary pl-5 pr-2">
              <p className="text-base font-['Figtree'] leading-8 text-muted-foreground italic md:text-lg/8 ">
                &ldquo;{meditation.scripture_text}&rdquo;
              </p>
            </blockquote>

            {/* Divider */}
            <hr className="border-white/40" />

            {/* Weekly declaration */}
            <p className="text-base font-['Figtree'] leading-7 text-foreground font-medium md:text-lg/8">
              {meditation.declaration}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
