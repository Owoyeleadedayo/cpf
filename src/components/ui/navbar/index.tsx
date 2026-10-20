import { motion } from "framer-motion";
import MobileNav from "../mobile-nav";
import Logo from "../../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/40 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] py-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto flex h-[5rem] md:h-[4rem] items-center justify-between"
      >
        {/* Desktop Logo */}
        <div className="md:flex hidden">
          <a href="/" className="space-x-2">
            <img
              src={Logo}
              alt="Logo"
              width={100}
              height={80}
              className="rounded"
            />
          </a>
        </div>

        {/* Mobile Logo */}
        <div className="flex  md:hidden px-6">
          <a href="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Logo"
              width={70}
              height={70}
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
          <a
            href="#about"
            className="text-sm md:text-base font-medium font-['Montserrat'] hover:text-primary"
          >
            About Us
          </a>
          <a
            href="#mission"
            className="text-sm md:text-base font-medium font-['Montserrat'] hover:text-primary"
          >
            Mission
          </a>
          <a
            href="#weekly-meditation"
            className="text-sm font-medium md:text-base font-['Montserrat'] hover:text-primary"
          >
            Weekly Prayer
          </a>
          <a
            href="#prayer"
            className="text-sm font-medium md:text-base font-['Montserrat'] hover:text-primary"
          >
            Prayer Request
          </a>
          <a
            href="#joinus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium md:text-base font-['Montserrat'] hover:text-primary"
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
