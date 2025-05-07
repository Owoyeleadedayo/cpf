import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "../button";
import { PrayerRequestForm } from "../PrayerRequestForm"; // Adjust the path based on your file structure
import { useState } from "react";
import emailjs from "@emailjs/browser";

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
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full py-12 md:py-24 bg-primary text-primary-foreground flex flex-col items-center justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Get Involved Today
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join us in birthing destinies and fulfilling God's purpose.
                Together, we can make a difference.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="gap-1"
                onClick={() => setIsModalOpen(true)}
              >
                Join Our Fellowship <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prayer Request Section */}
      <section
        id="prayer"
        className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Send Your Prayer Request
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-lg/relaxed pt-5">
                "Call unto me and I will answer you and show you great and
                mighty things which you do not know" - Jeremiah 33:3
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Join Covenant People Fellowship
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Why do you want to join Covenant People Fellowship?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              {submitStatus === "success" && (
                <p className="text-green-600 text-sm">
                  Form submitted successfully! We'll get back to you soon.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-sm">
                  Please fill all fields or try again later.
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
