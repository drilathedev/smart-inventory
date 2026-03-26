# SmartStock v3 — Inventory Intelligence

> The inventory app that sells itself. Every business owner who sees it says "we need this."

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## What makes this different

This isn't inventory software. It's a **profit protection tool**.

- Opens and immediately shows: *"You have €347 expiring this week. Discount now and recover €290."*
- One tap applies all discounts automatically
- AI tells you what to reorder, when, and how much — based on your actual sales speed
- Works on any phone, installs like a native app (PWA)

## Pages

| Page | What it does |
|------|-------------|
| **Dashboard** | Revenue today, expiry alert with €, reorder alerts, AI insight |
| **Inventory** | Full product list — mobile cards / desktop table, add/edit/delete |
| **Expiry Tracker** | Discount engine — see money at risk, apply discounts in one tap |
| **Point of Sale** | Fast product grid, mobile cart sheet, receipt modal |
| **Sales & Analytics** | Revenue chart, peak hours heatmap, top sellers, PDF export |
| **Suppliers** | AI reorder suggestions, one-tap email order, supplier directory |
| **Waste Reduction** | Waste log, WhatsApp alerts setup, smart recommendations |
| **Settings** | Store config, alert toggles, PWA install instructions |

## Install on phone (PWA)

**iPhone:** Safari → Share → Add to Home Screen  
**Android:** Chrome → ⋮ → Install app / Add to Home Screen

Works offline after first load.

## Tech Stack

- **Nuxt 3** — file-based routing, auto-imports
- **Pinia** — products, sales, UI stores
- **Tailwind CSS v3** — custom warm design system (`n-*` / `g-*` tokens)
- **Chart.js** — revenue/profit bar charts
- **date-fns** — expiry calculations
- **@nuxt/icon** + Lucide — icons
- **PWA manifest** — installable on any device

## Design System

| Token | Value |
|-------|-------|
| `g-500` | `#2F6B3F` (brand green) |
| `n-900` | `#1a1714` (warm dark) |
| `n-50`  | `#f9f7f5` (warm light bg) |
| Font | DM Sans + DM Mono |
| Border radius | 10px base, 16px cards |

## Color tokens reference

- `g-*` — brand green (25→950)
- `n-*` — warm neutrals (0=white → 900=near black)
- `danger-*` — red alerts
- `warn-*` — amber warnings
