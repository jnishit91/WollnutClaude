"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      'By accessing or using Wollnut Labs ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
  },
  {
    title: "2. Description of Service",
    content:
      "Wollnut Labs provides on-demand access to GPU cloud computing resources through a web dashboard and REST API. We act as a reseller of compute resources provisioned through our infrastructure partner, E2E Networks.",
  },
  {
    title: "3. Account Registration",
    content:
      "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials, SSH keys, and API keys. You must be at least 18 years old to use the Service.",
  },
  {
    title: "4. Billing and Payment",
    content:
      "The Service uses a credit-based billing system. You purchase credits via Razorpay and usage is deducted per-minute from your balance. Prices are displayed at the time of instance creation. Credits are non-refundable except as required by law. If your credit balance reaches zero, running instances will be automatically stopped.",
  },
  {
    title: "5. Acceptable Use",
    content:
      "You may not use the Service for: illegal activities, cryptocurrency mining (unless explicitly permitted), distributing malware, infringing intellectual property, overloading shared infrastructure, or any activity that violates applicable laws. We reserve the right to terminate accounts that violate this policy.",
  },
  {
    title: "6. Data and Privacy",
    content:
      "You retain ownership of all data you upload to or create on your instances. We do not access your instance data except as required for technical support (with your consent) or as required by law. See our Privacy Policy for details on data handling.",
  },
  {
    title: "7. Service Availability",
    content:
      'The Service is provided "as is" without warranty of any kind. While we strive for high availability, we do not guarantee uninterrupted access. GPU availability depends on our infrastructure partner and may vary. We are not liable for losses resulting from service downtime.',
  },
  {
    title: "8. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, Wollnut Labs shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.",
  },
  {
    title: "9. Termination",
    content:
      "Either party may terminate this agreement at any time. Upon termination, your instances will be stopped, and data on instances may be permanently deleted after 30 days. Remaining credits are non-refundable upon voluntary termination.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may update these terms from time to time. Material changes will be communicated via email or dashboard notification. Continued use of the Service after changes constitutes acceptance of the updated terms.",
  },
  {
    title: "11. Governing Law",
    content:
      "These terms are governed by the laws of India. Any disputes shall be resolved in the courts of competent jurisdiction in India.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Terms of Service
            </h1>
            <p className="mt-4 text-surface-400">
              Last updated: March 15, 2025
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-surface-300">{s.content}</p>
          </section>
        ))}

        <div className="border-t border-surface-800 pt-8 text-sm text-surface-500">
          If you have questions about these terms, contact us at{" "}
          <a
            href="mailto:legal@wollnutlabs.com"
            className="text-brand-400 hover:text-brand-300"
          >
            legal@wollnutlabs.com
          </a>
          .
        </div>
      </div>
    </div>
  );
}
