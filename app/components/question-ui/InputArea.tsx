"use client";
import { useEffect, useRef } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  busy?: boolean;
  hasResult?: boolean;
}

const EXAMPLE = `How are you?

Msgs

Hssjj
Shajj
Ahh`;

export function InputArea({ value, onChange, onGenerate, busy, hasResult }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onGenerate();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onGenerate]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
          <Sparkles size={13} className="text-zinc-400" />
          <span>Paste your question and answers</span>
        </div>
        {!value && (
          <button
            onClick={() => onChange(EXAMPLE)}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 underline-offset-2 hover:underline"
          >
            Try example
          </button>
        )}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`How are you?\n\nMsgs\n\nHssjj\nShajj\nAhh`}
        className="w-full min-h-[180px] sm:min-h-[200px] max-h-[420px] resize-y bg-transparent px-4 sm:px-5 py-3 text-sm leading-relaxed font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
      />
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="text-xs text-zinc-500 dark:text-zinc-500 hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-2xs font-mono">⌘</kbd>{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-2xs font-mono">Enter</kbd>{" "}
          to generate
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onGenerate}
          disabled={busy || !value.trim()}
          className="ml-auto"
        >
          <Wand2 size={14} />
          {busy ? "Generating…" : hasResult ? "Re-generate" : "Generate"}
        </Button>
      </div>
    </div>
  );
}
