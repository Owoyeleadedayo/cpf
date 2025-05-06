import { MessageSquare } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <a
      href="https://chat.whatsapp.com/example"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Button
          className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E]"
          size="icon"
        >
          <MessageSquare className="h-6 w-6 text-white" />
          <span className="sr-only">Join our WhatsApp community</span>
        </Button>
      </motion.div>
      <span className="absolute -top-10 right-0 bg-background border px-3 py-1 rounded-md text-sm whitespace-nowrap shadow-md">
        Join our community
      </span>
    </a>
  );
}
