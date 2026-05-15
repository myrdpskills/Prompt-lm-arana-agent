/**
 * Deterministic Q&A parser — runs in the browser, costs $0.
 *
 * Strategy:
 *  1. Tokenize input into non-empty trimmed lines.
 *  2. Strip noise tokens (Msgs, Options, ---, bullets, numbering).
 *  3. Find question lines: end with "?" OR start with question words.
 *  4. Each question owns the lines that follow it until the next question.
 *  5. If no question is detected, treat the first line as a fallback question.
 */

import type { ParseResult, QAGroup, AnswerOption } from "@/types";

const NOISE_TOKENS = new Set([
  "msgs", "msg", "messages", "message",
  "options", "option", "choices", "choice",
  "answers", "answer", "replies", "reply",
  "responses", "response", "items",
  "---", "===", "***", "___",
]);

const QUESTION_STARTERS = [
  "how", "what", "why", "when", "where", "who", "which",
  "can", "could", "would", "should", "shall",
  "do", "does", "did", "is", "are", "was", "were",
  "will", "may", "might", "have", "has", "had",
];

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function stripBullet(line: string): string {
  // Remove leading bullets/numbering: "- ", "* ", "• ", "1.", "1)", "(1)"
  return line
    .replace(/^\s*[-*•▪◦]\s+/, "")
    .replace(/^\s*\(?\d+[.)]\s+/, "")
    .trim();
}

function isNoise(line: string): boolean {
  const lower = line.toLowerCase().trim().replace(/[:.]+$/, "");
  if (NOISE_TOKENS.has(lower)) return true;
  // Lines like "------" or "======"
  if (/^[-=_*]{3,}$/.test(line.trim())) return true;
  return false;
}

function isQuestion(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.endsWith("?")) return true;
  const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
  if (firstWord && QUESTION_STARTERS.includes(firstWord)) {
    // Only treat as question if it's a short-ish line (avoid paragraphs)
    return trimmed.length < 200;
  }
  return false;
}

export function parseInput(raw: string): ParseResult {
  if (!raw || !raw.trim()) {
    return { groups: [], confidence: "low", method: "deterministic" };
  }

  // Tokenize: split on newlines, also split on bullets within a line
  const rawLines = raw
    .split(/\r?\n/)
    .map((l) => stripBullet(l))
    .filter((l) => l.length > 0 && !isNoise(l));

  if (rawLines.length === 0) {
    return { groups: [], confidence: "low", method: "deterministic" };
  }

  // Find question indices
  const questionIndices: number[] = [];
  rawLines.forEach((line, i) => {
    if (isQuestion(line)) questionIndices.push(i);
  });

  const groups: QAGroup[] = [];

  if (questionIndices.length === 0) {
    // No question detected — use the first line as a question fallback
    const question = rawLines[0];
    const answers = rawLines.slice(1).map(toAnswer);
    groups.push({
      id: uid(),
      question,
      answers,
      selectedIds: [],
      customNote: "",
    });
    return { groups, confidence: "low", method: "deterministic" };
  }

  // Build groups: each question owns the lines until the next question
  for (let i = 0; i < questionIndices.length; i++) {
    const qIdx = questionIndices[i];
    const nextQIdx = questionIndices[i + 1] ?? rawLines.length;
    const question = rawLines[qIdx];
    const answerLines = rawLines.slice(qIdx + 1, nextQIdx);
    groups.push({
      id: uid(),
      question,
      answers: answerLines.map(toAnswer),
      selectedIds: [],
      customNote: "",
    });
  }

  // Confidence scoring
  const totalAnswers = groups.reduce((s, g) => s + g.answers.length, 0);
  let confidence: "high" | "medium" | "low" = "high";
  if (totalAnswers === 0) confidence = "low";
  else if (totalAnswers < 2) confidence = "medium";

  return { groups, confidence, method: "deterministic" };
}

function toAnswer(text: string): AnswerOption {
  return { id: uid(), text };
}

export function newCustomAnswer(text = ""): AnswerOption {
  return { id: uid(), text, isCustom: true };
}

export function newGroup(): QAGroup {
  return {
    id: uid(),
    question: "",
    answers: [],
    selectedIds: [],
    customNote: "",
  };
}
