"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, Plus, HelpCircle } from "lucide-react";
import type { QAGroup } from "@/types";
import { AnswerOptionItem } from "./AnswerOptionItem";
import { CopyButton } from "@/components/ui/CopyButton";
import { newCustomAnswer } from "@/lib/parser";
import { formatGroup } from "@/lib/copy-formatters";
import { cn } from "@/lib/cn";

interface Props {
  group: QAGroup;
  index: number;
  total: number;
  onChange: (next: QAGroup) => void;
}

export function QuestionGroup({ group, index, total, onChange }: Props) {
  const [editingQ, setEditingQ] = useState(false);
  const [qDraft, setQDraft] = useState(group.question);
  const qRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingQ) {
      qRef.current?.focus();
      qRef.current?.select();
    }
  }, [editingQ]);

  useEffect(() => {
    setQDraft(group.question);
  }, [group.question]);

  function commitQ() {
    setEditingQ(false);
    if (qDraft.trim() && qDraft.trim() !== group.question) {
      onChange({ ...group, question: qDraft.trim() });
    } else {
      setQDraft(group.question);
    }
  }

  function toggleSelect(id: string) {
    const has = group.selectedIds.includes(id);
    onChange({
      ...group,
      selectedIds: has ? group.selectedIds.filter((x) => x !== id) : [...group.selectedIds, id],
    });
  }

  function editAnswer(id: string, text: string) {
    onChange({
      ...group,
      answers: group.answers.map((a) => (a.id === id ? { ...a, text } : a)),
    });
  }

  function deleteAnswer(id: string) {
    onChange({
      ...group,
      answers: group.answers.filter((a) => a.id !== id),
      selectedIds: group.selectedIds.filter((x) => x !== id),
    });
  }

  function addAnswer() {
    const a = newCustomAnswer("");
    onChange({ ...group, answers: [...group.answers, a] });
    // Focus the new one shortly after render
    setTimeout(() => {
      const all = document.querySelectorAll<HTMLElement>(`[data-group="${group.id}"] [contenteditable], [data-group="${group.id}"] textarea`);
      all[all.length - 1]?.focus();
    }, 50);
  }

  function setNote(v: string) {
    onChange({ ...group, customNote: v });
  }

  function toggleCollapse() {
    onChange({ ...group, collapsed: !group.collapsed });
  }

  const selectedCount = group.selectedIds.length;
  const formatted = formatGroup(group, "plain");

  return (
    <section
      data-group={group.id}
      className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden fade-in"
    >
      {/* Header — Question */}
      <header className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-900">
        {total > 1 && (
          <button
            onClick={toggleCollapse}
            aria-label={group.collapsed ? "Expand" : "Collapse"}
            className="mt-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            {group.collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
        <div className="mt-0.5 flex-shrink-0 h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
          <HelpCircle size={15} />
        </div>
        <div className="flex-1 min-w-0">
          {total > 1 && (
            <div className="text-2xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mb-1">
              Question {index + 1} of {total}
            </div>
          )}
          {editingQ ? (
            <textarea
              ref={qRef}
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              onBlur={commitQ}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitQ();
                } else if (e.key === "Escape") {
                  setQDraft(group.question);
                  setEditingQ(false);
                }
              }}
              rows={1}
              className="w-full resize-none bg-transparent text-lg font-semibold text-zinc-900 dark:text-zinc-100 outline-none autosize-textarea"
            />
          ) : (
            <h2
              onDoubleClick={() => setEditingQ(true)}
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words"
            >
              {group.question || (
                <span className="italic text-zinc-400">Untitled question</span>
              )}
            </h2>
          )}
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            {group.answers.length} option{group.answers.length === 1 ? "" : "s"}
            {selectedCount > 0 && (
              <>
                <span className="mx-1.5">·</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  {selectedCount} selected
                </span>
              </>
            )}
          </div>
        </div>
        <CopyButton text={formatted} label="Copy this group" variant="button" />
      </header>

      {/* Answers */}
      {!group.collapsed && (
        <div className="px-5 py-4 space-y-2">
          {group.answers.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-500 italic px-1 py-3">
              No options detected. Add one below.
            </div>
          ) : (
            group.answers.map((a) => (
              <AnswerOptionItem
                key={a.id}
                option={a}
                selected={group.selectedIds.includes(a.id)}
                onToggle={() => toggleSelect(a.id)}
                onEdit={(t) => editAnswer(a.id, t)}
                onDelete={() => deleteAnswer(a.id)}
              />
            ))
          )}

          <button
            onClick={addAnswer}
            className="w-full mt-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50/50 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:text-zinc-300 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <Plus size={15} /> Add option
          </button>

          {/* Custom note */}
          <div className="pt-3">
            <label className={cn(
              "block text-xs font-medium mb-1.5",
              group.customNote ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-500 dark:text-zinc-500"
            )}>
              Add your own text
            </label>
            <textarea
              value={group.customNote}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else you want to include with this question..."
              rows={2}
              className="w-full resize-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors autosize-textarea"
            />
          </div>
        </div>
      )}
    </section>
  );
}
