// src/lib/constants/blog-posts.ts
// Static blog post data

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  coverGradient: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-wollnut-labs",
    title: "Introducing Wollnut Labs: Enterprise GPU Cloud Made Simple",
    excerpt:
      "We built Wollnut Labs to make enterprise GPUs accessible to every ML team. Deploy H100s, H200s, and B200s in seconds with per-minute billing.",
    content: `
## Why We Built Wollnut Labs

The GPU cloud market has been dominated by providers that require long-term commitments, complex setup processes, and opaque pricing. We believe every ML team — from solo researchers to enterprise teams — deserves instant access to the best hardware without the friction.

## What Makes Us Different

**Per-Minute Billing**: No hourly minimums. Launch a GPU for 5 minutes of testing and pay only for those 5 minutes. Our billing engine tracks usage to the second and charges by the minute.

**One-Click Templates**: Pre-configured environments for PyTorch, TensorFlow, vLLM, ComfyUI, and more. Skip the hours of setup and start training immediately.

**Credit-Based Wallet**: Top up your balance via Stripe and deploy instantly. No invoices, no purchase orders, no waiting. If your credits run out, instances auto-stop — no surprise bills.

**Enterprise GPUs**: Access to NVIDIA B200, H200, and H100 GPUs with InfiniBand interconnect for distributed training. The same hardware powering frontier AI labs.

## Getting Started

1. Sign up and receive $5 in free credits
2. Choose a GPU plan and template
3. Launch your instance and SSH in
4. Start training, fine-tuning, or running inference

It's that simple. No sales calls, no procurement process, no waiting.

## What's Next

We're actively building features like WebSocket real-time updates, volume management, team accounts, and reserved instances. Follow our blog for updates.
    `.trim(),
    author: "Wollnut Labs Team",
    category: "Announcements",
    publishedAt: "2025-03-15",
    readingTime: "3 min",
    featured: true,
    coverGradient: "from-brand-600 to-brand-800",
  },
  {
    slug: "h100-vs-h200-vs-b200",
    title: "H100 vs H200 vs B200: Which GPU Should You Choose?",
    excerpt:
      "A practical guide to choosing the right NVIDIA GPU for your ML workload — from fine-tuning 7B models to training frontier architectures.",
    content: `
## The GPU Landscape in 2025

NVIDIA's datacenter GPU lineup has expanded significantly. Let's break down the three GPUs available on Wollnut Labs and when to use each.

## NVIDIA H100 (80GB SXM)

The H100 remains the workhorse of AI infrastructure. With 80GB of HBM3 memory and strong FP8 performance, it handles most ML workloads effectively.

**Best for:**
- Fine-tuning models up to 70B parameters (with LoRA/QLoRA)
- Running inference for most open-source models
- Distributed training when using 4x or 8x configurations
- Teams with moderate budgets who need reliable performance

**Pricing on Wollnut Labs:** $2.25/hr per GPU

## NVIDIA H200 (141GB SXM)

The H200 is the H100's successor with nearly double the memory (141GB HBM3e). This extra memory is transformational for large model work.

**Best for:**
- Fine-tuning 70B+ models with larger batch sizes
- Running inference on 70B models without quantization
- Multi-modal model training that requires large context
- Workloads bottlenecked by memory, not compute

**Pricing on Wollnut Labs:** $2.75/hr per GPU

## NVIDIA B200 (192GB HBM3e)

The B200 is NVIDIA's flagship Blackwell architecture GPU. With 192GB of memory and next-gen compute capabilities, it's built for frontier model work.

**Best for:**
- Training frontier models from scratch
- Running the largest open-source models at full precision
- Research pushing the boundaries of model scale
- Teams that need the absolute best hardware available

**Pricing on Wollnut Labs:** $5.90/hr per GPU

## Quick Decision Guide

| Workload | Recommended GPU |
|----------|----------------|
| Fine-tune 7B-13B model | H100 1x |
| Fine-tune 70B model (LoRA) | H100 2x or H200 1x |
| Run DeepSeek R1 inference | H100 8x or H200 4x |
| Train custom model from scratch | H200 8x or B200 |
| Image generation (SDXL/Flux) | H100 1x |
| Whisper transcription | H100 1x |

## The Bottom Line

Start with an H100 for most workloads. Move to H200 when you need more memory. Use B200 for frontier-scale work. With per-minute billing, you can experiment freely without commitment.
    `.trim(),
    author: "Wollnut Labs Team",
    category: "Guides",
    publishedAt: "2025-03-18",
    readingTime: "5 min",
    featured: true,
    coverGradient: "from-violet-600 to-purple-800",
  },
  {
    slug: "fine-tuning-llama-on-wollnut",
    title: "Fine-Tuning Llama 4 on Wollnut Labs: A Step-by-Step Guide",
    excerpt:
      "Learn how to fine-tune Meta's Llama 4 models using LoRA on Wollnut Labs GPU instances with our pre-configured PyTorch template.",
    content: `
## Prerequisites

- A Wollnut Labs account with at least $10 in credits
- Your training dataset in JSONL format
- Basic familiarity with Python and Hugging Face

## Step 1: Launch a GPU Instance

1. Go to Dashboard → New Instance
2. Select the **PyTorch 2.2 + CUDA 12.4** template
3. Choose **H100 1x** for 7B models or **H100 2x** for larger variants
4. Add your SSH key and click Deploy

Your instance will be ready in about 60 seconds.

## Step 2: Connect via SSH

\`\`\`bash
ssh -i ~/.ssh/your_key root@YOUR_INSTANCE_IP
\`\`\`

## Step 3: Install Fine-Tuning Dependencies

\`\`\`bash
pip install trl peft datasets bitsandbytes accelerate
\`\`\`

## Step 4: Upload Your Dataset

\`\`\`bash
scp -i ~/.ssh/your_key dataset.jsonl root@YOUR_IP:/workspace/
\`\`\`

## Step 5: Run Fine-Tuning

Create a training script:

\`\`\`python
from trl import SFTTrainer
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig
from datasets import load_dataset

model_name = "meta-llama/Llama-4-Scout-17B"
dataset = load_dataset("json", data_files="dataset.jsonl")

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
)

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset["train"],
    peft_config=lora_config,
    max_seq_length=2048,
    tokenizer=tokenizer,
)

trainer.train()
trainer.save_model("./llama-finetuned")
\`\`\`

## Step 6: Export Your Model

\`\`\`bash
scp -r -i ~/.ssh/your_key root@YOUR_IP:/workspace/llama-finetuned ./
\`\`\`

## Step 7: Stop Your Instance

Don't forget to stop your instance when training is complete! Billing stops immediately.

## Cost Estimate

Fine-tuning Llama 4 Scout 17B on a typical dataset (10k examples, 3 epochs) takes about 2-4 hours on an H100. At $2.25/hr, that's roughly **$4.50–$9.00** total.
    `.trim(),
    author: "Wollnut Labs Team",
    category: "Tutorials",
    publishedAt: "2025-03-20",
    readingTime: "7 min",
    featured: false,
    coverGradient: "from-emerald-600 to-teal-800",
  },
  {
    slug: "vllm-inference-guide",
    title: "Deploy a vLLM Inference Server in Under 5 Minutes",
    excerpt:
      "Set up a high-throughput LLM inference endpoint using vLLM on Wollnut Labs. Serve DeepSeek, Llama, or any Hugging Face model.",
    content: `
## Why vLLM?

vLLM is the fastest open-source LLM inference engine. It uses PagedAttention for efficient memory management and supports continuous batching for high throughput.

## Quick Deploy

1. Launch an instance with the **vLLM Inference Server** template
2. SSH into your instance
3. Start vLLM:

\`\`\`bash
python -m vllm.entrypoints.openai.api_server \\
  --model deepseek-ai/DeepSeek-R1-Distill-Qwen-7B \\
  --port 8000 \\
  --tensor-parallel-size 1
\`\`\`

4. Query your endpoint:

\`\`\`bash
curl http://YOUR_IP:8000/v1/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    "prompt": "Explain quantum computing in simple terms:",
    "max_tokens": 200
  }'
\`\`\`

## Scaling Up

For larger models like DeepSeek R1 (671B), use H100 8x or H200 4x with tensor parallelism:

\`\`\`bash
python -m vllm.entrypoints.openai.api_server \\
  --model deepseek-ai/DeepSeek-R1 \\
  --tensor-parallel-size 8 \\
  --port 8000
\`\`\`

## Performance Tips

- Use \`--quantization awq\` or \`--quantization gptq\` to reduce memory usage
- Set \`--max-model-len\` to limit context length and save memory
- Use \`--gpu-memory-utilization 0.95\` to maximize GPU memory usage
- Enable \`--enable-chunked-prefill\` for better long-context performance

## Cost

Running a 7B model inference server on H100 1x costs $2.25/hr. For production workloads serving thousands of requests, this is significantly cheaper than API-based alternatives.
    `.trim(),
    author: "Wollnut Labs Team",
    category: "Tutorials",
    publishedAt: "2025-03-22",
    readingTime: "4 min",
    featured: false,
    coverGradient: "from-amber-600 to-orange-800",
  },
  {
    slug: "per-minute-billing-explained",
    title: "Why Per-Minute Billing Changes Everything for GPU Cloud",
    excerpt:
      "Most GPU providers bill by the hour. We bill by the minute. Here's why that matters and how it saves you money.",
    content: `
## The Problem with Hourly Billing

Most GPU cloud providers bill by the hour with a one-hour minimum. This means:

- A 10-minute test run costs you a full hour
- Quick iterations during development waste credits
- You're incentivized to batch work rather than iterate fast

## Per-Minute Billing

At Wollnut Labs, we bill by the minute. Our background billing engine tracks each running instance and charges your credit balance every 60 seconds.

**Example:** You spin up an H100 to run a quick evaluation. It takes 12 minutes. You pay for 12 minutes ($0.45), not 1 hour ($2.25). That's an 80% savings on short tasks.

## How It Works

1. When you start an instance, our billing CRON begins tracking
2. Every minute, we calculate the cost and deduct from your balance
3. When you stop the instance, billing stops immediately
4. If your balance hits zero, instances auto-stop — no surprise charges

## Auto-Stop Protection

We've built multiple safety nets:

- **Low balance warnings** when credits drop below $2
- **Auto-stop** when credits reach zero
- **Auto-shutdown timers** — set a max runtime when creating instances
- **No debt** — we never charge more than your balance

## The Result

Our users report 40-60% cost savings compared to hourly-billed providers, especially during development and experimentation phases. The savings come from eliminating wasted minutes at the end of each session.

Start with $5 in free credits and see the difference.
    `.trim(),
    author: "Wollnut Labs Team",
    category: "Product",
    publishedAt: "2025-03-25",
    readingTime: "3 min",
    featured: true,
    coverGradient: "from-cyan-600 to-blue-800",
  },
];

export const BLOG_CATEGORIES = [
  "All",
  "Announcements",
  "Guides",
  "Tutorials",
  "Product",
] as const;
