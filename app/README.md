# Structurly — AI Content Structurer

Paste messy AI question-and-answer content. Get a clean, structured, interactive workspace where you can select options, add custom text, copy, and save.

> **No login. No signup. Your data is yours.**
> Anonymous device-id stored in localStorage. Optional Supabase persistence.

---

## What it does

You paste this:
```
How are you?

Msgs

Hssjj
Shajj
Ahh
```

The app instantly turns it into a clean workspace:
- The **question** becomes a heading
- Each **answer** becomes a selectable, editable, copyable block
- You can **add custom options** and **add free-text notes**
- Per-block copy + per-question copy + **combined "Copy final"** in 3 formats (plain / markdown / numbered)
- Saved automatically to history (sidebar)

Multiple questions in one paste? Auto-detected — each gets its own group.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + custom design tokens |
| Database | Supabase (Postgres + RLS) — *optional, falls back to localStorage* |
| AI fallback | OpenRouter — *optional, off by default* |
| Icons | Lucide |
| Fonts | Inter + JetBrains Mono |
| Hosting | Vercel-ready |

**No state library needed for v1** — React state + localStorage are enough.

---

## Setup

```bash
cd app
npm install
cp .env.example .env.local   # optional, only needed for Supabase
npm run dev
```

Open http://localhost:3000.

It works **immediately** with zero configuration — generations are saved to localStorage.

### Enable Supabase persistence (optional)

1. Create a Supabase project at https://supabase.com
2. Run `supabase/schema.sql` in the SQL editor
3. Copy your Project URL + anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev`

### Enable AI fallback (optional)

Add to `.env.local`:
```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-4o-mini
```

The deterministic parser handles ~95% of inputs for free. AI is only called when explicitly requested.

---

## Architecture

```
app/
├── app/
│   ├── layout.tsx              # Root layout, theme bootstrap
│   ├── page.tsx                # Main workspace
│   └── api/parse/route.ts      # Optional AI fallback (OpenRouter)
├── components/
│   ├── question-ui/            # Heart of the app
│   │   ├── InputArea.tsx       # Big paste box + Generate button
│   │   ├── QuestionGroup.tsx   # Question + answer list + custom note
│   │   └── AnswerOptionItem.tsx # Selectable, editable answer block
│   ├── workspace/
│   │   ├── CombinedActions.tsx # Sticky bottom bar: format + copy + save
│   │   └── EmptyState.tsx
│   ├── history/
│   │   └── HistorySidebar.tsx  # Search, favorite, delete
│   └── ui/                     # Button, IconButton, CopyButton, ThemeToggle
├── lib/
│   ├── parser.ts               # Deterministic Q&A parser (no AI)
│   ├── copy-formatters.ts      # plain / markdown / numbered
│   ├── storage.ts              # Supabase or localStorage (auto)
│   ├── device-id.ts            # Anonymous UUID per browser
│   ├── supabase.ts
│   └── cn.ts
├── types/index.ts
├── styles/globals.css
└── supabase/schema.sql
```

### The parser

`lib/parser.ts` runs entirely in the browser. It:
1. Splits input into lines
2. Strips bullets, numbering, separators, noise tokens (`Msgs`, `Options`, `---`)
3. Finds question lines (end with `?` or start with question words)
4. Each question owns the lines until the next question
5. Falls back to "first line is the question" if none detected
6. Returns confidence score (`high` / `medium` / `low`)

For your example input, it parses **instantly with zero API calls**.

---

## Design principles applied

Per the research analysis (`/ANALYSIS.md` and `/DECISIONS.md` at repo root):

- **Typography is the primary hierarchy tool** — Inter for UI, JetBrains Mono for raw input
- **Calm dark mode** — never `#000`, uses `#0F0F10`/`#161618` per Linear/Vercel
- **150ms transitions** — restrained, never animates layout
- **Inline copy feedback** — icon morphs to ✓ for ~1.1s, no toast spam
- **Hover-reveal actions** on desktop, always-visible on mobile
- **Sticky action bar** above keyboard on mobile
- **44×44 minimum touch targets**, 8px+ spacing
- **Keyboard shortcuts**: `Cmd+Enter` (Generate), `Cmd+S` (Save), `Cmd+Shift+C` (Copy final)
- **Reduced-motion respected** via `prefers-reduced-motion`
- **Empty state with example** — never blank screens

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Enter` | Generate |
| `Cmd/Ctrl + S` | Save |
| `Cmd/Ctrl + Shift + C` | Copy final (combined output) |
| `Escape` | Cancel inline edit / close modal |
| `Enter` (in editing) | Commit edit |
| Double-click on question/answer | Edit inline |

---

## Roadmap (v2+)

- Sync across devices (link device_id to email)
- Version history per generation
- Slash commands (`/template`, `/variable`)
- Export to file (PDF / .md / .txt)
- Tags & collections
- Command palette (Cmd+K)
- Keyboard-only navigation (j/k between blocks)

---

## License

MIT
