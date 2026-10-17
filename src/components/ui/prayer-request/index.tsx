import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "../button";
import { PrayerRequestForm } from "../PrayerRequestForm"; // Adjust the path based on your file structure
import { useState } from "react";
import emailjs from "@emailjs/browser";
import joinBg from "../../../assets/bible.jpg";

export default function CTAPrayerSession() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic form validation
    if (!formData.name || !formData.phoneNumber || !formData.reason) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your EmailJS Service ID, Template ID, and Public Key
      await emailjs.send(
        "service_fxy6mkd",
        "template_m356fbm",
        {
          from_name: formData.name,
          phone_number: formData.phoneNumber,
          reason: formData.reason,
        },
        "fHyobo3sQNWkW0gDa"
      );

      setSubmitStatus("success");
      setFormData({ name: "", phoneNumber: "", reason: "" });
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Call to Action Section */}
      <motion.section
        id="joinus"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ backgroundImage: `url(${joinBg})` }}
        className="relative w-full overflow-hidden bg-cover bg-center py-8 md:py-10 text-primary-foreground flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 py-4 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold font-['Montserrat'] tracking-tight md:text-5xl drop-shadow-lg">
                Get Involved Today
              </h2>
              <p className="max-w-[600px] font-['Figtree'] text-base md:text-lg xl:text-xl text-white/85">
                Join us in birthing destinies and fulfilling God's purpose.
                <br className="hidden md:block" /> Together, we can make a
                difference.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 shadow-lg font-['Montserrat'] bg-white text-primary hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer "
                onClick={() => setIsModalOpen(true)}
              >
                Join Our Fellowship <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prayer Request Section */}
      <section
        id="prayer"
        className="w-full py-10 md:py-12 lg:py-20 flex flex-col items-center justify-center bg-white"
      >
        <div className="container px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold font-['Montserrat'] tracking-tight text-primary">
                Send Your Prayer Request
              </h2>
              <p className="max-w-[600px] text-muted-foreground font-['Montserrat'] md:text-xl/relaxed lg:text-base/relaxed xl:text-lg/relaxed pt-2">
                " Call unto me and I will answer you and show you great and
                mighty things which you do not know " <br />
                <span className="italic text-primary/80 font-['Figtree']">- Jeremiah 33:3</span>
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-lg py-12">
            <PrayerRequestForm />
          </div>
        </div>
      </section>

      {/* Modal for Join Fellowship Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-primary/10"
          >
            <h3 className="text-2xl font-bold mb-6 text-primary text-center">
              Join Covenant People Fellowship
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block p-3 w-full rounded-xl border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block p-3 w-full rounded-xl border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Why do you want to join Covenant People Fellowship?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block p-3 w-full rounded-xl border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  required
                  placeholder="Share your reason..."
                />
              </div>
              {submitStatus === "success" && (
                <p className="text-green-600 text-sm text-center">
                  Form submitted successfully! We'll get back to you soon.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-sm text-center">
                  Please fill all fields or try again later.
                </p>
              )}
              <div className="flex justify-end gap-3 pt-2"></div>
              <Button
                type="button"
                variant="ghost"
                className="bg-gray-100 hover:bg-gray-200 text-primary"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              {/* </div> */}
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
