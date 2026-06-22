# Warung Jakarta — Website

Three-page restaurant site (Home · Menu & Planner · Contact) for **Warung Jakarta**,
an Indonesian restaurant with two locations in Malaysia (SS4 & KL Central Walk).

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Structure

- `app/` — routes: `/` (Home), `/menu` (Menu & Group Meal Planner), `/contact`
- `components/` — shared UI + `components/planner/` (the Meal Planner)
- `data/` — **single source of truth**: `locations.ts`, `menu.ts`, `reviews.ts`
- `lib/` — `operating-status.ts` (Asia/Kuala_Lumpur hours logic), `meal-plan-store.tsx`
  (localStorage-backed planner state), `share-meal-plan.ts`, `currency.ts`
- `public/images/` — logo + dish photography

## Design system

Warm Jakarta palette (tokens in `app/globals.css`):
Burnt Terracotta `#D13827` · cocoa heading `#3A1E1A` · warm body `#6B5E5A` ·
alabaster `#FBF5EE` · coral glow `#F3C5BA`. Neutral fluid-glass nav capsule.
Meal Planner uses an accessible green system (`#16A34A`) for actions/prices/selections.
Fonts: **Fraunces** (display) + **Manrope** (UI/body).

## The Meal Planner

A planning tool — **not** ordering, checkout, reservation or an account system.
Flow: choose branch → choose visit time → status check → browse menu →
add/customise dishes → review → generate a Meal Planning List (copy / WhatsApp /
device share / show-to-staff display mode). State persists in `localStorage`.

## TODO — pending confirmed data (do not invent)

- **KL Central Walk:** full postal address, phone/WhatsApp, latitude/longitude,
  Place ID + Google Maps URL (map shows a professional pending state until added),
  facilities, holiday hours.
- **SS4:** confirmed menu + prices (planner intentionally shows a "menu being
  updated" state for SS4), Google Maps URL, parking, holiday hours.
- Replace the dish photos / add branch interior + team photos when approved.
- `data/menu.ts` → `pendingMenuItems` holds items seen in Google content but not
  confirmed in the supplied KLCW PDF (Sarawak Laksa, Mee Kolok, etc.) — keep hidden
  until the restaurant confirms branch, price and availability.

Replace placeholder values, then re-verify the map marker against the real listing.
