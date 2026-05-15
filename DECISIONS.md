# V1 Locked Decisions

Recorded from your answers. These are now the source of truth for the build.

---

## 1. AI Parsing Strategy
**Decision:** **Deterministic-first, no AI if possible. OpenRouter as fallback only if needed.**

> Your words: *"Open router if we able to create with no ai then no ai"*

### Implementation plan
- **Primary parser:** pure JavaScript/TypeScript heuristics — runs instantly in the browser, costs $0, works offline.
  - First non-empty line ending in `?` (or starting with question words: how, what, why, when, where, who, which, can, do, does, is, are, will, should) → **question**
  - All subsequent non-empty lines → **answer candidates**
  - Strip noise tokens: `Msgs`, `Messages`, `Options`, `Answers`, `Replies`, `---`, `===`, bullets (`-`, `*`, `•`), numbering (`1.`, `2)`)
  - Auto-detect multiple Q&A groups by scanning for additional `?`-terminated lines
- **AI fallback (only if deterministic confidence is low):** OpenRouter API
  - Triggered when: no `?` found, or only 1 line total, or parser flags ambiguity
  - User can also manually click "Re-parse with AI" if the result looks wrong
  - This keeps the app **free for 95% of inputs** and **smart for the rest**

### Why this is the right call
- Your example (`How are you? / Msgs / Hssjj / Shajj / Ahh`) parses perfectly with deterministic rules — zero AI needed
- Avoids API costs, API keys, latency, and rate limits for the common path
- AI becomes a graceful enhancement, not a dependency

---

## 2. Authentication
**Decision:** **No login / no signup. Supabase used purely for data persistence.**

> Your words: *"Supabase for data saving no login signup"*

### Implementation plan
- **No Supabase Auth.** No email, no password, no OAuth, no magic link.
- **Anonymous user identification:** generate a UUID on first visit, store in `localStorage` as `device_id`.
- **Supabase RLS policy:** allow read/write where `device_id = X-Device-Id header`.
  - The `device_id` is sent on every request via header
  - This means: each browser/device has its own private history, automatically
  - No account = no recovery if localStorage is cleared (acceptable trade-off for v1)
- **Optional v2:** add a "Sync across devices" button later that links a device_id to an email — additive, non-breaking.

### Schema impact
```sql
generations (
  id uuid pk,
  device_id text not null,        -- replaces user_id
  raw_input text,
  parsed_question text,
  parsed_answers jsonb,
  selected_option_ids text[],
  custom_text text,
  is_favorite bool default false,
  is_archived bool default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: each device sees only its own rows
create policy "device_isolation" on generations
  for all using (device_id = current_setting('request.headers')::json->>'x-device-id');
```

---

## 3. Scope: Single vs Multiple Q&A per Paste
**Decision:** **Auto-detect either.**

### Implementation plan
- Parser counts `?`-terminated lines in the input
- **1 question detected** → render single Q&A workspace
- **2+ questions detected** → render multiple sections, each with its own question + answer blocks + selections + custom text
- Each section is independently:
  - Collapsible
  - Selectable
  - Copyable
  - Editable
- Saved as **one generation record** with `parsed_question` becoming `parsed_questions: jsonb[]` of `{question, answers}` objects.

### Schema adjustment
```sql
-- replace single columns with structured array
parsed_groups jsonb  -- [{question: "...", answers: ["...", "..."]}, ...]
selections jsonb     -- {[groupIndex]: {selectedIds: [...], customText: "..."}}
```

---

## 4. Primary Copy Action
**Decision:** **Both — per-block copy AND combined copy.**

### Implementation plan
- **Per-block:** every answer block has a hover-revealed `[Copy]` icon → instant clipboard write → inline ✓ feedback for ~1 s (per copy_focused_interaction research)
- **Per-question:** copy button on the question header
- **Combined "Copy final"** sticky action at bottom:
  - Concatenates: question + all selected answers + custom text
  - Configurable format toggle: **Plain text** | **Markdown** | **Numbered list**
  - Single click → full output to clipboard → ✓ confirmation
- **Keyboard shortcut:** `Cmd/Ctrl + Shift + C` for combined copy

---

## 5. Surface Priority
**Decision:** **Truly responsive — equal priority on desktop and mobile.**

### Implementation plan
Three breakpoints, three distinct layouts (per the `mobile_ux_ai_productivity_platforms` research — workflow compression, not desktop reduction):

| Breakpoint | Layout |
|---|---|
| **≥1280 px (desktop)** | 3-column: `History sidebar (260 px)` \| `Main workspace (fluid, max 880 px)` \| `Right rail: copy/save/format (collapsible 280 px)` |
| **768–1279 px (tablet)** | 2-column: `Collapsible history sidebar` \| `Main workspace (fluid)` — copy/save inline at bottom of workspace |
| **<768 px (mobile)** | Single column + bottom navigation (`Home / History / Settings`) + sticky bottom action bar (`Generate` / `Copy final` / `Save`) |

### Mobile-specific rules (per research)
- All touch targets ≥44 px
- Sticky action bar always above keyboard
- Safe-area padding (notch + home indicator)
- Swipe gestures: swipe-left on history item → archive; swipe-right → favorite
- Pull-to-refresh on history
- Inline copy ✓ feedback (no toasts on mobile — they get dismissed by the keyboard)

### Desktop-specific enhancements
- Hover-reveal copy buttons (still keyboard-accessible)
- `Cmd+K` quick-open (history search) — small command palette, scoped to v1
- `Cmd+Enter` = Generate, `Cmd+S` = Save, `Cmd+Shift+C` = Copy final

---

## Final V1 Feature List (locked)

### Must-have
- [x] Single textarea input with auto-grow
- [x] Generate button (deterministic parser, AI fallback off by default)
- [x] Auto-detect 1 or many Q&A groups
- [x] Render each group as: question header + selectable answer blocks + add-custom + custom note
- [x] Per-block copy + per-question copy + combined copy (3 formats)
- [x] Inline edit of any block (click to edit, blur to save)
- [x] Add new custom answer block
- [x] Delete individual answer block
- [x] Autosave to Supabase (debounced 800 ms)
- [x] History sidebar with search, favorite, archive, delete
- [x] Truly responsive: desktop / tablet / mobile distinct layouts
- [x] Anonymous device_id persistence (no auth)
- [x] Dark mode + light mode (system-aware)

### Out of scope for v1 (deferred to v2+)
- User accounts / sync across devices
- Version history / rollback
- Workspaces / collaboration
- Slash commands
- Multi-format export beyond clipboard (PDF, file download)
- AI re-parse refinement (button shown but disabled with "Coming soon" tooltip)
- Templates library
- Tags / categories

---

## Stack (final)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| State (UI) | Zustand |
| State (server) | TanStack Query (React Query) |
| Database | Supabase (Postgres + RLS) |
| AI fallback | OpenRouter (only if user opts in / parser fails) |
| Hosting | Vercel |
| Icons | Lucide |
| Fonts | Inter (UI) + JetBrains Mono (raw input preview) |

---

**Status:** Decisions locked. Ready to scaffold the project on your green light.
