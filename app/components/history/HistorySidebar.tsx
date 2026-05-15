"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Trash2, FileText, Plus, X } from "lucide-react";
import type { Generation } from "@/types";
import { listGenerations, deleteGeneration, toggleFavorite } from "@/lib/storage";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";

interface Props {
  currentId: string | null;
  onPick: (g: Generation) => void;
  onNew: () => void;
  refreshKey: number;
  onClose?: () => void;
}

export function HistorySidebar({ currentId, onPick, onNew, refreshKey, onClose }: Props) {
  const [items, setItems] = useState<Generation[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listGenerations().then((data) => {
      if (alive) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [refreshKey]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const lower = q.toLowerCase();
    return items.filter(
      (g) =>
        g.title.toLowerCase().includes(lower) ||
        g.raw_input.toLowerCase().includes(lower)
    );
  }, [items, q]);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this generation?")) return;
    await deleteGeneration(id);
    setItems((s) => s.filter((g) => g.id !== id));
  }

  async function handleFav(e: React.MouseEvent, g: Generation) {
    e.stopPropagation();
    const next = !g.is_favorite;
    await toggleFavorite(g.id, next);
    setItems((s) => s.map((x) => (x.id === g.id ? { ...x, is_favorite: next } : x)));
  }

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      {/* Top */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        <button
          onClick={onNew}
          className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
        >
          <Plus size={14} /> New
        </button>
        {onClose && (
          <IconButton label="Close sidebar" onClick={onClose}>
            <X size={16} />
          </IconButton>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history..."
            className="w-full h-8 pl-7 pr-2.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-2 pb-1.5 text-2xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
        {q.trim() ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : "Recent"}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-3">
        {loading ? (
          <div className="px-4 py-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-900 rounded-md mb-1.5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mb-2">
              <FileText size={16} />
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              {q ? "No matches" : "No saved generations yet"}
            </div>
          </div>
        ) : (
          <ul className="px-2 space-y-0.5">
            {filtered.map((g) => {
              const active = g.id === currentId;
              return (
                <li key={g.id}>
                  <button
                    onClick={() => onPick(g)}
                    className={cn(
                      "group w-full text-left rounded-md px-2.5 py-2 transition-colors",
                      active
                        ? "bg-zinc-100 dark:bg-zinc-900"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-xs font-medium truncate",
                          active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"
                        )}>
                          {g.title}
                        </div>
                        <div className="text-2xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                          {timeAgo(g.updated_at)} · {g.groups.length} group{g.groups.length === 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity -mr-1">
                        <button
                          onClick={(e) => handleFav(e, g)}
                          aria-label="Favorite"
                          title="Favorite"
                          className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Star size={12} className={cn(g.is_favorite && "fill-amber-500 text-amber-500")} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, g.id)}
                          aria-label="Delete"
                          title="Delete"
                          className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {g.is_favorite && (
                        <Star size={11} className="text-amber-500 fill-amber-500 mt-1 group-hover:hidden" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}
