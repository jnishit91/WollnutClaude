"use client";

import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs text-surface-400 transition-colors hover:text-white ${className}`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
