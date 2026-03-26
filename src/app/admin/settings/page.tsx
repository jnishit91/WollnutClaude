"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [newUserCredits, setNewUserCredits] = useState("5.00");
  const [lowCreditsThreshold, setLowCreditsThreshold] = useState("2.00");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Settings are managed via environment variables for now
    toast.info(
      "Platform settings are configured via environment variables. Update them in your hosting provider (Vercel, etc)."
    );
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-surface-400" />
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
      </div>

      <div className="mt-8 space-y-6">
        {/* Credits config */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h2 className="text-lg font-semibold text-white">Credits</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-surface-300">
                New User Signup Credits (USD)
              </label>
              <input
                type="number"
                value={newUserCredits}
                onChange={(e) => setNewUserCredits(e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-surface-500">
                Amount of free credits given to new users on signup.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-300">
                Low Credits Warning Threshold (USD)
              </label>
              <input
                type="number"
                value={lowCreditsThreshold}
                onChange={(e) => setLowCreditsThreshold(e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-surface-500">
                Users receive a notification when their balance drops below this amount.
              </p>
            </div>
          </div>
        </div>

        {/* Environment info */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Environment Variables
          </h2>
          <p className="mt-2 text-sm text-surface-400">
            Core platform settings are managed through environment variables.
            Update these in your hosting provider dashboard:
          </p>
          <div className="mt-4 space-y-2">
            {[
              { key: "NEW_USER_CREDITS", desc: "Signup bonus amount" },
              { key: "LOW_CREDITS_THRESHOLD", desc: "Low balance warning level" },
              { key: "E2E_API_TOKEN", desc: "E2E Networks API token" },
              { key: "RAZORPAY_KEY_ID", desc: "Razorpay API key" },
              { key: "REDIS_URL", desc: "Redis connection for job queues" },
            ].map((env) => (
              <div
                key={env.key}
                className="flex items-center justify-between rounded-lg border border-surface-800 px-4 py-2.5"
              >
                <code className="text-sm text-brand-400">{env.key}</code>
                <span className="text-xs text-surface-500">{env.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
