"use client";
import { useEffect, useRef, useState } from "react";
import { Check, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import type { AnswerOption } from "@/types";
import { cn } from "@/lib/cn";
import { CopyButton } from "@/components/ui/CopyButton";

interface Props {
  option: AnswerOption;
  selected: boolean;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}

/**
 * Selectable, editable answer block.
 * - Click anywhere on the row → toggle selection
 * - Click pencil OR double-click text → edit inline
 * - Hover-reveal copy + menu
 */
export function AnswerOptionItem({ option, selected, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(option.text);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    if (draft.trim() !== option.text) {
      onEdit(draft.trim() || option.text);
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors duration-150 cursor-pointer",
        selected
          ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
      )}
      onClick={() => !editing && onToggle()}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "mt-0.5 flex-shrink-0 h-5 w-5 rounded-md border flex items-center justify-center transition-all duration-150",
          selected
            ? "bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white"
            : "bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700"
        )}
      >
        {selected && (
          <Check
            size={13}
            strokeWidth={3}
            className="text-white dark:text-zinc-900 check-pop"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commit();
              } else if (e.key === "Escape") {
                setDraft(option.text);
                setEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            className="w-full resize-none bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none autosize-textarea"
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed break-words whitespace-pre-wrap"
          >
            {option.text}
            {option.isCustom && (
              <span className="ml-2 inline-flex items-center text-2xs px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 align-middle">
                custom
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions — hover reveal on desktop, always visible on mobile */}
      <div
        className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <CopyButton text={option.text} label="Copy answer" />
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit"
          title="Edit"
          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
        >
          <Pencil size={13} />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            aria-label="More"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-36 rounded-md border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900 fade-in">
              <button
                onMouseDown={onDelete}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-md"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
