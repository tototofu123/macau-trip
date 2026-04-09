# Macau Trip Map

An interactive map itinerary for a 12-person group trip to Macau.

## Features

- **Interactive Leaflet map** centred on Macau, powered by free CartoDB tiles (no API key required).
- **Tiered location markers** — colour-coded by priority:
  - 🟢 **Green** (Tier 1 – highest priority): accommodation & activity venues
  - 🟠 **Orange** (Tier 2): notable attractions
  - 🔵 **Blue** (Tier 3): additional points of interest (labels hidden until zoom ≥ 14 or on hover)
- **Sidebar itinerary list** — click any item to fly the map to that location and open its info popup.
- Fully **responsive layout** — stacks vertically on mobile, side-by-side on larger screens.

## Locations

| # | Name | Chinese | Tier |
|---|------|---------|------|
| 1 | Riviera Hotel Macau | 濠璟酒店 | 1 |
| 2 | Solution Climbing Gym | — | 1 |
| 3 | Complexo Desportivo da UM | 澳門大學綜合體育館（N8） | 1 |
| 4 | The Parisian Macao | 澳門巴黎人 | 2 |
| 5 | Senado Square | 議事亭前地 | 3 |
| 6 | Ruins of Saint Paul's | 大三巴牌坊 | 3 |

## Usage

Open `index.html` directly in any modern web browser — no build step or server required.

```bash
open index.html   # macOS
xdg-open index.html   # Linux
start index.html  # Windows
```

## Dependencies (CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| [Tailwind CSS](https://tailwindcss.com/) | latest | Utility-first styling |
| [Leaflet](https://leafletjs.com/) | 1.9.4 | Interactive map |
| [CartoDB Basemaps](https://carto.com/basemaps/) | — | Map tiles (free, no key) |