import { motion } from "framer-motion";
import MobileNav from "../mobile-nav"; 
import Logo from "../../../assets/logo.png";
import LogoText from "../../../assets/logo-text.png"; 

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto flex h-[5rem] md:h-[4rem] items-center justify-between"
      >
        {/* Desktop Logo */}
        {/* <div className="md:flex hidden items-center"> */}
          <a href="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Logo"
              width={70}
              height={70}
              className="rounded"
            />
          </a>
        {/* </div> */}

        {/* Mobile Logo */}
        <div className="flex items-center md:hidden px-4">
          <a href="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Logo"
              width={50}
              height={50}
              className="rounded"
            />
            <img
              src={LogoText}
              alt="Logo Text"
              width={80}
              height={80}
              className="rounded"
            />
          </a>
        </div>

        {/* Desktop Nav Links */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-6"
        >
          <a href="#about" className="text-sm font-medium hover:text-primary">
            About Us
          </a>
          <a href="#mission" className="text-sm font-medium hover:text-primary">
            Mission
          </a>
          <a href="#prayer" className="text-sm font-medium hover:text-primary">
            Prayer Request
          </a>
          <a
            href="https://chat.whatsapp.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-primary"
          >
            Join Our Group
          </a>
        </motion.nav>

        {/* Mobile Menu */}
        <MobileNav />
      </motion.div>
    </header>
  );
}

