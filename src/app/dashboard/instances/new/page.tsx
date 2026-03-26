"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { usePlans, useTemplates, type GPUPlanData, type TemplateData } from "@/lib/hooks/use-plans";
import { useCreateInstance } from "@/lib/hooks/use-instances";
import { useAuth } from "@/lib/hooks/use-auth";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { Spinner } from "@/components/shared/Spinner";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { Check, AlertTriangle } from "lucide-react";

const STEPS = [
  { label: "GPU" },
  { label: "Template" },
  { label: "Configure" },
  { label: "Review" },
];

// ─── Step 1: GPU Selection ──────────────────

function GPUStep({
  plans,
  selected,
  onSelect,
}: {
  plans: GPUPlanData[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Select GPU</h2>
      <p className="mt-1 text-sm text-surface-400">
        Choose the GPU that fits your workload
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`gpu-card text-left ${
              selected === plan.id
                ? "border-brand-500 ring-1 ring-brand-500/50"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white">{plan.gpuName}</p>
                <p className="text-xs text-surface-400">
                  {plan.vram} &middot; {plan.vcpus} vCPUs &middot; {plan.ram}
                </p>
              </div>
              {selected === plan.id && (
                <div className="rounded-full bg-brand-600 p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            {plan.infiniband && (
              <span className="mt-2 inline-block rounded bg-accent-purple/10 px-2 py-0.5 text-[10px] font-medium text-accent-purple">
                InfiniBand: {plan.infiniband}
              </span>
            )}
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">
                ${plan.wollnutPricePerHour.toFixed(2)}
              </span>
              <span className="text-xs text-surface-500">/hr</span>
            </div>
            {plan.availableCount && (
              <p className="mt-1 text-[11px] text-surface-500">
                Available: {plan.availableCount}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Template Selection ─────────────

function TemplateStep({
  templates,
  selected,
  onSelect,
  selectedPlan,
}: {
  templates: TemplateData[];
  selected: string | null;
  onSelect: (slug: string) => void;
  selectedPlan: GPUPlanData | null;
}) {
  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category));
    return ["All", ...Array.from(cats)];
  }, [templates]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Select Template</h2>
      <p className="mt-1 text-sm text-surface-400">
        Choose a pre-configured environment
      </p>

      {/* Category tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => {
          const vramWarning =
            selectedPlan &&
            template.minVram &&
            parseInt(template.minVram) >
              parseInt(selectedPlan.vram);

          return (
            <button
              key={template.slug}
              onClick={() => onSelect(template.slug)}
              className={`rounded-xl border bg-surface-900/50 p-4 text-left transition-all hover:border-surface-600 ${
                selected === template.slug
                  ? "border-brand-500 ring-1 ring-brand-500/50"
                  : "border-surface-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="font-medium text-white">{template.name}</p>
                {selected === template.slug && (
                  <div className="rounded-full bg-brand-600 p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-surface-400">
                {template.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.includedPackages.slice(0, 3).map((pkg) => (
                  <span
                    key={pkg}
                    className="rounded bg-surface-800 px-1.5 py-0.5 text-[10px] text-surface-400"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
              {vramWarning && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-accent-amber">
                  <AlertTriangle className="h-3 w-3" />
                  Requires {template.minVram} VRAM
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3: Configuration ──────────────────

function ConfigStep({
  config,
  setConfig,
  sshKeys,
}: {
  config: { storageGb: number; autoShutdownMin: number | null; sshKeyId: string; region: string };
  setConfig: (c: typeof config) => void;
  sshKeys: { id: string; name: string; fingerprint: string }[];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Configure Instance</h2>
      <p className="mt-1 text-sm text-surface-400">
        Set storage, SSH key, and shutdown preferences
      </p>

      <div className="mt-6 space-y-6">
        {/* Storage */}
        <div>
          <label className="block text-sm font-medium text-surface-300">
            Storage: {config.storageGb} GB
          </label>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={config.storageGb}
            onChange={(e) =>
              setConfig({ ...config, storageGb: parseInt(e.target.value) })
            }
            className="mt-2 w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-surface-500">
            <span>50 GB</span>
            <span>2 TB</span>
          </div>
        </div>

        {/* SSH Key */}
        <div>
          <label className="block text-sm font-medium text-surface-300">
            SSH Key
          </label>
          <select
            value={config.sshKeyId}
            onChange={(e) =>
              setConfig({ ...config, sshKeyId: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white focus-ring"
          >
            <option value="">None (configure later)</option>
            {sshKeys.map((key) => (
              <option key={key.id} value={key.id}>
                {key.name} ({key.fingerprint.slice(0, 16)}...)
              </option>
            ))}
          </select>
          <a
            href="/dashboard/settings"
            className="mt-1 inline-block text-xs text-brand-400 hover:text-brand-300"
          >
            Add new SSH key in settings
          </a>
        </div>

        {/* Auto-shutdown */}
        <div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-surface-300">
              Auto-shutdown
            </label>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  autoShutdownMin: config.autoShutdownMin ? null : 240,
                })
              }
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                config.autoShutdownMin ? "bg-brand-600" : "bg-surface-700"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                  config.autoShutdownMin ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {config.autoShutdownMin !== null && (
            <div className="mt-2">
              <input
                type="number"
                min={30}
                max={10080}
                value={config.autoShutdownMin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    autoShutdownMin: parseInt(e.target.value) || 240,
                  })
                }
                className="w-32 rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2 text-sm text-white focus-ring"
              />
              <span className="ml-2 text-xs text-surface-500">minutes</span>
            </div>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-surface-300">
            Region
          </label>
          <select
            value={config.region}
            onChange={(e) =>
              setConfig({ ...config, region: e.target.value })
            }
            className="mt-1 block w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white focus-ring"
          >
            <option value="Delhi">Delhi NCR</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review & Launch ────────────────

function ReviewStep({
  plan,
  template,
  config,
  creditsBalance,
}: {
  plan: GPUPlanData;
  template: TemplateData;
  config: { storageGb: number; autoShutdownMin: number | null; region: string };
  creditsBalance: number;
}) {
  const dailyCost = plan.wollnutPricePerHour * 24;
  const monthlyCost = dailyCost * 30;
  const hoursRemaining = creditsBalance / plan.wollnutPricePerHour;
  const lowCredits = hoursRemaining < 24;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white">Review & Launch</h2>
      <p className="mt-1 text-sm text-surface-400">
        Confirm your instance configuration
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500">GPU</span>
              <p className="font-medium text-white">{plan.gpuName}</p>
            </div>
            <div>
              <span className="text-surface-500">VRAM</span>
              <p className="font-medium text-white">{plan.vram}</p>
            </div>
            <div>
              <span className="text-surface-500">Template</span>
              <p className="font-medium text-white">{template.name}</p>
            </div>
            <div>
              <span className="text-surface-500">Storage</span>
              <p className="font-medium text-white">{config.storageGb} GB</p>
            </div>
            <div>
              <span className="text-surface-500">Region</span>
              <p className="font-medium text-white">{config.region}</p>
            </div>
            <div>
              <span className="text-surface-500">Auto-shutdown</span>
              <p className="font-medium text-white">
                {config.autoShutdownMin
                  ? `${config.autoShutdownMin} min`
                  : "Disabled"}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <h3 className="text-sm font-semibold text-white">Estimated Cost</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-400">Per hour</span>
              <span className="font-medium text-white">
                ${plan.wollnutPricePerHour.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Projected daily</span>
              <span className="text-surface-300">${dailyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Projected monthly</span>
              <span className="text-surface-300">
                ${monthlyCost.toFixed(2)}
              </span>
            </div>
            <hr className="border-surface-800" />
            <div className="flex justify-between">
              <span className="text-surface-400">Your balance</span>
              <span className="font-medium text-accent-green">
                ${creditsBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Est. runtime</span>
              <span className={lowCredits ? "text-accent-amber" : "text-surface-300"}>
                {hoursRemaining.toFixed(1)} hours
              </span>
            </div>
          </div>
        </div>

        {lowCredits && (
          <div className="flex items-center gap-2 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-3 text-sm text-accent-amber">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            Your balance covers less than 24 hours of runtime. Consider adding
            credits.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Wizard ────────────────────────────

function CreateInstanceWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const createInstance = useCreateInstance();

  const [step, setStep] = useState(0);
  const [instanceName, setInstanceName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(() => {
    // Pre-select from URL param
    const gpu = searchParams.get("gpu");
    return gpu ? null : null; // Will be set after plans load
  });
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string | null>(null);
  const [config, setConfig] = useState({
    storageGb: 100,
    autoShutdownMin: null as number | null,
    sshKeyId: "",
    region: "Delhi",
  });
  const [sshKeys, setSshKeys] = useState<
    { id: string; name: string; fingerprint: string }[]
  >([]);

  // Fetch SSH keys on mount
  useState(() => {
    fetch("/api/v1/ssh-keys")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSshKeys(d.data);
      })
      .catch(() => {});
  });

  // Pre-select GPU from URL param after plans load
  useState(() => {
    if (plans && !selectedPlanId) {
      const gpuParam = searchParams.get("gpu");
      if (gpuParam) {
        const match = plans.find((p) =>
          p.gpuShortName.toLowerCase().includes(gpuParam.toLowerCase())
        );
        if (match) setSelectedPlanId(match.id);
      }
    }
  });

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId) ?? null;
  const selectedTemplate =
    templates?.find((t) => t.slug === selectedTemplateSlug) ?? null;

  const canNext = () => {
    switch (step) {
      case 0:
        return !!selectedPlanId;
      case 1:
        return !!selectedTemplateSlug;
      case 2:
        return config.storageGb >= 50;
      case 3:
        return !!instanceName;
      default:
        return false;
    }
  };

  const handleLaunch = () => {
    if (!selectedPlan || !selectedTemplate || !instanceName) return;

    createInstance.mutate(
      {
        name: instanceName,
        planId: selectedPlan.id,
        templateSlug: selectedTemplate.slug,
        storageGb: config.storageGb,
        sshKeyId: config.sshKeyId || undefined,
        autoShutdownMin: config.autoShutdownMin,
        region: config.region,
        gpuCount: 1,
      },
      {
        onSuccess: (data) => {
          toast.success("Instance provisioning started!");
          const id = (data as Record<string, string>).id;
          router.push(`/dashboard/instances/${id}`);
        },
      }
    );
  };

  if (plansLoading || templatesLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white">New Instance</h1>

      <div className="mt-6">
        <StepIndicator
          steps={STEPS}
          currentStep={step}
          onStepClick={(s) => s < step && setStep(s)}
        />
      </div>

      <div className="mt-8">
        {step === 0 && plans && (
          <GPUStep
            plans={plans}
            selected={selectedPlanId}
            onSelect={setSelectedPlanId}
          />
        )}
        {step === 1 && templates && (
          <TemplateStep
            templates={templates}
            selected={selectedTemplateSlug}
            onSelect={setSelectedTemplateSlug}
            selectedPlan={selectedPlan}
          />
        )}
        {step === 2 && (
          <ConfigStep
            config={config}
            setConfig={setConfig}
            sshKeys={sshKeys}
          />
        )}
        {step === 3 && selectedPlan && selectedTemplate && (
          <>
            {/* Instance name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-300">
                Instance Name
              </label>
              <input
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                className="mt-1 block w-full max-w-md rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus-ring"
                placeholder="my-gpu-instance"
              />
              <p className="mt-1 text-xs text-surface-500">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>
            <ReviewStep
              plan={selectedPlan}
              template={selectedTemplate}
              config={config}
              creditsBalance={user?.creditsBalance ?? 0}
            />
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-surface-800 pt-6">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="rounded-lg border border-surface-700 bg-surface-800 px-5 py-2.5 text-sm font-medium text-surface-300 hover:bg-surface-700 disabled:invisible"
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={createInstance.isPending || !instanceName}
            className="flex items-center gap-2 rounded-lg bg-accent-green px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-green/90 disabled:opacity-50"
          >
            {createInstance.isPending && <Spinner className="h-4 w-4" />}
            {createInstance.isPending ? "Launching..." : "Launch Instance"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function NewInstancePage() {
  return (
    <Suspense>
      <CreateInstanceWizard />
    </Suspense>
  );
}
