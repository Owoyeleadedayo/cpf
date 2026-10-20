import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Logo from "../../../assets/logo.png";

const Footer = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });


  return (
    <motion.footer
      className="w-full border-t px-4 py-6 md:py-16 bg-[#F1F1F1]"
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : {}}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.5, ease: "easeOut" },
            },
          }}
        >
          {/* Logo & Intro */}
          <motion.div
            className="flex flex-col gap-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex">
              <a href="/" className="space-x-2">
                <img
                  src={Logo}
                  alt="Logo"
                  width={100}
                  height={70}
                  className="rounded"
                />
              </a>
            </div>
            {/* <a href="/" className="flex items-center space-x-2">
              <span className="font-bold">COVENANT PEOPLE FELLOWSHIP</span>
            </a> */}
            <p className="text-base font-['Figtree'] text-muted-foreground">
              Established 2007, Revised 2024
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-lg font-['Montserrat'] font-semibold mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="#about"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                About Us
              </a>
              <a
                href="#mission"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                Mission and Vision
              </a>
              <a
                href="#mission"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                What We Do
              </a>
              <a
                href="#weekly-meditation"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                Weekly Prayer
              </a>
              <a
                href="#prayer"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                Prayer Request
              </a>
              <a
                href="https://chat.whatsapp.com/example"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-['Figtree'] text-muted-foreground hover:text-foreground"
              >
                Join Our Group
              </a>
            </nav>
          </motion.div>

          {/* Core Values */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-lg font-['Montserrat'] font-semibold mb-4">
              Core Values
            </h3>
            <ul className="space-y-2 text-base font-['Figtree'] text-muted-foreground">
              <li>Truth</li>
              <li>Love</li>
              <li>Completeness</li>
              <li>Purpose</li>
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-lg font-['Montserrat'] font-semibold mb-4">
              Contact Us
            </h3>
            <address className="not-italic text-base font-['Figtree'] text-muted-foreground">
              <p>www.csfellowships@gmail.com</p>
              <p>whatsapp: +(234)8037219016</p>
              <p>whatsapp: +(234)8026016413</p>

              <p className="mt-4">
                &copy;{new Date().getFullYear()} Covenant People Fellowship.
                <br />
                All rights reserved.
              </p>
            </address>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;

