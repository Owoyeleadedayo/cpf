// import LogoText from "@/assets/logo-text.png";
// import Logo from "@/assets/logo.png";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import MobileNav from "../mobile-nav";

// export default function Navbar() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white/95">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-6xl mx-auto flex h-[5rem] md:h-[4rem] items-center justify-between"
//       >
//         <div className="md:flex hidden items-center ">
//           <Link href="/" className="flex items-center space-x-2">
//             <Image
//               src={Logo}
//               alt="Logo"
//               width={50}
//               height={50}
//               className="rounded"
//             />
//             <Image
//               src={LogoText}
//               alt="Logo"
//               width={150}
//               height={150}
//               className="rounded"
//             />
//             {/* <span className="hidden font-bold sm:inline-block">
//                 COVENANT PEOPLE FELLOWSHIP
//               </span> */}
//             {/* <span className="font-bold sm:hidden">CPF</span> */}
//           </Link>
//         </div>
//         <div className="flex items-center md:hidden px-4">
//           <Link href="/" className="flex items-center space-x-2">
//             <Image
//               src={Logo}
//               alt="Logo"
//               width={50}
//               height={50}
//               className="rounded"
//             />
//             <Image
//               src={LogoText}
//               alt="Logo"
//               width={80}
//               height={80}
//               className="rounded"
//             />
//           </Link>
//         </div>

//         <motion.nav
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="hidden md:flex items-center gap-6"
//         >
//           <Link
//             href="#about"
//             className="text-sm font-medium hover:text-primary"
//           >
//             About Us
//           </Link>
//           <Link
//             href="#mission"
//             className="text-sm font-medium hover:text-primary"
//           >
//             Mission
//           </Link>
//           <Link
//             href="#prayer"
//             className="text-sm font-medium hover:text-primary"
//           >
//             Prayer Request
//           </Link>
//           <Link
//             href="https://chat.whatsapp.com/example"
//             target="_blank"
//             className="text-sm font-medium hover:text-primary"
//           >
//             Join Our Group
//           </Link>
//         </motion.nav>

//         <MobileNav />
//       </motion.div>
//     </header>
//   );
// }


import { motion } from "framer-motion";
import MobileNav from "../mobile-nav"; // Ensure this is React-compatible
import Logo from "../../../assets/logo.png";
import LogoText from "../../../assets/logo-text.png"; // Adjust paths if needed

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
        <div className="md:flex hidden items-center">
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
              width={150}
              height={150}
              className="rounded"
            />
          </a>
        </div>

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

