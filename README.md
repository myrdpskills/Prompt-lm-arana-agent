# Structurly — AI Content Structurer

> Paste messy AI question-and-answer content. Get a clean, structured, interactive workspace where you can select options, add custom text, copy, and save.

**No login. No signup. Your data is yours.**
Anonymous device-id stored in localStorage. Optional Supabase persistence.

---

## 🚀 Quick start

### Option A — Try it instantly (no install)
Open [`demo.html`](./demo.html) in any browser. Fully working app, zero dependencies.

### Option B — Run the production Next.js app
```bash
cd app
npm install
npm run dev
```
Open http://localhost:3000.

It works **immediately** with zero configuration — generations are saved to localStorage. To enable Supabase persistence, see [`app/README.md`](./app/README.md).

---

## 📁 Repo structure

```
.
├── README.md                  ← you are here
├── ANALYSIS.md                ← full analysis of the UI/UX skill + research repo
├── DECISIONS.md               ← v1 decisions locked
├── demo.html                  ← self-contained working demo (open in browser)
├── app/                       ← production Next.js + TypeScript + Tailwind app
│   ├── app/                   ← Next.js App Router pages + API routes
│   ├── components/            ← React components
│   │   ├── question-ui/       ← heart of the app
│   │   ├── workspace/
│   │   ├── history/
│   │   └── ui/
│   ├── lib/                   ← parser, formatters, storage, supabase
│   ├── supabase/schema.sql    ← Postgres + RLS schema
│   ├── styles/globals.css
│   └── README.md              ← detailed app docs
└── (research and skill files used during planning)
```

---

## ✨ What it does

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

## 🛠 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + custom design tokens |
| Database | Supabase (Postgres + RLS) — *optional, falls back to localStorage* |
| AI fallback | OpenRouter — *optional, off by default* |
| Icons | Lucide |
| Fonts | Inter + JetBrains Mono |
| Hosting | Vercel-ready |

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘/Ctrl + Enter` | Generate |
| `⌘/Ctrl + S` | Save |
| `⌘/Ctrl + Shift + C` | Copy final |
| `Escape` | Cancel inline edit / close modal |
| Double-click on text | Edit inline |

---

## 📄 License

MIT
