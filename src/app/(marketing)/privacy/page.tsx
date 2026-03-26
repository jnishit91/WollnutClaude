"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly: name, email address, and payment information (processed by Razorpay). We also collect usage data including instance creation/deletion events, login times, IP addresses, and API usage logs for security and billing purposes. We do not access or monitor the contents of your GPU instances.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to: provide and maintain the Service, process payments and billing, send account-related notifications (instance status, low balance warnings), improve the Service through aggregated analytics, respond to support requests, and comply with legal obligations.`,
  },
  {
    title: "3. Data Storage and Security",
    content: `Your account data is stored in a PostgreSQL database. Passwords are hashed with bcrypt. API keys are hashed with SHA-256 before storage. All communications are encrypted via TLS. We follow industry-standard security practices to protect your data.`,
  },
  {
    title: "4. Third-Party Services",
    content: `We use the following third-party services: Razorpay (payment processing — subject to Razorpay's privacy policy), E2E Networks (GPU infrastructure — your instance data resides on their hardware), Google and GitHub (OAuth authentication — only profile information is shared), and analytics tools for aggregated usage metrics.`,
  },
  {
    title: "5. Instance Data",
    content: `Data stored on your GPU instances is your responsibility. When you destroy an instance, the associated storage is permanently deleted. We do not backup instance data. We recommend using persistent volumes or external storage for important data.`,
  },
  {
    title: "6. Cookies",
    content: `We use essential cookies for authentication (session tokens) and preferences. We do not use tracking cookies or third-party advertising cookies.`,
  },
  {
    title: "7. Data Retention",
    content: `Account data is retained for as long as your account is active. Billing records are retained for 7 years as required by law. Audit logs are retained for 1 year. Upon account deletion, personal data is removed within 30 days, except where retention is required by law.`,
  },
  {
    title: "8. Your Rights",
    content: `You have the right to: access your personal data, correct inaccurate data, delete your account and associated data, export your data, and opt out of non-essential communications. To exercise these rights, contact us at privacy@wollnutlabs.com.`,
  },
  {
    title: "9. Data Transfers",
    content: `Your data may be processed in India where our infrastructure partner operates. By using the Service, you consent to this transfer. We ensure appropriate safeguards are in place for any cross-border data transfers.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Material changes will be communicated via email. The latest version will always be available on this page.`,
  },
];

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-4 text-surface-400">
              Last updated: March 15, 2025
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-8">
        <p className="leading-relaxed text-surface-300">
          At Wollnut Labs, we take your privacy seriously. This policy explains
          what data we collect, how we use it, and your rights regarding your
          personal information.
        </p>

        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-surface-300">{s.content}</p>
          </section>
        ))}

        <div className="border-t border-surface-800 pt-8 text-sm text-surface-500">
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:privacy@wollnutlabs.com"
            className="text-brand-400 hover:text-brand-300"
          >
            privacy@wollnutlabs.com
          </a>
          .
        </div>
      </div>
    </div>
  );
}
