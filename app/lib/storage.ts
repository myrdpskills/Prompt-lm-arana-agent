/**
 * Hybrid storage layer:
 * - If Supabase env vars are present, persist to Supabase (cross-tab, durable).
 * - Otherwise, fall back to localStorage (works fully offline / for demos).
 *
 * Same interface either way.
 */

import { supabase, supabaseEnabled } from "./supabase";
import { getDeviceId } from "./device-id";
import type { Generation, QAGroup } from "@/types";

const LS_KEY = "ai-content-structurer-generations";

function readLS(): Generation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Generation[]) : [];
  } catch {
    return [];
  }
}

function writeLS(items: Generation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export async function listGenerations(): Promise<Generation[]> {
  if (supabaseEnabled && supabase) {
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("device_id", deviceId)
      .eq("is_archived", false)
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn("Supabase list failed, falling back to LS:", error.message);
      return readLS();
    }
    return (data || []) as Generation[];
  }
  return readLS().filter((g) => !g.is_archived);
}

export async function saveGeneration(gen: Generation): Promise<Generation> {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("generations")
      .upsert({ ...gen, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) {
      console.warn("Supabase save failed, falling back to LS:", error.message);
    } else if (data) {
      return data as Generation;
    }
  }
  // LS fallback
  const all = readLS();
  const idx = all.findIndex((g) => g.id === gen.id);
  const updated = { ...gen, updated_at: new Date().toISOString() };
  if (idx >= 0) all[idx] = updated;
  else all.unshift(updated);
  writeLS(all);
  return updated;
}

export async function deleteGeneration(id: string): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (!error) return;
    console.warn("Supabase delete failed, falling back to LS");
  }
  writeLS(readLS().filter((g) => g.id !== id));
}

export async function toggleFavorite(id: string, value: boolean): Promise<void> {
  if (supabaseEnabled && supabase) {
    const { error } = await supabase
      .from("generations")
      .update({ is_favorite: value, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) return;
  }
  const all = readLS();
  const item = all.find((g) => g.id === id);
  if (item) {
    item.is_favorite = value;
    item.updated_at = new Date().toISOString();
    writeLS(all);
  }
}

export function newGenerationFromGroups(rawInput: string, groups: QAGroup[]): Generation {
  const firstQ = groups[0]?.question || "Untitled";
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    device_id: getDeviceId(),
    title: firstQ.length > 80 ? firstQ.slice(0, 77) + "…" : firstQ,
    raw_input: rawInput,
    groups,
    is_favorite: false,
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
