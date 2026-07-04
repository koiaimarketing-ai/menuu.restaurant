# Handoff — Menuu restaurant site

**Updated:** 2026-07-04
**Project:** `C:\Users\User\Desktop\Project\Restaurant Website Sample` — Next.js 14.2.18 App Router, React 18.3.1, TypeScript, Tailwind 3.4.17, framer-motion ^11.11.17, lucide-react. Git repo on `main`.
**Latest commit:** `a0dbf3c` (hero dish raise + 2-row subtitle + coloured mobile outlet status).

## Brand / product state
- **MENUU** — blue-and-white. Primary blue `#2258DA` / deep `#1D46B7`. Logo = rounded blue "menuu".
- **Single outlet:** `data/locations.ts` → id `ss4`, shortName **Taman Sea** (Petaling Jaya). phone + whatsapp both **+60167068931** (normalised via `digits60()` / `telHref` / `waHref`). Regular hours **10:00–22:00 every day**.
- Pages: `/` (home), `/menu` (planner + checkout), `/introduction` (MENUU pitch landing), `/our-story`, `/contact`.
- Default language **EN** (was `ms`). Menu food names are Malaysian (nasi lemak, teh tarik, etc.).

## ⭐ Deploy — how it works now
- **Vercel Git integration is CONNECTED.** `git push origin main` **auto-deploys to production** (menuurestaurant.vercel.app, custom domain menuu.restaurant). No CLI needed — the old `vercel deploy` token is dead; do NOT use it.
- Workflow every change: stop dev server → `rm -rf .next && npm run build` (catch errors) → `git add -A && git commit && git push origin main`.
- **menuu.asia domain: PENDING USER.** Domain added to Vercel already; user must set Namecheap DNS **A record `@` → `216.198.79.1`** (and CNAME `www` → `cname.vercel-dns.com`). Until then it won't resolve.

## Preview / verify (IMPORTANT)
- Use the **Claude Preview** tool, server name **`warung-jakarta-dev`** (`preview_start`). Port varies.
- **NEVER run `npm run build` while the dev server is running** — corrupts `.next`, preview dies with chunk 404s. Always `preview_stop` first, then build.
- Preview **screenshots are heavily downscaled** (page renders ~250px wide in the canvas) — fine for gross layout, useless for pixel checks. **Verify geometry/colour via `preview_eval` DOM measurement** (getBoundingClientRect, computed styles, canvas alpha sampling), not screenshots.
- Entrance overlay blocks the hero: suppress with `localStorage.setItem('warung_welcome_next_show_at', String(Date.now()+864e5))` then reload. Do NOT `removeChild` the overlay node (React crash).

## Done recently (all built clean + verified, deployed)
- **WhatsApp order message** (`components/planner/CheckoutModal.tsx`): `orderDetailsBlock()` builds full itemised message — greeting → Name/Contact/Outlet/Status/Pax/Notes → `Order Details:` → per line `{qty}× [CODE] Name — RM x` + dash customisation lines (only when present, via `describeLine`) → Subtotal / SST (6%) / Service Charge (10%) / (Voucher) / Grand Total. Used by all 3 flows (Going/Delivery/RSVP). `openWhatsApp` URL-encodes with `\n`. Empty notes → `-`. Verified live end-to-end.
- **Mobile outlet card** (`PlannerControls.tsx` `OutletCard`): mobile shows one stacked row = bold name + coloured status; desktop keeps `StatusBadge` + full `todayHoursLabel` range. Status via `getOutletStatusLabel(loc)` in `lib/operating-status.ts` → `{text, open}`: open ⇒ `Open · Closes 10:00 PM` **green `#16A34A`**, closed ⇒ `Closed · Opens 10:00 AM` **red `#B42318`**.
- **StatusBadge** (`components/StatusBadge.tsx`): mobile `Open`/`Closed` only (`md:hidden`), desktop detailed (`hidden md:inline`).
- **Intro Problem cards** (`components/introduction/sections/phone-workload.tsx`): fixed invalid `bg-white/94` (rendered transparent → dark image bled through) → `bg-white/95` on all 3 capsules.
- **Hero** (`components/hero/FloatingDish.tsx` + `HeroContent.tsx`): dish lift `-translate-y-[34%] sm:-42% lg:-52%` (raised, verified solid food clears title / desktop right column / subtitle text / Our Story eyebrow at 1440/1280/1024; mobile+tablet dish below copy). Subtitle rewritten in en/ms/zh to a 2-line string using `\n`, rendered with `whitespace-pre-line` → exactly 2 rows (EN: "Bold sambal and home-style" / "flavours in every bite.").

## Outstanding / next
1. **Multi-outlet dropdown (CASE 2) NOT built** — with 1 outlet it'd be dead code. When outlets are added: animated framer-motion dropdown in the mobile outlet section (spec: "Choose location" collapsed → tap opens dropdown, soft-blue hover, blue check on selected, same rounded/blue-border style).
2. **Outlet "image 2" reference never seen** by the agent — mobile outlet card matches the written spec only. If user has a specific layout image, re-request and match it.
3. User keeps iterating on the **hero dish position** (this is the 5th pass) — any further "move up" is bounded by the near-opaque dish PNG (transparent top only ~5.7%) vs the subtitle/right-column/Our-Story. Measure clearance per-band before changing (see method below).

## Gotchas (bitten us)
- **`green` Tailwind token is mapped to brand BLUE** (`tailwind.config.ts`: green.DEFAULT `#2258DA`, green-dark `#1D46B7`). For a REAL green use explicit `#16A34A` (the WhatsApp green). `text-green-dark` looks blue.
- **Tailwind opacity steps:** `/94` is NOT a default step and JIT dropped it → transparent. Use `/90` or `/95`.
- **Windows case-only git renames** don't register — do two-step `git mv Foo.png tmp.png && git mv tmp.png foo.png`, else 404 on Vercel.
- `fmtRM` output is "RM 12.00" (with space) — keep it.
- Hero dish is a **z-20 sibling layer between hero and Our Story** (paints above both). It's centred on the **viewport** (`left-1/2`) while hero copy sits in the `max-w-site` container — so overlap geometry is width-sensitive; a centred wide dish reaches into the left column. To check overlap, sample the dish PNG's alpha on a canvas and compare the dish's leftmost/rightmost solid pixel *within a target y-band* to the text/element edges (bounding boxes overstate because the plate is narrow at top).
- i18n: `lib/i18n/translations.ts` flat dict `en`/`ms`/`zh`; `useLang()` → `{lang,setLang,t}`. WhatsApp message text uses `waText(lang)` (selected lang, not fallback).

## Key files
- Hero: `components/hero/FloatingDish.tsx`, `components/hero/HeroContent.tsx`, `components/OurStory.tsx` (top padding clears the dish)
- Planner/checkout: `components/planner/PlannerControls.tsx`, `components/planner/CheckoutModal.tsx`, `components/planner/MealPlannerPage.tsx`, `components/planner/menu-options.ts` (`describeLine`/`sortLines`)
- Status: `lib/operating-status.ts` (`getLiveStatus`, `getOutletStatusLabel`, `todayHoursLabel`, `formatTime`), `components/StatusBadge.tsx`
- Intro: `components/introduction/sections/phone-workload.tsx`, `components/introduction/providers/language-provider.tsx`
- Data: `data/locations.ts`, `data/menu.ts` · Config: `tailwind.config.ts`, `lib/i18n/translations.ts`
