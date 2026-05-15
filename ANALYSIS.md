# Project Analysis — AI Content Structuring Workspace

**Status:** Skill installed ✅ · Research analyzed ✅ · No code, no website written (per your instruction)
**Date:** Pre-build analysis phase

---

## 1. What I Installed (UI/UX Pro Max Skill)

The full skill from `nextlevelbuilder/ui-ux-pro-max-skill` is installed in the workspace.

### Locations
- `/.claude/skills/` → all 7 skill modules (the active runtime)
- `/.claude-plugin/` → marketplace + plugin manifests
- `/src/ui-ux-pro-max/` → the data tables and Python scripts the skill resolves via symlink
- `/skill-cli/` → CLI source
- `/skill-docs/` → official documentation
- `/SKILL_README.md` → upstream README

### Skill modules installed
| Module | What it gives us |
|---|---|
| `ui-ux-pro-max` (top) | Master 44 KB SKILL.md — 161 product types, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, 10 stacks |
| `design-system` | Token architecture (primitive → semantic → component), Tailwind integration, validators |
| `design` | Logo / icon / CIP / slides design intelligence |
| `brand` | Brand guidelines, voice, visual identity, asset organization |
| `ui-styling` | Canvas-fonts library + UI styling references |
| `slides` | Slide layout / copywriting / strategies |
| `banner-design` | Banner sizes & styles |

### Key data tables now available locally (6,461 rows total)
- `products.csv` — 161 product archetypes with reasoning rules
- `colors.csv` — 161 vetted palettes
- `google-fonts.csv` — 1,924 font pairings
- `styles.csv` — 50+ visual styles (minimalism, bento, glass, brutalist, etc.)
- `ux-guidelines.csv` — 99 UX rules across 10 priority categories
- `ui-reasoning.csv` — automated style→product matching logic
- `app-interface.csv`, `landing.csv`, `icons.csv`, `charts.csv`, `react-performance.csv`, `typography.csv`
- `stacks/` — per-stack overrides for React, Next.js, Vue, Svelte, SwiftUI, RN, Flutter, Tailwind, shadcn/ui, HTML/CSS

### Skill priority hierarchy (from the master SKILL.md)
1. Accessibility (CRITICAL) — contrast 4.5:1, focus rings, aria, keyboard nav
2. Touch & Interaction (CRITICAL) — 44×44 targets, 8px spacing, no hover-only
3. Performance (HIGH) — WebP/AVIF, lazy load, CLS < 0.1
4. Style Selection (HIGH) — match style to product type, no emoji icons
5. Layout & Responsive (HIGH) — mobile-first, no horizontal scroll
6. Typography & Color (MEDIUM) — base 16px, line-height 1.5, semantic tokens
7. Animation (MEDIUM) — 150–300ms, motion conveys meaning
8. Forms & Feedback (MEDIUM) — visible labels, inline errors, autosave
9. Navigation Patterns (HIGH) — bottom nav ≤5, deep linking
10. Charts & Data (LOW) — accessible colors, never color-alone

> The skill explicitly tells us **when not** to use it (pure backend, infra, non-visual scripts) — this matters: it's a design-decision engine, not a code generator.

---

## 2. What I Read (Your Research Repo — 11 PDFs)

All 11 PDFs from `withinpod-eng/Prompt-question-project` extracted and analyzed (`/analysis/research-text/`).

| Document | Pages | Core Thesis |
|---|---|---|
| `elite_ai_prompt_platform_architecture` | 18 | The product is **an AI-native thinking workspace**, not a chatbot |
| `backend_architecture_ai_prompt_platform` | 15 | Prompts are versioned documents, not notes — Supabase + Postgres + relational schema |
| `frontend_architecture_ai_prompt_platform` | 15 | Next.js App Router + Tailwind + shadcn/ui + Zustand + React Query + TipTap |
| `ideal_ux_flow_ai_prompt_platform` | 15 | Lifecycle: Capture → Enhance → Structure → Save → Retrieve → Reuse → Iterate → Export |
| `elite_design_systems_ai_productivity` | 14 | Linear + Vercel + Apple aesthetic — calm, dense, typography-led |
| `ai_content_rendering_readability_systems` | 13 | Hybrid rendering: Markdown + Structured Blocks + Interactive Components |
| `mobile_ux_ai_productivity_platforms` | 12 | Workflow compression, not desktop reduction; thumb ergonomics |
| `copy_focused_interaction_systems_ai_productivity` | 11 | Copy is a core workflow — multi-level, multi-format, instant inline feedback |
| `advanced_prompt_engineering_systems_regenerated` | 1 | Layered prompt architecture (role + modular + XML + variables) |
| `modern_dashboard_ux_research_regenerated` | 1 | Workspace > chatbot; command palette; keyboard-first |
| `modern_dashboard_ux_systems_regenerated` | 1 | Workspace-first architecture; progressive disclosure |

---

## 3. Your Brief — Restated in Plain Engineering Terms

**Input:** one big paste box.
**Trigger:** Generate button.
**Output:** the raw blob is parsed → question is detected → all answers/options/messages are detected → each renders as a **selectable, editable, copyable block** in a clean structured workspace.
**Persistence:** Supabase stores raw + structured + selections + custom text + timestamps; user can save / retrieve / edit / delete.

This is a very specific, narrow product. It is not a prompt manager. It is an **AI-output structurer + interactive selector + history**.

---

## 4. Where the Research Aligns Perfectly with Your Brief

| Your requirement | Research backing |
|---|---|
| Single big textbox + Generate button | Research warns *against* giant textareas for **editing** but *endorses* a large input area as the entry point (OpenAI pattern). Critical: after Generate, we move users **out** of the textarea into structured blocks. |
| Auto-detect question + answers | Maps directly to the "AI Analysis → Structured Conversion → Preview" pipeline in `ideal_ux_flow` |
| Selectable answer blocks | Maps to "Structured Response Blocks" in `ai_content_rendering` — TextBlock / PromptBlock pattern |
| Add custom text | Maps to "Editable Prompt Blocks" + "Variable System" |
| Copy buttons | Whole `copy_focused_interaction_systems` PDF is dedicated to this — multi-level copy, inline ✓ feedback, no toasts spam |
| Save / retrieve / edit / delete | Maps to backend schema: `prompts`, `prompt_versions`, `ai_generations`, `favorites`, `activity_logs` |
| Supabase | Recommended stack across both backend and elite architecture PDFs |
| Modern / minimal / Linear / Notion / Raycast feel | Direct match to `elite_design_systems` aesthetic recommendations |
| No neon, no overanimation | Explicitly listed as anti-patterns in the design research |

**Conclusion: your brief and the research are extremely well aligned.** No major contradictions.

---

## 5. Where Your Brief Is *Narrower* Than the Research

The research scopes a full prompt-management IDE (workspaces, teams, version history, collections, tags, slash commands, command palette, multi-stack export, AI orchestration). Your brief scopes a **focused single-user content-structuring tool**.

**Recommended approach:** build only what your brief asks for in v1, but borrow the *patterns* from the research. Specifically:

| Borrow now (v1) | Defer (v2+) |
|---|---|
| Modular structured blocks | Workspaces / teams |
| Inline copy with ✓ feedback | Version history with rollback |
| Autosave | Multi-format export (XML/JSON) |
| Sidebar with history list | Command palette (Cmd+K) |
| Empty-state with example paste | Collaborative editing |
| Linear/Vercel calm aesthetic | Slash commands, variables |
| Supabase row-level security | Realtime sync |
| Mobile single-column with bottom actions | Desktop 3-panel IDE |

---

## 6. Recommended Architecture (Synthesis)

This is **what I propose to build** — not built yet, awaiting your approval.

### Stack
- **Frontend:** Next.js 14+ App Router · TypeScript · Tailwind CSS · shadcn/ui
- **State:** Zustand (UI) + React Query (server) — per research
- **Backend:** Supabase (Postgres + Auth + RLS)
- **AI parsing:** OpenAI / Anthropic API via server actions (with a deterministic regex fallback for simple cases like your example)
- **Hosting:** Vercel

### Data model (Supabase, minimal v1)
```
profiles (id, email, created_at)
generations (
  id, user_id, title, raw_input,
  parsed_question, parsed_answers jsonb,
  selected_option_ids text[],
  custom_text text,
  is_favorite bool, is_archived bool,
  created_at, updated_at
)
generation_history (id, generation_id, snapshot jsonb, created_at)  -- for undo
```

### Layout (responsive, per research)
- **Desktop:** Sidebar (history) | Main workspace (input → output) | optional right rail (metadata/copy)
- **Tablet:** Collapsible sidebar | Main workspace
- **Mobile:** Bottom nav (Home / History / Settings) + single column + sticky action bar

### Core flow (your brief, structured per research)
```
Empty state w/ example
   ↓
Paste in textarea (autosizing, max-height with scroll)
   ↓
[Generate] (Cmd+Enter)
   ↓
Skeleton stream → parser detects question + N answers
   ↓
Render structured workspace:
   ┌────────────────────────────┐
   │ Question (editable, large) │
   ├────────────────────────────┤
   │ ☐ Answer 1   [Copy] [⋮]   │  ← selectable, editable inline
   │ ☐ Answer 2   [Copy] [⋮]   │
   │ ☐ Answer 3   [Copy] [⋮]   │
   ├────────────────────────────┤
   │ + Add custom option        │
   ├────────────────────────────┤
   │ Custom note (textarea)     │
   ├────────────────────────────┤
   │ [Copy selected] [Save]     │  ← sticky on mobile
   └────────────────────────────┘
   ↓
Autosave to Supabase
   ↓
Visible in sidebar history (Recent → grouped by day)
```

### Parsing logic (the heart of the app)
The example you gave is intentionally messy:
```
How are you?
Msgs
Hssjj
Shajj
Ahh
```
Strategy: **two-tier parser**.
1. **Deterministic first pass** (instant, free):
   - First non-empty line ending with `?` → question
   - All subsequent non-empty lines → candidate answers
   - Drop noise tokens like `Msgs`, `Options`, `Answers`, `---` (heuristic stopwords)
2. **AI fallback / refinement** (when deterministic fails or confidence is low):
   - Single OpenAI/Claude call with a strict JSON schema response
   - Returns `{question: string, answers: string[]}`

This keeps the app **fast and cheap** for the common case, **smart** for the edge cases.

### Visual design system (from skill + research)
- Font: Inter (UI), JetBrains Mono (raw input preview)
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48
- Radius: 8 (buttons/cards), 12 (modals)
- Color: 1 primary (subdued indigo or neutral) + 2 neutrals + semantic (success/warn/error)
- Dark mode: never `#000` — use `#0F0F10` / `#161618` / `#1C1C1F`
- Motion: 120–200 ms, transform-only (no width/height animation)
- Copy feedback: inline ✓ for 800–1200 ms (no toast)

---

## 7. Risks & Open Questions

Before I write a single line of code, here are the decisions that will shape v1 significantly. I'll surface the most important ones in a question prompt below.

1. **AI model:** OpenAI, Anthropic Claude, or local-only deterministic parser?
2. **Authentication:** required from day 1, or open/local-storage demo first then add auth?
3. **Multi-question support:** does one paste contain ONE question, or can it contain MULTIPLE Q&A blocks?
4. **Output use case:** are users selecting answers to **build a final reply** (concatenate selected + custom into one copyable string)? That changes the primary action.
5. **Mobile vs desktop priority:** which is the primary surface for v1?

---

## 8. What's Next

Per your instruction, I have **not** written any application code or website. The workspace currently contains only:
- The installed skill files (`.claude/`, `src/ui-ux-pro-max/`, `skill-cli/`, `skill-docs/`)
- The research repo clone (`analysis/research/`) and extracted text (`analysis/research-text/`)
- This `ANALYSIS.md`

When you're ready, I'll proceed in this order:
1. Answer the open questions in §7
2. Lock the v1 feature scope
3. Set up the Next.js + Supabase + Tailwind + shadcn/ui project
4. Build the parser (deterministic + AI fallback)
5. Build the structured workspace UI block-by-block
6. Wire Supabase save/retrieve/edit/delete
7. Polish per the skill's 99 UX guidelines and the research's design principles

Awaiting your green light and answers below.
