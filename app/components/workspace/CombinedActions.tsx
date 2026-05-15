"use client";
import { useState, useEffect } from "react";
import { Save, Check, ChevronDown } from "lucide-react";
import type { QAGroup, CopyFormat } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { formatAll } from "@/lib/copy-formatters";
import { cn } from "@/lib/cn";

interface Props {
  groups: QAGroup[];
  onSave: () => void;
  saved?: boolean;
  saving?: boolean;
}

const FORMATS: { id: CopyFormat; label: string }[] = [
  { id: "plain", label: "Plain text" },
  { id: "markdown", label: "Markdown" },
  { id: "numbered", label: "Numbered" },
];

export function CombinedActions({ groups, onSave, saved, saving }: Props) {
  const [format, setFormat] = useState<CopyFormat>("plain");
  const [open, setOpen] = useState(false);

  const totalSelected = groups.reduce((s, g) => s + g.selectedIds.length, 0);
  const formatted = formatAll(groups, format);

  // Cmd+Shift+C → copy combined
  useEffect(() => {
    function h(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        navigator.clipboard?.writeText(formatted);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    }
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [formatted, onSave]);

  return (
    <div className="sticky bottom-0 sm:bottom-4 z-10 mx-[-1px]">
      <div className="rounded-none sm:rounded-xl border-t sm:border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur px-4 sm:px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mr-auto">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{totalSelected}</span>{" "}
            selected
            <span className="hidden sm:inline">
              {" · "}
              <span className="text-zinc-500 dark:text-zinc-500">{groups.length} group{groups.length === 1 ? "" : "s"}</span>
            </span>
          </div>

          {/* Format selector */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              {FORMATS.find((f) => f.id === format)?.label}
              <ChevronDown size={12} />
            </button>
            {open && (
              <div className="absolute right-0 bottom-10 z-20 w-40 rounded-md border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900 fade-in">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onMouseDown={() => setFormat(f.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 first:rounded-t-md last:rounded-b-md flex items-center justify-between",
                      format === f.id && "text-zinc-900 dark:text-zinc-100 font-medium"
                    )}
                  >
                    {f.label}
                    {format === f.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CopyButton text={formatted} label="Copy final" variant="button" />

          <Button variant="primary" size="md" onClick={onSave} disabled={saving}>
            {saved ? <Check size={14} className="check-pop" /> : <Save size={14} />}
            <span>{saving ? "Saving…" : saved ? "Saved" : "Save"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
