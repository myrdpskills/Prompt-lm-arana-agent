import type { QAGroup, CopyFormat } from "@/types";

export function formatGroup(group: QAGroup, format: CopyFormat): string {
  const selected = group.answers.filter((a) => group.selectedIds.includes(a.id));
  const parts: string[] = [];

  if (format === "markdown") {
    parts.push(`## ${group.question}`);
    if (selected.length) {
      parts.push("");
      selected.forEach((a) => parts.push(`- ${a.text}`));
    }
    if (group.customNote.trim()) {
      parts.push("");
      parts.push(group.customNote.trim());
    }
  } else if (format === "numbered") {
    parts.push(group.question);
    if (selected.length) {
      parts.push("");
      selected.forEach((a, i) => parts.push(`${i + 1}. ${a.text}`));
    }
    if (group.customNote.trim()) {
      parts.push("");
      parts.push(group.customNote.trim());
    }
  } else {
    // plain
    parts.push(group.question);
    if (selected.length) {
      parts.push("");
      selected.forEach((a) => parts.push(a.text));
    }
    if (group.customNote.trim()) {
      parts.push("");
      parts.push(group.customNote.trim());
    }
  }

  return parts.join("\n");
}

export function formatAll(groups: QAGroup[], format: CopyFormat): string {
  return groups.map((g) => formatGroup(g, format)).join("\n\n---\n\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
