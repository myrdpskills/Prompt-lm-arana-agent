"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, History as HistoryIcon } from "lucide-react";
import type { Generation, QAGroup } from "@/types";
import { parseInput } from "@/lib/parser";
import { newGenerationFromGroups, saveGeneration } from "@/lib/storage";
import { InputArea } from "@/components/question-ui/InputArea";
import { QuestionGroup } from "@/components/question-ui/QuestionGroup";
import { CombinedActions } from "@/components/workspace/CombinedActions";
import { EmptyState } from "@/components/workspace/EmptyState";
import { HistorySidebar } from "@/components/history/HistorySidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { IconButton } from "@/components/ui/IconButton";

export default function Page() {
  const [raw, setRaw] = useState("");
  const [groups, setGroups] = useState<QAGroup[]>([]);
  const [busy, setBusy] = useState(false);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = useCallback(() => {
    if (!raw.trim()) return;
    setBusy(true);
    // Brief delay for perceived responsiveness skeleton
    setTimeout(() => {
      const result = parseInput(raw);
      setGroups(result.groups);
      setGeneration(null); // new generation, not yet saved
      setSaved(false);
      setBusy(false);
    }, 180);
  }, [raw]);

  function updateGroup(idx: number, next: QAGroup) {
    setGroups((s) => s.map((g, i) => (i === idx ? next : g)));
    setSaved(false);
    triggerAutosave();
  }

  function triggerAutosave() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave(true);
    }, 1200);
  }

  async function handleSave(silent = false) {
    if (groups.length === 0) return;
    setSaving(true);
    const base = generation
      ? { ...generation, groups, raw_input: raw }
      : newGenerationFromGroups(raw, groups);
    base.title = groups[0]?.question?.slice(0, 80) || "Untitled";
    const saved = await saveGeneration(base);
    setGeneration(saved);
    setSaving(false);
    setSaved(true);
    setRefreshKey((k) => k + 1);
    if (!silent) setTimeout(() => setSaved(false), 1500);
  }

  function handlePick(g: Generation) {
    setRaw(g.raw_input);
    setGroups(g.groups);
    setGeneration(g);
    setSaved(true);
    setMobileSidebar(false);
  }

  function handleNew() {
    setRaw("");
    setGroups([]);
    setGeneration(null);
    setSaved(false);
    setMobileSidebar(false);
  }

  // Close mobile sidebar on Escape
  useEffect(() => {
    function h(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileSidebar(false);
    }
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Sidebar — desktop */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <HistorySidebar
          currentId={generation?.id ?? null}
          onPick={handlePick}
          onNew={handleNew}
          refreshKey={refreshKey}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[80vw] h-full">
            <HistorySidebar
              currentId={generation?.id ?? null}
              onPick={handlePick}
              onNew={handleNew}
              refreshKey={refreshKey}
              onClose={() => setMobileSidebar(false)}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileSidebar(false)}
          />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-2 px-4 sm:px-6 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur flex-shrink-0">
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Open history"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 text-xs font-bold">S</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Structurly</span>
            <span className="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-500 ml-1">
              · AI content structurer
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setMobileSidebar(true)}
              className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="History"
            >
              <HistoryIcon size={16} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5">
            <InputArea
              value={raw}
              onChange={setRaw}
              onGenerate={handleGenerate}
              busy={busy}
              hasResult={groups.length > 0}
            />

            {busy ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="space-y-4">
                  {groups.map((g, i) => (
                    <QuestionGroup
                      key={g.id}
                      group={g}
                      index={i}
                      total={groups.length}
                      onChange={(next) => updateGroup(i, next)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sticky combined actions — only when there's content */}
          {groups.length > 0 && !busy && (
            <div className="max-w-3xl mx-auto px-0 sm:px-6 pb-0 sm:pb-6">
              <CombinedActions
                groups={groups}
                onSave={() => handleSave(false)}
                saved={saved}
                saving={saving}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
