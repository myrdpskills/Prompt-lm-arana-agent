export interface AnswerOption {
  id: string;
  text: string;
  isCustom?: boolean;
}

export interface QAGroup {
  id: string;
  question: string;
  answers: AnswerOption[];
  selectedIds: string[];
  customNote: string;
  collapsed?: boolean;
}

export interface Generation {
  id: string;
  device_id: string;
  title: string;
  raw_input: string;
  groups: QAGroup[];
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParseResult {
  groups: QAGroup[];
  confidence: "high" | "medium" | "low";
  method: "deterministic" | "ai";
}

export type CopyFormat = "plain" | "markdown" | "numbered";
