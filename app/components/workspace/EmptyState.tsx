"use client";
import { Sparkles, FileText, MousePointerClick, Copy } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 p-6 sm:p-10">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 mb-3">
          <Sparkles size={18} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Paste, then Generate
        </h3>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">
          Drop your messy AI question-and-answer content above. We'll detect the
          question and turn the rest into selectable, editable, copyable blocks.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
          <Step icon={<FileText size={14} />} title="1. Paste" sub="Any messy Q&A text" />
          <Step icon={<Sparkles size={14} />} title="2. Generate" sub="Auto-structured" />
          <Step icon={<Copy size={14} />} title="3. Pick & copy" sub="Build your reply" />
        </div>
      </div>
    </div>
  );
}

function Step({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3">
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="text-2xs text-zinc-500 mt-0.5 ml-6">{sub}</div>
    </div>
  );
}
