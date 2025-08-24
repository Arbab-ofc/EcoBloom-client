import { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaUser, FaPaperPlane } from "react-icons/fa";
import api from "../utils/api";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error("Name, email, and message are required");
    }
    if (!validEmail(form.email.trim())) {
      return toast.error("Please enter a valid email");
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/contacts", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        message: form.message.trim(),
      });

      if (data?.success) {
        toast.success("Thanks! We received your message.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data?.message || "Failed to submit message");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Contact Us
        </h1>
        <p className="mt-3 text-gray-600">
          Have a question, feedback, or a custom plant request? We’d love to hear from you.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 bg-white border rounded-2xl shadow-sm p-6 space-y-5"
      >
        
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded-lg pl-9 pr-3 py-2"
              placeholder="Your full name"
            />
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded-lg pl-9 pr-3 py-2"
              placeholder="you@example.com"
            />
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full border rounded-lg pl-9 pr-3 py-2"
              placeholder="10-digit phone"
            />
          </div>
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows={5}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Tell us how we can help you…"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          <FaPaperPlane />
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      
      <div className="mt-8 text-center text-sm text-gray-500">
        We typically respond within 24–48 hours. Thanks for reaching out! 🌿
      </div>
    </div>
  );
}
