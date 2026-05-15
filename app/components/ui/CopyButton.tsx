"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/copy-formatters";
import { cn } from "@/lib/cn";

interface Props {
  text: string;
  label?: string;
  variant?: "icon" | "button";
  className?: string;
}

/**
 * Inline-feedback copy button per research:
 *  - hover/focus reveal (parent decides visibility)
 *  - instant clipboard write
 *  - icon morphs to ✓ for ~1s
 *  - no toasts
 */
export function CopyButton({ text, label = "Copy", variant = "icon", className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handle(e: React.MouseEvent) {
    e.stopPropagation();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    }
  }

  if (variant === "button") {
    return (
      <button
        onClick={handle}
        aria-label={copied ? "Copied" : label}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md border transition-colors duration-150",
          copied
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900"
            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800",
          className
        )}
      >
        {copied ? <Check size={14} className="check-pop" /> : <Copy size={14} />}
        <span>{copied ? "Copied" : label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      aria-label={copied ? "Copied" : label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors duration-150",
        copied
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800",
        className
      )}
    >
      {copied ? <Check size={14} className="check-pop" /> : <Copy size={14} />}
    </button>
  );
}
