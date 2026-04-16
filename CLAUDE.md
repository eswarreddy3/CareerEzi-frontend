# Frontend — CLAUDE.md

## Architecture

```
frontend/
├── app/
│   ├── (auth)/           # Login + onboarding (no sidebar)
│   │   ├── layout.tsx    # Centered layout
│   │   ├── login/
│   │   └── onboarding/   # 3-step wizard (first_login only) — confetti on complete
│   ├── (dashboard)/      # All protected pages (sidebar layout)
│   │   ├── layout.tsx    # Wraps all pages with Sidebar
│   │   ├── dashboard/    # Student home — animated stat cards
│   │   ├── learn/        # Course library + [courseId] lesson viewer
│   │   ├── practice-mcq/ # MCQ practice — correct/wrong flash effects
│   │   ├── assignments/  # Assignment tracker
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Timed exam page
│   │   │       └── results/      # Score + confetti + question review
│   │   ├── coding/       # Monaco split-panel IDE
│   │   ├── lab/          # Free code playground
│   │   ├── company-prep/ # Company-wise resources
│   │   ├── domain-programs/ # Domain cards → course roadmap (API-driven)
│   │   ├── jobs/         # Job postings (student view — all colleges)
│   │   ├── feed/         # College social feed + post/[postId] detail
│   │   ├── leaderboard/  # Rankings with podium
│   │   ├── profile/      # Profile + settings tabs
│   │   ├── resume/       # Resume builder + PDF export
│   │   ├── admin/        # College admin dashboard, students, analytics
│   │   └── super-admin/  # Overview, colleges, students, courses, domains, aptitude, coding, jobs
│   ├── globals.css       # Design tokens + utility classes
│   ├── layout.tsx        # Root layout (fonts, Toaster)
│   └── page.tsx          # Auth-routing redirect (client component)
├── components/
│   ├── ui/               # shadcn components (do not edit)
│   ├── sidebar.tsx       # Role-aware nav, reads from authStore
│   ├── glass-card.tsx    # GlassCard wrapper
│   ├── top-bar.tsx       # Page title + user dropdown
│   ├── data-table.tsx    # Reusable table with search + pagination
│   ├── modal-form.tsx    # Dialog wrapper for forms
│   ├── points-burst.tsx  # Animated +N pts overlay (framer-motion)
│   ├── activity-feed.tsx, course-card.tsx, stats-card.tsx
│   ├── progress-ring.tsx, streak-calendar.tsx
│   └── theme-provider.tsx
├── store/
│   ├── authStore.ts      # Zustand: token, user, setAuth/clearAuth/updateUser
│   └── uiStore.ts        # Zustand: sidebarOpen
├── hooks/
│   ├── useAuth.ts        # isAuthenticated, role, hasRole(role)
│   ├── use-mobile.ts
│   └── use-toast.ts
├── content/
│   └── courses/          # Lesson content files keyed by course.id
│       └── {courseId}.ts # Record<lessonOrder, markdownString> — add content here when creating a course
├── lib/
│   ├── api.ts            # Axios + silent token refresh on 401
│   ├── effects.ts        # fireConfetti / fireSchoolPride / fireStars (canvas-confetti)
│   ├── levels.ts         # Level definitions (points thresholds, colors, names)
│   ├── quotes.ts         # Daily motivational quotes (streak-based)
│   ├── student-report.ts # PDF generation for student performance reports
│   └── utils.ts          # cn() helper
├── middleware.ts          # Edge middleware: protects routes via careerezi_token cookie
└── .env.local             # NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Routes & Access

| Path | Roles | Status |
|------|-------|--------|
| /login | public | ✅ |
| /onboarding | public (first_login) | ✅ |
| /dashboard | student | ✅ |
| /learn, /learn/[courseId] | student | ✅ |
| /practice-mcq | student | ✅ |
| /assignments, /assignments/[id], /assignments/[id]/results | student | ✅ |
| /coding | student | ✅ Monaco |
| /lab | student | ✅ Code Lab |
| /company-prep | student | ✅ |
| /domain-programs | student | ✅ API-driven |
| /jobs | student | ✅ Global job postings |
| /feed, /feed/post/[id] | student, college_admin | ✅ |
| /leaderboard | student | ✅ |
| /profile | student | ✅ |
| /resume | student | ✅ |
| /admin | college_admin | ✅ |
| /admin/students | college_admin | ✅ |
| /admin/analytics | college_admin | ✅ |
| /super-admin/* | super_admin | ✅ |
| /super-admin/courses | super_admin | ✅ Course management (CRUD: courses, levels, lessons) |
| /super-admin/domains | super_admin | ✅ Domain CRUD + course mapping with ordering |
| /super-admin/aptitude | super_admin | ✅ Aptitude MCQ upload (CSV bulk import) |
| /super-admin/coding | super_admin | ✅ Coding problems (CRUD + JSON bulk import) |
| /super-admin/jobs | super_admin | ✅ Job management |

## State Management

- `authStore` — persisted to localStorage (`"careerezi-auth"`). Writes `careerezi_token` cookie for middleware.
- `uiStore` — ephemeral sidebar state.

## Authentication Flow

1. `middleware.ts` checks `careerezi_token` cookie; redirects to `/login` if missing.
2. `app/page.tsx` redirects based on `user.role` and `user.first_login`.
3. First-login → `/onboarding` (3-step) → PATCH `/api/auth/complete-onboarding`.
4. Logout → `clearAuth()` → clears store + cookie → `/login`.
5. Token expiry → `api.ts` intercepts 401, calls `POST /api/auth/refresh`, retries silently.

### Token Lifetimes

| Token | Lifetime |
|-------|----------|
| Access token (JWT) | 1 day |
| Refresh token | 7 days |
| `careerezi_token` cookie | 7 days |

## Role-Based Sidebar Nav

| Role | Nav Items |
|------|-----------|
| `student` | Dashboard, Learn, Practice MCQ, Assignments, Coding, Code Lab, Company Prep, Domain Programs, Jobs, College Feed, Leaderboard, Resume Builder, Profile |
| `college_admin` | Dashboard, Students, Analytics, College Feed |
| `super_admin` | Overview *(standalone)* + 3 collapsible groups — see below |

**Super Admin nav groups** (`components/sidebar.tsx` — `superAdminNav`):

| Group | Items |
|-------|-------|
| People & Colleges | Colleges, Students, Branch Admins |
| Content Management | Courses, Domain Programs, Aptitude Questions, Coding Problems |
| Jobs & Feedback | Job Postings, Feedback |

- Groups default open when the active route is inside them; chevron rotates on expand/collapse.
- In collapsed (icon-only) sidebar mode, all items render flat with tooltips — groups do not collapse.

## Design System

`app/globals.css` defines **two themes** — light (`:root`) and dark (`.dark`):

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#FFFFFF` | `#0C0C0C` |
| `--foreground` | `#09090B` | `#EDEDED` |
| `--card` | `#FAFAFA` | `#161616` |
| `--popover` | `#FFFFFF` | `#1C1C1C` |
| `--primary` | `#4F46E5` (indigo) | `#6366F1` (indigo) |
| `--secondary` | `#F4F4F5` | `#1C1C1C` |
| `--border` | `#E4E4E7` | `#2A2A2A` |
| `--muted-foreground` | `#71717A` | `#888888` |

### Semantic Color Tokens — "change only globals.css" pattern

All UI state colors are defined as semantic tokens in `globals.css` under `@theme inline`, which makes Tailwind generate utilities like `text-success`, `bg-warning/10`, `border-danger/30` automatically. **To change any semantic color globally, edit only `globals.css` — no component changes needed.**

| Token | Semantic meaning | Tailwind utilities |
|-------|-----------------|-------------------|
| `--success` | Correct / active / pass | `text-success`, `bg-success/10`, `border-success/30` |
| `--warning` | Amber / caution / unsaved / salary | `text-warning`, `bg-warning/15`, `fill-warning` |
| `--danger` | Error / delete / inactive / fail | `text-danger`, `bg-danger/10`, `border-danger/30` |
| `--coding` | Purple / programming / blog / HR | `text-coding`, `bg-coding/10`, `border-coding/20` |
| `--streak` | Orange / streak flame / 3rd place | `text-streak`, `bg-streak/10` |
| `--coral` | Pink accent | `text-coral`, `bg-coral/15` |

**Badge/chip shorthand utility classes** (defined in `globals.css`):
- `.chip` — base pill (border, rounded-full, px/py, text-xs, font-medium)
- `.chip-primary`, `.chip-success`, `.chip-warning`, `.chip-danger`, `.chip-coding`, `.chip-streak` — color variants

Usage: `<Badge className="chip chip-success">Active</Badge>`

> **Never use hardcoded Tailwind color classes** like `text-emerald-400`, `bg-amber-500/10`, `border-red-500/30`, `text-violet-400` for semantic UI states — use the tokens above instead.

**Intentionally hardcoded colors** (do NOT replace with semantic tokens):
- Terminal emulator UI: traffic light dots (`bg-red-500/70`, `bg-green-500/70`), output text (`text-emerald-400`, `text-green-300`, `text-red-300`), code block header bg (`bg-[#161b22]`, `bg-[#040810]`)
- Per-language IDE colors in lab: Python=green, JS=yellow, C++=blue, Java=orange, HTML=red — these represent language brand identities
- `DOMAIN_THEME` hex values in `domain-programs/page.tsx` — per-domain design identities
- Color palette picker options in `super-admin/courses` and `super-admin/domains` — these are the actual palette choices being presented to admins
- Medal badge contrast text: `text-amber-900`, `text-orange-900` — contrast text on gold/bronze badges
- Gradient darker stops: `to-yellow-500`, `to-orange-500` in leaderboard podium — gradient depth variants

> Always use CSS variable tokens (`bg-card`, `bg-popover`, `text-foreground`, `border-border`, etc.) — **never hardcode hex colors** like `bg-[#0F1628]` in components, as they break light mode.

Utility classes:
- `.glass-card` — card background + blur
- `.teal-glow` — `box-shadow: 0 0 20px rgba(0,212,200,0.3)`
- `.gradient-text` — teal gradient on text
- `.flame-pulse` — animated flame icon

**Fonts**: `font-sans` = Plus Jakarta Sans, `font-serif` = Outfit, `font-mono` = JetBrains Mono.

## Animation & Effects

- `framer-motion` — page/card entrance animations, stagger effects, sidebar logo hover/tap spring animation
- `canvas-confetti` via `lib/effects.ts` — celebration effects:
  - `fireConfetti()` — general burst (assignments ≥50%)
  - `fireSchoolPride()` — side cannons (assignments ≥80%, onboarding complete)
  - `fireStars()` — star burst (lesson complete, MCQ correct)
- `PointsBurst` component — spring-animated `+N pts` overlay

## Patterns for New Pages

- Use `GlassCard` for all card containers.
- Use `Avatar` + `AvatarFallback` (shadcn) for user avatars — never raw divs.
- Use `toast` from `"sonner"` (not shadcn toast) for all notifications.
- Use `react-hook-form` + `zod` for all forms.
- Show `Skeleton` from shadcn during loading, not spinners (except full-page).
- Use `DataTable` component for any tabular data with search/pagination.
- Use `ModalForm` component for any create/edit dialogs.
- Monaco editor (`@monaco-editor/react`) must be dynamically imported: `dynamic(() => import("@monaco-editor/react"), { ssr: false })`.
- Post/blog type accent: teal gradient for posts, purple→pink for blogs.
- Wrap page entry elements in `motion.div` from framer-motion for entrance animations.
- **Custom modal pattern** (used in super-admin pages that build their own modals instead of using `ModalForm`):
  - Overlay: `fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto`
  - Panel: `w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]`
  - Header: add `flex-shrink-0` so it stays pinned while the body scrolls
  - Body: add `overflow-y-auto` so long forms scroll inside the panel
  - Use `grid-cols-1 sm:grid-cols-2` for two-column field rows (never plain `grid-cols-2` inside modals)

## API Layer

`lib/api.ts` — Axios instance:
- `baseURL` = `NEXT_PUBLIC_API_URL` (`http://localhost:5000/api`)
- Default header: `Content-Type: application/json`
- Request interceptor: attaches `Authorization: Bearer <token>`; **automatically deletes `Content-Type` when payload is `FormData`** so the browser sets the correct `multipart/form-data; boundary=...` header for file uploads
- Response interceptor: on 401, attempts silent refresh via `POST /auth/refresh`; on refresh failure, clears auth and redirects to `/login`
- **File upload rule**: always pass a `FormData` object directly to `api.post()` — do NOT manually set `Content-Type: multipart/form-data` (the interceptor handles it)

## Key Rules

- Tailwind v4 syntax: use `@import 'tailwindcss'` not `@tailwind` directives.
- `next.config.mjs` has `typescript.ignoreBuildErrors: true` — TS errors won't fail the build but should still be fixed.
- The Sidebar reads role from the auth store directly — no props needed.
- Sidebar logo uses `/careerezi_logo.png` (single file, no theme variants) at 60px height with a framer-motion spring hover/tap animation. Header row is `h-20` (80px) to fit.
- `components/logo.tsx` is a simple `<img>` wrapper around `/careerezi_logo.png` — no theme switching logic. `showText` prop controls sizing only (height-constrained vs square).
- Favicon and Apple touch icon in `app/layout.tsx` also point to `/careerezi_logo.png`.
- Feed posts are college-scoped: backend filters by `user.college_id` automatically.
- Domain programs page is fully API-driven — no mock data.
- Job postings are **global** — not college-scoped. Posted by super_admin, visible to all students.
- Assignment "Review" button routes directly to `/assignments/[id]/results` (not through the exam page).

## Key gotchas
- `api.ts` has `Content-Type: application/json` as instance default. The request interceptor deletes it for `FormData` payloads so Flask's `request.files` is populated correctly. If file uploads return "No file provided", check that this interceptor logic is intact.
- **Sticky sidebar in flex layout**: put `lg:sticky lg:top-4` on the column div (direct flex child), NOT on an inner `GlassCard`. Also add `lg:items-start` to the flex row — without it, flex stretches the column to full row height and sticky has nothing to pin against.
- **Windowed pagination**: for lists with 1,000+ pages (e.g. aptitude has 10,000+ questions = 2,000 pages), never render all page buttons. Use a sliding window: show page 1, ellipsis, current±delta, ellipsis, last. Rendering 2,000 buttons freezes the UI.
- **Practice MCQ page** (`/practice-mcq`): aptitude left panel uses `aptSidebarOpen` state for mobile collapse. On mobile, selecting a subtopic auto-closes the panel (`if (window.innerWidth < 1024) setAptSidebarOpen(false)`). The `fireStars()` + `answerFeedback` flash is shared between programming and aptitude views — `answerFeedback` state lives at the top of `PracticeMCQContent`.

## Course & Lesson Content Architecture

- **Courses are created via the super-admin UI** (`/super-admin/courses`) — no seed scripts. Super admin creates: course metadata, levels, lessons.
- **Lesson content lives in frontend TS files**, not in the DB. When creating a course with id `java`, create `frontend/content/courses/java.ts` exporting `Record<lessonOrder, markdownString>`, then register it in `frontend/content/index.ts`.
- Student learn page renders content via `renderContent()` — first checks `lesson.content` (DB), then falls back to `getLessonContent(courseId, lesson.order)` (frontend TS file).
- `renderContent()` supports: headings (H1/H2/H3), fenced code blocks with language labels, unordered/ordered lists, blockquotes, tables, bold/inline-code, and custom blocks (`:::scenario`, `:::tip`, `:::insight`, `:::challenge`, `:::mistake`).

### MCQ Practice Tab (lesson_id-driven)

- The learn page Practice tab is **fully dynamic**: shown for any course that has levels in the DB (`isModular = course.levels.length > 0`).
- MCQ questions are linked to lessons via the `lesson_id` FK on `mcq_questions`. Upload MCQs per lesson via `POST /super-admin/lessons/<lesson_id>/mcq/upload`.
- The practice tab fetches counts via `GET /mcq/lesson-counts?course_id=X` and questions via `GET /mcq/questions?lesson_id=X`.

### Assignment Tab (level_id-driven)

- Assignments are level-based: `assignment_questions` have a `level_id` FK. Upload CSVs per level via the super-admin courses UI.
- The learn page assignment tab filters `/assignments/list` by `course_id` automatically.
- Assignment router pushes to `/assignments/<level_id>` (integer DB ID, not a string slug).

### Checklist for adding a new course (e.g. `java`)

1. Create course in super-admin UI with id `java` (string slug — used in URL and content file key)
2. Create levels and lessons in super-admin UI
3. Create `frontend/content/courses/java.ts` — `Record<lessonOrder, markdownString>`
4. Register it in `frontend/content/index.ts`
5. Upload MCQs per lesson via `POST /super-admin/lessons/<lesson_id>/mcq/upload`
6. Upload assignment questions per level via the super-admin courses UI (CSV)

#### Adding course content from a Word document (.docx)

See memory file `feedback_course_content_from_docx.md` for the full extraction workflow (XML parsing, lesson splitting, element→markdown conversion, image handling).

### Domain / Aptitude / Coding content management

- Domains: managed via super-admin UI — full CRUD + course mapping with up/down arrow reordering. Domain `id` is a permanent slug set at creation and **cannot be changed**. `bg_color` is auto-derived from `icon_color`. Course mapping uses `PUT /super-admin/domains/<id>/courses` (replaces full mapping atomically).
- Aptitude questions: super-admin UI (`/super-admin/aptitude`) — CSV bulk upload only.
- Coding problems: super-admin UI (`/super-admin/coding`) — CRUD form + JSON bulk import. `seed_coding.py` for initial bulk data. Bulk import upserts by slug.
