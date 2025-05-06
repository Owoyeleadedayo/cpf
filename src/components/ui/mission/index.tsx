import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
      className="w-full py-12 md:py-24 lg:py-28 bg-muted flex flex-col items-center justify-center"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Our Mission
            </h2>
            <div className="py-4">
              <p className="text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                To raise a tribe of complete People birthing destinies
              </p>
              <p className="text-center text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                and bringing to pass the will of God on earth.
              </p>
            </div>
          </div>
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
          className="mx-auto grid max-w-6xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
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
              className="flex flex-col justify-between rounded-lg border bg-card px-6  py-8 shadow-sm"
            >
              <div>
                <h3 className="text-xl font-bold">{mission.title}</h3>
                <p className="text-muted-foreground text-sm pt-5 leading-6">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
