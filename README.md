# TaniTrack — Driver Portal

The **driver-facing dashboard** of the FarmXpress prototype set. It shows one driver's refrigerated delivery run: the current assignment and remaining stops, a live route map, cold-chain sensor readings and a contact panel.

> **Prototype status.** Every number, name and coordinate on screen comes from one static file (`lib/fleet-data.ts`). There is no backend, no login and no live GPS or sensor feed. All data is **synthetic demonstration data**.

Browser tab title: *TaniTrack — Driver Dashboard | Farm Produce Fleet*. Brand line in the sidebar: *TaniTrack · Farm Produce Fleet*.

---

## 1. What the portal shows

One page (`app/page.tsx`) renders `DashboardShell`, which switches between four modules with a single `useState` tab. There are no routes.

| Tab (sidebar label · sub-label) | Component | Contents |
|---|---|---|
| **Delivery Assignment** · Orders & vehicle | `components/modules/delivery-assignment.tsx` | *Current Assignment* panel for the first stop whose status is `in-transit`: order badge, **Pickup** (hub name and address), **Next Destination** (business, address, state), time window and ETA, kilometres remaining and the produce being carried; *Remaining Orders* list of all stops with order number, business, produce, quantity, kg, address, delivery window, ETA and a status badge (Delivered / In transit / Pending), plus an "n of 4 stops" counter; *Vehicle* panel (plate badge, model, type, load against capacity, fuel bar, odometer); *Driver On Duty* panel (name, ID and phone, total produce kg on the run). |
| **GPS Tracking** · Live route map | `components/modules/gps-tracking.tsx` + `components/route-map.tsx` | Leaflet map (client-only, loaded with `next/dynamic`, "Loading live map…" placeholder) with hub, driver and numbered stop markers joined by a dotted route line; stat tiles (distance to final stop, ETA of next drop, current speed, heading); driver coordinates; *Route Progress* timeline from hub through each stop to "Run complete · Return to hub". |
| **IoT Monitoring** · Cold-chain sensors | `components/modules/iot-monitoring.tsx` | Two gauges — container temperature (target 2–6 °C) and relative humidity (80–95 %) — each with an *Optimal* or *Alert* badge and a progress bar; an hourly temperature bar trend with a "Peak" badge; container status rows (door seal, reefer power, compressor, cold chain) and the last door-opening event. |
| **Contact Panel** · Emergency & hub | `components/modules/contact-panel.tsx` | Contacts in three groups — Emergency, Hub, Customers — each with a count badge, a **Call** button (`tel:` link) and, for customers, a **Message** button. |

### Layout behaviour (`components/dashboard-shell.tsx`)
- **Desktop (`md` and up):** fixed 16 rem dark-green sidebar with logo tile, four navigation buttons (active item highlighted, `aria-current="page"`) and a "Telemetry online" card.
- **Mobile:** sidebar hidden; a horizontally scrollable row of pill buttons under the top bar switches tabs (label shortened to its first word).
- **Top bar:** sticky, translucent with backdrop blur; shows the current tab title, the route line "Peninsular Malaysia · Run TT-4401 → TT-4404", an "On schedule" pill, and the driver avatar, name and ID.
- **Content grids:** most modules use a 3-column grid at `lg` (two columns for the main content, one for side panels) and stack on small screens.

---

## 2. Design system (from the code)

### Typography
| Role | Font | Where it is set |
|---|---|---|
| Headings `h1`–`h4` | **Plus Jakarta Sans** (`--font-jakarta`, exposed as `--font-display`) | `app/layout.tsx`, `@layer base` in `app/globals.css` |
| Body and UI | **Inter** (`--font-inter`, exposed as `--font-sans`) | same |

### Colour tokens (light theme, OKLCH — `app/globals.css`)
| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.98 0.008 145)` | page, very light green-tinted white |
| `--foreground` | `oklch(0.24 0.02 150)` | body text |
| `--card` / `--popover` | `oklch(1 0 0)` | panels |
| `--primary` | `oklch(0.54 0.13 150)` | brand green: active tabs, icons, avatar, badges, route line |
| `--secondary` | `oklch(0.95 0.02 145)` | stat tiles, info boxes |
| `--muted` / `--muted-foreground` | `oklch(0.96 0.01 145)` / `oklch(0.52 0.03 150)` | quiet surfaces and secondary text |
| `--accent` | `oklch(0.75 0.16 75)` | amber: "in transit" badge and marker |
| `--destructive` | `oklch(0.577 0.245 27.325)` | alert badge |
| `--border` / `--input` | `oklch(0.9 0.015 145)` | borders |
| `--sidebar` / `--sidebar-primary` | `oklch(0.28 0.04 155)` / `oklch(0.65 0.15 145)` | dark-green sidebar and its highlight |
| `--chart-1` … `--chart-5` | green, light green, amber, orange-red, teal | reserved chart palette |
| `--radius` | `0.625rem` | base corner radius; `sm`…`4xl` derived from it |

### Components
- **`components/ui/panel.tsx`** — `Panel`, `PanelHeader`, `PanelTitle`, `PanelBody` (rounded-xl bordered white card with a light shadow) and `Badge` with tones `primary`, `accent`, `success`, `muted`, `danger`.
- **`components/ui/button.tsx`** — `Button` built on `@base-ui/react/button` with `class-variance-authority`. Variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`. Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`. `buttonVariants` is also applied to plain `<a>` and `<button>` elements in the Contact Panel.
- **Icons:** `lucide-react`. **Class merging:** `cn()` in `lib/utils.ts` (`clsx` + `tailwind-merge`).
- **shadcn configuration** (`components.json`): style `base-nova`, base colour `neutral`, CSS variables on, Tailwind v4 (no config file), aliases `@/components`, `@/lib`, `@/components/ui`.

### Map styling
- Tiles: CARTO *Voyager* raster tiles (attribution "© OpenStreetMap contributors"); container background `oklch(0.92 0.02 145)`.
- Route: dotted primary-green polyline (weight 4, `dashArray "1 10"`, round caps).
- Markers (Leaflet `divIcon` HTML): **hub** dark-green rounded square; **driver** green circle with a pulsing halo (`@keyframes pulse` in `globals.css`); **stops** numbered circles — delivered = green, in transit = amber, pending = pale with a green outline. The map fits its bounds to hub, driver and all stops, with popups on every marker.
- Leaflet controls and popups use the theme radius.

### Themes
`app/layout.tsx` declares `colorScheme: 'light dark'` and theme-colour meta values. `globals.css` also defines `.dark` and `prefers-color-scheme: dark` blocks, **but those blocks are neutral grey** and do not carry the green brand (the dark sidebar highlight is blue). In practice the polished look is the light theme; see "Known gaps".

---

## 3. Data model (`lib/fleet-data.ts`)

| Export | Content |
|---|---|
| `HUB` | Cameron Highlands Consolidation Hub (name, address, coordinates) |
| `DRIVER` | Ahmad Faizal bin Rahim, `DRV-2291`, phone, live coordinates between Ipoh and KL, heading, speed (84 km/h) |
| `VEHICLE` | `PMK 7823`, Isuzu NPR reefer, capacity 3,500 kg, load 2,140 kg, fuel 62 %, odometer |
| `STOPS` | 4 `DeliveryStop` records `TT-4401`…`TT-4404` (Selayang, KL City, Seremban, Melaka) with produce, quantity, weight, coordinates, status (`delivered` / `in-transit` / `pending`), time window, ETA minutes, distance, contact |
| `ROUTE_LINE` | ordered coordinates hub → Ipoh → driver → stops |
| `SENSOR_HISTORY` | seven hourly temperature and humidity readings (06:00–12:00) |
| `IOT` | current temperature (4.3 °C) and humidity (89 %) with ranges; door, power and compressor flags; last-opened note |
| `CONTACTS` | six contacts of kind `emergency`, `hub` or `customer` |

Some text is hard-coded in components rather than read from this file: the avatar initials "AF", the route line "Run TT-4401 → TT-4404", the "On schedule" pill, "Departed 06:15 · loaded", the "Telemetry online / reporting every 30s" card and the "Cold chain Intact" row.

---

## 4. Tech stack (from `package.json`)

| Area | Package |
|---|---|
| Framework | Next.js `^16.3.8` (App Router), React `^19`, TypeScript `5.7.3` |
| Styling | Tailwind CSS `^4.3.3` through `@tailwindcss/postcss`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge` |
| UI primitives | `@base-ui/react ^1.5.0`, `lucide-react ^1.16.0`, `shadcn ^1.0.0` (generator/config) |
| Map | `leaflet ^1.9.4`, `react-leaflet ^5.0.0`, `@types/leaflet` |
| Analytics | `@vercel/analytics 1.6.1` (rendered only when `NODE_ENV === 'production'`) |

`next.config.mjs` sets `images.unoptimized: true` and **`typescript.ignoreBuildErrors: true`**. The path alias `@/*` points to the project root.

---

## 5. Running it

**Prerequisites:** Node.js (Next.js 16 needs a recent Node; use 20.9 or newer and confirm with `node -v`) and an internet connection the first time (Google Fonts for Plus Jakarta Sans and Inter, and the CARTO map tiles are fetched from the web).

```powershell
cd Driver_Portal
npm install
npm run dev            # http://localhost:3000
```

Other FarmXpress portals also like port 3000/5173, so choose a free port when running several:

```powershell
npx next dev -p 3004
npx next dev -H 0.0.0.0 -p 3004      # reachable from other devices on the LAN
```

Production build:

```powershell
npm run build
npm start
```

The folder contains both `package-lock.json` and `pnpm-lock.yaml`; use one package manager and delete the other lockfile to avoid drift. `npm run lint` is defined as `eslint .` but ESLint and an ESLint config are **not** present, so that script will not work until they are added.

**Offline note:** without internet the map shows no background tiles (markers and route line still draw) and fonts fall back to system fonts.

---

## 6. Project structure

```
Driver_Portal/
├─ app/
│  ├─ layout.tsx            fonts, metadata, viewport, production-only Analytics
│  ├─ page.tsx              renders <DashboardShell />
│  └─ globals.css           Tailwind v4 theme tokens, dark blocks, Leaflet overrides, pulse keyframes
├─ components/
│  ├─ dashboard-shell.tsx   sidebar, top bar, tab switching
│  ├─ route-map.tsx         Leaflet map (client component)
│  ├─ modules/
│  │  ├─ delivery-assignment.tsx
│  │  ├─ gps-tracking.tsx
│  │  ├─ iot-monitoring.tsx
│  │  └─ contact-panel.tsx
│  └─ ui/                   button.tsx, panel.tsx (Panel + Badge)
├─ lib/
│  ├─ fleet-data.ts         all demo data and types
│  └─ utils.ts              cn()
├─ public/                  icons (icon.svg, light/dark 32px, apple-icon) and v0 placeholder images
├─ components.json          shadcn config
├─ next.config.mjs  postcss.config.mjs  tsconfig.json  package.json
```

---

## 7. Verified status and known gaps

Checked by reading the source (and one command) on the uploaded copy:

- `tsc --noEmit` printed no type errors. `next build` and `npm run lint` were **not** run (the build needs network access for fonts; there is no ESLint setup).
- Interactions that exist: tab switching, map zoom/pan and marker popups, `tel:` call links. The **Message** buttons have no handler, and nothing reads or writes any server.
- `package.json` still names the project `my-project`, and `layout.tsx` metadata says `generator: 'v0.app'`; several `public/placeholder-*` files are unused template assets.
- The dark theme tokens are not branded (grey palette, blue sidebar highlight), so dark mode looks inconsistent with the light design.
- Identifiers do not match the shared FarmXpress scheme: this portal uses `DRV-2291`, `PMK 7823` and orders `TT-4401…4404`, while the shared architecture proposes `DRV-###`, `VEH-###` and `ORD-######`.

---

## 8. Planned integration with the shared FarmXpress data (not implemented)

Documented in `docs/shared-architecture-proposal.md` and `docs/api-contracts.md`. The intended change is data access only; the UI above stays.

| Module | Replace fixture with |
|---|---|
| Delivery Assignment | `GET /v1/drivers/{id}/shipments?active=1`; deliveries submitted with `POST /v1/shipments/{id}/stops/{stop_id}/deliver` |
| GPS Tracking | shipment route and stops from the same call; positions via `POST /v1/shipments/{id}/position` |
| IoT Monitoring | `GET /v1/shipments/{id}/observations` and `GET /v1/alerts?shipment_id=` (ranges from the products on the shipment) |
| Contact Panel | hub and buyer contacts from master data |

The API base URL would come from `NEXT_PUBLIC_API_BASE_URL` (for example `http://localhost:4000/v1`; use the laptop's LAN IP, not `localhost`, on phones). Until then, treat this portal as a visual prototype.
