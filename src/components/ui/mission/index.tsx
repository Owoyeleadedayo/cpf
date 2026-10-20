import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import About from "../../../assets/m&v.jpg";

export default function MissionSession() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.section
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      id="mission"
      className="w-full py-12 md:py-14 lg:py-18 px-0 md:px-28 bg-muted flex flex-col items-center justify-center"
    >
      <div className="container flex flex-col items-center justify-center space-y-3 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 md:space-y-8 text-center mb-12">
          {/* <h2 className="text-2xl font-semibold font-['Montserrat'] tracking-tighter md:text-4xl">
            Our Mission and Vision
          </h2> */}
          <div className="flex w-ful flex-col justify-between items-center md:flex-row gap-15">
            <motion.div
              className="w-90 h-60 md:w-120 md:h-80  rounded-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={About}
                alt="Fellowship gathering"
                className="mx-auto aspect-square overflow-hidden rounded-md object-cover"
              />
            </motion.div>
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <div className="flex flex-col items-start justify-start text-start gap-7">
                <div className="flex items-start justify-start text-start gap-6">
                  <p className="text-lg font-semibold font-['Montserrat'] md:text-2xl">
                    Our Mission
                  </p>
                  <div className="w-full md:max-w-110">
                    <p className="text-start text-base tracking-tight font-['Figtree'] md:text-lg ">
                      To build a people of fellowship, grounded in prayer,
                      worship, and the Word birthing God’s purpose on earth.
                    </p>
                  </div>
                </div>
                <hr className="w-full border-t border-gray-300" />
                <div className="flex items-start justify-start text-start gap-8">
                  <h2 className="text-lg font-semibold font-['Montserrat'] md:text-2xl">
                    Our Vision
                  </h2>
                  <p className="max-w-112 text-start text-base tracking-tight font-['Figtree'] md:text-lg">
                    To raise a tribe of complete people who birth destinies and
                    bring to pass the will of God on earth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-3 md:mt-6">
          <div>
            <h2 className="text-3xl font-bold font-['Montserrat'] tracking-tighter md:text-4xl">
              What We Do
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            ref={ref}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.3 },
              },
            }}
            className="mx-auto grid max-w-6xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Gathering Together",
                description:
                  "In line with Psalm 50:5, we gather together from time to time for fellowship both online and in-person.",
              },
              {
                title: "Worship",
                description:
                  "According to Revelation 4:8-11, whenever we come together, we worship His majesty in the beauty of His holiness.",
              },
              {
                title: "Supplication & Intercession",
                description:
                  "We have weekly virtual prayers and monthly physical gatherings to worship God and pray for our garden.",
              },
              {
                title: "Bible Study",
                description:
                  "Following 2 Timothy 2:15, we study the word of God which brings us to the knowledge of the truth, maturing us into complete people.",
              },
              {
                title: "Raising Intercessors",
                description:
                  "We aim to mature into whole and complete people in Christ Jesus, growing a Tribe that will bring to bear the purpose of God.",
              },
              {
                title: "Birthing Destinies",
                description:
                  "Our major assignment is to birth destinies at God's Threshing Floor through intercession as the Spirit of God instructs.",
              },
            ].map((mission, index) => (
              <motion.div
                ref={ref}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                key={index}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-white/40 to-white/10 px-6 py-8 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_8px_32px_rgba(31,38,135,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.1)]"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold font-['Montserrat']">
                    {mission.title}
                  </h3>
                  <p className="text-base md:text-lg font-light pt-3 font-['Figtree'] leading-6">
                    {mission.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
