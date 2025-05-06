  import type React from "react";
  import { useState } from "react";
  import { toast } from "sonner";
  import { motion } from "framer-motion"; 
  import { Button } from "../../components/ui/button";
  import { Input } from "../../components/ui/input";
  import { Textarea } from "../../components/ui/textarea";
  import { useInView } from "react-intersection-observer"; 

  export function PrayerRequestForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 }); 

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      setTimeout(() => {
        toast.success("Prayer Request Sent", {
          description:
            "We have received your prayer request and will be praying for you.",
        });
        setEmail("");
        setMessage("");
        setIsSubmitting(false);
      }, 1000);
    };

    return (
      <motion.div
        ref={ref}
        animate={inView ? { opacity: 1, y: 0 } : {}} 
        initial={{ opacity: 0, y: 50 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Prayer Request
            </label>
            <Textarea
              id="message"
              placeholder="Share your prayer request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit Prayer Request"}
            </Button>
          </motion.div>
          <p className="text-center text-sm text-muted-foreground">
            Your prayer request will be kept confidential and shared only with our
            prayer team.
          </p>
        </form>
      </motion.div>
    );
  }
