"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowRight, Zap, Clock, Rocket } from "lucide-react";

const MODELS = [
  { id: "llama-3.1-8b", name: "Llama 3.1 8B" },
  { id: "mistral-7b", name: "Mistral 7B" },
  { id: "deepseek-r1-8b", name: "DeepSeek R1 8B" },
  { id: "qwen-2.5-7b", name: "Qwen 2.5 7B" },
];

const CANNED_RESPONSES = [
  "Large language models work by predicting the next token in a sequence. They're trained on massive datasets and learn statistical patterns in language, which allows them to generate coherent and contextually relevant text. On Wollnut's H100 GPUs, inference for a 7-8B model typically completes in under 200ms.",
  "Retrieval-Augmented Generation (RAG) combines a retrieval system with a generative model. First, relevant documents are fetched from a knowledge base using embeddings, then the LLM uses those documents as context to produce grounded, accurate answers. It's one of the most popular patterns we see deployed on Wollnut.",
  "Fine-tuning adapts a pre-trained model to a specific domain or task by training it further on a curated dataset. This is more cost-effective than training from scratch. With Wollnut, you can fine-tune models like Llama 3.1 on our H100 infrastructure and deploy them as dedicated API endpoints.",
  "Transformer architectures use self-attention mechanisms to weigh the importance of different parts of the input when generating each output token. The key innovation is that attention allows the model to look at the entire input context simultaneously rather than sequentially, enabling much better long-range dependency handling.",
  "Quantization reduces model precision (e.g., from FP16 to INT4) to decrease memory usage and speed up inference. While there's a small quality trade-off, modern quantization techniques like GPTQ and AWQ preserve most of the model's capability. This lets you run larger models on fewer GPUs — great for keeping costs low on Wollnut.",
  "Prompt engineering is the practice of designing inputs that guide LLMs toward desired outputs. Techniques include few-shot examples, chain-of-thought reasoning, and system prompts. Well-crafted prompts can dramatically improve output quality without any model changes or fine-tuning.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  latency?: number;
}

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]!.id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm running on Wollnut H100 GPUs in GIFT City, India. Ask me anything.",
    },
  ]);
  const [responseIndex, setResponseIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const latency = Math.floor(Math.random() * 120) + 80;
      const assistantMessage: Message = {
        role: "assistant",
        content: CANNED_RESPONSES[responseIndex % CANNED_RESPONSES.length]!,
        latency,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setResponseIndex((prev) => prev + 1);
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Playground</h1>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none transition-colors hover:border-white/20 focus:border-indigo-500"
            >
              {MODELS.map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  className="bg-gray-900 text-white"
                >
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/endpoints"
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Deploy as API <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-white/10 bg-white/[0.02]"
        >
          {/* Messages Container */}
          <div
            ref={scrollRef}
            className="min-h-[500px] max-h-[600px] overflow-y-auto p-6 space-y-4"
          >
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-600/20 border border-indigo-500/20"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      {message.role === "assistant" ? (
                        <Bot className="h-3.5 w-3.5 text-indigo-400" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        {message.role}
                      </span>
                      {message.latency && (
                        <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400">
                          <Clock className="h-3 w-3" />
                          {message.latency}ms
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      assistant
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (20 free messages/day)"
                disabled={loading}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 space-y-3 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400">
              Running on Wollnut H100 GPUs in GIFT City, India
            </span>
          </div>
          <p className="text-xs text-gray-500">
            This response cost ~₹0.02 to generate. Deploy your own at ₹15/1M
            tokens.
          </p>
          <p className="text-xs text-gray-600">
            20 messages/day for anonymous users.{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-400 underline underline-offset-2 transition-colors hover:text-indigo-300"
            >
              Sign up for unlimited.
            </Link>
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-12 rounded-xl border border-white/10 bg-white/5 p-8 text-center"
        >
          <Rocket className="mx-auto h-8 w-8 text-indigo-400" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Deploy This Model as Your Own API
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Get a dedicated endpoint with guaranteed availability, custom rate
            limits, and usage-based pricing.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/endpoints"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              <Rocket className="h-4 w-4" />
              Deploy Now
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Sign Up <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
