"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-400">
              Questions about GPU plans, enterprise pricing, or partnership
              opportunities? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Get in Touch</h2>
              <p className="mt-2 text-sm text-surface-400">
                Our team typically responds within 24 hours on business days.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/10 p-2">
                  <Mail className="h-4 w-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-sm text-surface-400">
                    support@wollnutlabs.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/10 p-2">
                  <MessageSquare className="h-4 w-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sales</p>
                  <p className="text-sm text-surface-400">
                    sales@wollnutlabs.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/10 p-2">
                  <MapPin className="h-4 w-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Location</p>
                  <p className="text-sm text-surface-400">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-4 rounded-xl border border-surface-800 bg-surface-900 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-surface-400">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-400">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-surface-400">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-surface-400">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
