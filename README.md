# Backpacking Route

**Live app: https://camielvelt.github.io/backpacking-route/**

Plan an overland backpacking route through **Thailand, Laos, Cambodia and Vietnam** in one minute.
Pick your countries and days, your travel style, pace and what you're into. The app suggests a route, picks the
border crossings that fit it, and works out your daily budget.

Built by Camiel Velt, with AI (Claude) as coding partner, while getting ready to backpack Southeast Asia in 2027.

## What it does

- Builds a route from your days, pace (relaxed / active) and interests (nature, city, party)
- Orders each country as a short path from the border where you enter to the border where you leave
- Chooses from 14 real land crossings, and warns when a border is closed (Thailand–Cambodia, closed since June 2025, checked November 2026)
- Estimates daily costs per country and travel style, adjusted for inflation and the euro–dollar rate
- Budget check with savings tips you can apply in one tap
- Customize: move, remove and add places (search the top 15 per country)
- Share your route as a link that opens the exact same route
- Works offline and can be installed on your home screen (PWA)

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | The look |
| `app.js` | All app logic: places, costs, crossings, route builder, sharing |
| `config.js` | Your settings: feedback form and visitor stats |
| `sw.js` | Service worker, makes the app work offline |
| `manifest.webmanifest` | Name, colours and icons for "Add to Home Screen" |
| `icons/`, `og-image.png` | App icons and the link preview image |
| `fonts/` | Inter font (SIL Open Font License, see `fonts/OFL.txt`) |

## Put it online with GitHub Pages

1. Create a repository called `backpacking-route` and upload all files in this folder (keep the folders).
2. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
3. After a minute the app is live at `https://camielvelt.github.io/backpacking-route/`.
4. If the address ever changes, update the `og:image` and `og:url` lines in `index.html`, so link previews in WhatsApp show the image.

## Settings (`config.js`)

**Feedback form (Google Forms)**

1. Make a Google Form with three short-answer questions: *Rating*, *Feedback* and *Route*.
2. Click **⋮ → Get pre-filled link**, type `RATING`, `FEEDBACK` and `ROUTE` in the three answers, click **Get link** and copy it.
3. Paste that link into `FEEDBACK_FORM` in `config.js`. Answers then appear in the form's **Responses** tab.

**Visitor stats (GoatCounter, no cookies)**

Create a free account at goatcounter.com and put your code (the part before `.goatcounter.com`) in `GOATCOUNTER_CODE`.

## Updating

Every time you change a file, raise `CACHE_VERSION` in `sw.js` (for example `br-v1` → `br-v2`), otherwise phones keep the old version.

## Data and sources

Costs: backpacker budget from Hostelz (2026); mid-range and luxury totals from 2026 travel budget guides, split by category as an estimate.
Inflation: national figures for 2026. Border status: news and government travel advice, checked November 2026.
All numbers are estimates to help you plan. Always check borders, visas and prices before you go.
