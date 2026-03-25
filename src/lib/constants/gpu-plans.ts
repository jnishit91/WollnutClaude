// src/lib/constants/gpu-plans.ts
// Static GPU metadata for frontend display components

export const GPU_BADGES: Record<
  string,
  { label: string; gradient: string; tier: "flagship" | "high" | "mid" }
> = {
  B200: {
    label: "NVIDIA B200",
    gradient: "from-emerald-500 to-teal-600",
    tier: "flagship",
  },
  H200: {
    label: "NVIDIA H200",
    gradient: "from-violet-500 to-purple-600",
    tier: "flagship",
  },
  H100: {
    label: "NVIDIA H100",
    gradient: "from-blue-500 to-indigo-600",
    tier: "high",
  },
  A100: {
    label: "NVIDIA A100",
    gradient: "from-cyan-500 to-blue-600",
    tier: "high",
  },
  L40S: {
    label: "NVIDIA L40S",
    gradient: "from-amber-500 to-orange-600",
    tier: "mid",
  },
};

export const GPU_USE_CASES: Record<string, string[]> = {
  B200: [
    "Frontier model training",
    "Multi-trillion parameter models",
    "Massive-scale inference",
  ],
  H200: [
    "Large LLM training & fine-tuning",
    "High-throughput inference",
    "Multi-modal model training",
  ],
  H100: [
    "LLM fine-tuning (LoRA/QLoRA)",
    "Model inference at scale",
    "Distributed training",
  ],
  A100: [
    "General ML training",
    "Medium-scale inference",
    "Research & experimentation",
  ],
};

/** Regions available on E2E Networks */
export const E2E_REGIONS = [
  { slug: "Delhi", name: "Delhi NCR", flag: "🇮🇳", available: true },
] as const;

/** Model categories for filtering */
export const MODEL_CATEGORIES = [
  { value: "Text-to-Text", label: "Text Generation" },
  { value: "Image-Text-to-Text", label: "Multimodal" },
  { value: "Text-to-Image", label: "Image Generation" },
  { value: "Speech", label: "Speech & Audio" },
  { value: "Code", label: "Code Generation" },
] as const;

/** Template categories for filtering */
export const TEMPLATE_CATEGORIES = [
  { value: "General ML", label: "General ML" },
  { value: "LLM Training", label: "LLM Training" },
  { value: "LLM Inference", label: "LLM Inference" },
  { value: "Image Generation", label: "Image Generation" },
  { value: "Speech", label: "Speech & Audio" },
  { value: "Bare Metal", label: "Bare Metal" },
] as const;
