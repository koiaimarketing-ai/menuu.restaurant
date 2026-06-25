# Handoff — Warung Jakarta (Menu & Planner UI/UX + i18n + Deploy)

**Updated:** 2026-06-24
**Project:** `C:\Users\User\Desktop\Warung Jakarta` — Next.js 14.2.18 App Router, TypeScript, Tailwind, Framer Motion, lucide-react. **Now a git repo** (`main`, initial commit `987b1c3`; git identity set locally: koiaimarketing-ai / koiaimarketing@gmail.com).

## ⭐ DEPLOYMENT STATUS — resume here
- **Vercel: LIVE.** Project `warung-jakarta` under team `koiaimarketing-ais-projects` (Vercel CLI authed as `koiaimarketing-ai`). Production URL **https://warung-jakarta.vercel.app** (first `vercel deploy` auto-took the production alias; build succeeds clean in the cloud). `.vercel/` is gitignored. Re-deploy: `vercel deploy` (preview) / `vercel deploy --prod` (prod). NOTE: deployment protection may show a Vercel login wall to visitors — toggle in Vercel dashboard → Settings → Deployment Protection if a public URL is wanted.
- **GitHub: PENDING the user's one-time auth.** `gh` CLI v2.95.0 IS installed at `C:\Program Files\GitHub CLI\gh.exe` (NOT on the Bash tool PATH — call with full path). The interactive `gh auth login` cannot be driven from this harness (no TTY). **Next step:** user runs `gh auth login` in their own PowerShell (GitHub.com → HTTPS → web browser). Once `gh auth status` shows logged in, run:
  `& "C:\Program Files\GitHub CLI\gh.exe" repo create warung-jakarta --private --source=. --remote=origin --push`
  → creates the **private** repo and pushes. (Alternative: a PAT with `repo` scope via `gh auth login --with-token`.)
- `.gitignore` excludes node_modules, .next, .env*, .vercel, and the top-level `/image` source folder.

## How to run / preview (IMPORTANT)
- The host's port **3000 is taken by another project (KOI Car Rental)**. Warung Jakarta must run on another port.
- Launch: double-click **`start-warung.bat`** (runs `npx next dev -p 3000`; Next auto-falls back to a free port and prints `Local: http://localhost:XXXX`). Keep that terminal open.
- Mobile preview helper: open **`mobile-view.html`** (auto-detects the running port by pinging `/images/logo.png` and shows the site in a phone frame).
- **Limits of this agent env:** the assistant CANNOT save chat-uploaded images to disk, and servers it starts run in a sandbox the user's Chrome can't reach. Verify code via `npx tsc --noEmit` + the Claude Preview tool (DOM evals). Preview *screenshots* often time out because of infinite CSS animations (marquee/pulse/shine) — verify via DOM geometry/computed styles instead, not screenshots.

## Image workflow (how images get in)
- User drops source PNGs in `C:\Users\User\Desktop\Warung Jakarta\image\` (a **top-level** folder Next does NOT serve). The agent must **copy** them into `public/...` with lowercase/hyphen names via Bash `cp`.
- Promotions: `image/Promotion 1..5.png` → `public/promotions/promotion-1..5.png` (referenced by `components/planner/PromotionMarquee.tsx`).
- Menu category banners: `image/Menu Background/*.png` → `public/images/menu-bg-*.png` (wired in `components/planner/sections.ts` `featuredImage`).

## Done this session (all `tsc` clean, verified via DOM)
- **Brand rebrand** (earlier): red `#E24A34`, coffee-brown text `#3B241B`, white; fonts **Bricolage Grotesque** (`--font-fraunces`) + **DM Sans** (`--font-manrope`) — set in `app/layout.tsx`, `tailwind.config.ts`, `app/globals.css`.
- **WhatsApp buttons** use real WhatsApp green via `.btn-whatsapp`.
- **Home footer gap** removed globally: `main + footer{margin-top:0}` + `main > section:last-child{padding-bottom:0}`; Footer `mt-10` removed.
- **PlannerControls** (`components/planner/PlannerControls.tsx`): two-column outlet/plan layout (`.visit-selection-layout`), bubble-absorb collapse/expand (CSS `.outlet-options/.plan-options .is-collapsed/.is-expanded`, `order:-1` keeps selected card top-aligned). Title "What's your plan?". Outlet cards `height:auto;min-height:72/90px` (fixed height clipped KLCW content — do NOT reintroduce fixed height). Mobile selected plan = full width.
- **Menu cards**: `.menu-item-card` selected gradient + `is-bubbling` pulse; reusable **`QuantityControl`** (`components/planner/QuantityControl.tsx`) with green(+)/red(−) directional glow + `useCardBubble`. Used in OptionCard, MenuCard, AddOnSection, MenuPlanner card, MealPlanSidebar. Mobile menu grids = 1 per row (FeaturedMenuCategory, BeverageGroup).
- **Add-On/Sides**: rendered via `FeaturedThumbCategory` with `noImage` (MenuCard `noImage` prop hides the thumbnail).
- **Receipt modal** (`ReceiptModal.tsx`): white card on warm `.receipt-export` wrapper (padding captured into saved PNG). Rows = name + `RM x · Qty N` / line total (no red x). **No inner scroll — all items show.** Primary CTA **"WhatsApp Us Now!"** sends the plan as a TEXT message (greeting by `plan.planType`; no image) — always visible, ungated. "Save Receipt Image" is now the secondary button (`.receipt-secondary-btn`).
- **Checkout modals** (`CheckoutModal.tsx`) — WHATSAPP-ONLY (no online payment/QR, no delivery quote). White shell, beige close. Premium `OrderSummary`/`OrderItems` card (`.order-summary-*` in globals.css): green Grand Total, beige "N Items" badge, rows = name + `RM x · Qty N` (left, wider) / line total (right). **No inner scroll — all items show.** Single CTA `WhatsAppCTA` = `.btn .btn-whatsapp .cta-shine` (real WhatsApp green #25D366; disabled = beige #EADDD4 / #9B7B70). Each type builds a text WhatsApp message via `itemLines()`+`openWhatsApp()` (no image).
  - **Going Now** (`GoingNowCheckout`): name/contact/**Pax 1–120**/notes → "Hi Warung Jakarta, i'm on the way to your branch" message. White `PaymentNotice` card.
  - **RSVP** (`RsvpCheckout`): name/contact/date/time/Pax/notes → "…reservation (RSVP)" message.
  - **Delivery** (`DeliveryCheckout`): no quote/Waze/QR. Required: name, contact, address (DeliveryAddressAutocomplete or manual), unit, landmark (notes optional); inline red errors on attempt. Summary shows "Delivery fee: Paid by customer" (muted) + grand label "Pay now". Message "Hi Warung Jakarta, I want to order food delivery" incl. `Location:` Google Maps lat,lng link when geocoded.
  - REMOVED: `QrPayment`/`DeliveryRouteMap` usage, MethodButton (Pay Now / Pay at Restaurant), delivery quote API call, Waze button, confirm checkbox. `/api/delivery/quote` + DeliveryRouteMap component still exist but are no longer wired into checkout.
- **Continue-plan modal** (`MealPlanWelcomeModal.tsx`): receipt style — title + "Saved Plan" pill, divider summary, **green Estimated total**, green "Continue Meal Plan" + ivory "Start Fresh".
- **Meal-plan CTAs** = WhatsApp green `#16A34A` (`.cta-whatsapp`, hover `#128C3D`, bold + text-shadow). Desktop nav pill = single flat green pill (no inner badge). Mobile: top capsule removed; bottom `.mobile-mealplan-pill` is one centered green capsule in a blurred sticky wrapper (`.mobile-mealplan-sticky`) with `ctaPulse` + tap shine.
- **Volume button** (`AmbientSoundToggle.tsx` / `.ambient-toggle`): fixed right:18/bottom:28 (mobile 16/24), z-index 80; lifts to bottom:96px above the capsule ONLY on `/menu` mobile with items.
- **`.cta-shine`** continuous sweep added to all modal primary green CTAs.
- Hero "Our Story" + OurStory link = `.read-story-link` (plain red text + arrow). Hero actions stacked vertically. Feature/Plan-Your-Meal icon circles = filled red `#F04438` with white icons. Welcome-overlay button text = "Click Me".
- Shared modal tokens in `:root` (`--modal-*`) and a provided `.checkout-modal*` system block exists in globals.css.

## i18n (multilingual) — NEW
- System: `lib/i18n/translations.ts` (flat dict, keys `nav.*`, `hero.*`, `footer.*`, `planner.*`, `checkout.*`, `err.*`, `receipt.*`, `saved.*`, `wa.*`; langs `ms`/`en`/`zh`), `lib/i18n/LanguageProvider.tsx` (`useLang()` → `{lang,setLang,t}`; **default `ms`**; persists to localStorage `wj-lang`; sets `<html lang>`), `components/LanguageSwitcher.tsx` (segmented `BM | EN | 中文`, active = red `#E24A34`).
- Provider mounted in `app/layout.tsx` (outermost). Switcher in Navbar desktop (next to CTA) + mobile drawer.
- TRANSLATED so far: Navbar, Hero (`HeroContent` now client), Footer (now client), PlannerControls, CheckoutModal (going/delivery/rsvp incl. validation errors + **WhatsApp message text via `waText(lang)`**), ReceiptModal, MealPlanWelcomeModal.
- WhatsApp messages follow the **selected** language using `translations[lang]` directly (not the `t` fallback).
- NOT yet translated (remaining): menu data (`data/menu` item names/descriptions — keep Indonesian food names; `sections.ts` labels/blurbs), Home page sections, Our Story page, Contact page intro + branch info card + BusinessHours/LiveStatus, PromotionMarquee, Review marquee/carousel, MealPlanSidebar, MenuPlanner, MobileMealBar, CategoryPills/menu filters, CustomisationModal, GeneratedListModal, EntranceOverlay, AppointmentPicker. To translate: convert the component to `"use client"` if needed, `const { t } = useLang()`, add keys to all 3 dicts.

## Next / outstanding
1. **NOT DONE — full structural modal shell** (last user request): convert all 4 modals to the exact `.checkout-modal` shell from the user's spec — fixed **icon-capsule header**, **sticky bottom action bar**, and a true **mobile bottom-sheet** (slide-up, rounded top corners, internal scroll, CTA stays visible). The `.checkout-modal*` CSS is already in `app/globals.css`; the components still use the older centered-card structure. This is a sizable refactor of `CheckoutModal.tsx` (Going/Delivery/RSVP) + `ReceiptModal.tsx` — do it carefully WITHOUT touching payment/delivery/RSVP/calculation logic.
2. User still needs to keep dropping updated images into `image/` then ask the agent to copy them into `public/`.

## Warnings / gotchas
- Don't reintroduce fixed `height` on `.outlet-card` (clips KLCW content).
- Don't make Bash-started servers and expect the user's Chrome to reach them.
- `noUnusedLocals` is on — remove unused imports/vars (e.g. when deleting elements) or `tsc` fails.
- Google Maps/Supabase remain **env-gated** (no keys); delivery quote returns 503 → the UI now degrades gracefully (food payment still works).
- Keep `fmtRM` output "RM 12.00" (with space).

## Key files
`components/planner/`: CheckoutModal.tsx, ReceiptModal.tsx, MealPlanWelcomeModal.tsx, MealPlanSidebar.tsx, MealPlannerPage.tsx, PlannerControls.tsx, PromotionMarquee.tsx, QuantityControl.tsx, MenuCard.tsx, OptionCard.tsx, AddOnSection.tsx, FeaturedThumbCategory.tsx, FeaturedMenuCategory.tsx, BeverageGroup.tsx, MobileMealBar.tsx, sections.ts · `components/`: Navbar.tsx, Footer.tsx, OurStory.tsx, ContactClient.tsx, AmbientSoundToggle.tsx, EntranceOverlay.tsx, hero/HeroContent.tsx · `app/`: globals.css, layout.tsx, page.tsx · `start-warung.bat`, `mobile-view.html`
