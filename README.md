# HKUST Sports Climbing Team 2-Day Trip to Macau

An interactive map itinerary for the HKUST Sports Climbing Team’s 2-day trip to Macau.

## Features

- **Interactive Leaflet map** centered on Macau, powered by free CartoDB tiles with no API key required.
- **Tiered location markers** color-coded by priority:
  - **Green** (Tier 1, highest priority): accommodation and activity venues
  - **Orange** (Tier 2): notable attractions
  - **Blue** (Tier 3): additional points of interest
- **Sidebar itinerary list** — click any item to focus the map and open its popup.
- Fully **responsive layout** that stacks vertically on mobile and places the sidebar beside the map on larger screens.

## Trip Overview

This trip is a 2-day team excursion for the HKUST Sports Climbing Team, combining climbing activities, group travel, and sightseeing in Macau.

### Day 1
- Travel to Macau
- Check in at the hotel
- Visit the climbing venue
- Team dinner and free time

### Day 2
- Team climbing session / activity
- Visit local attractions
- Group lunch
- Return trip

## Locations

| # | Name | Chinese | Tier |
|---|---|---|---|
| 1 | Riviera Hotel Macau | 濠璟酒店 | 1 |
| 2 | Solution Climbing Gym | — | 1 |
| 3 | Complexo Desportivo da UM | 澳門大學綜合體育館（N8） | 1 |
| 4 | The Parisian Macao | 澳門巴黎人 | 2 |
| 5 | Senado Square | 議事亭前地 | 3 |
| 6 | Ruins of Saint Paul's | 大三巴牌坊 | 3 |

## Usage

Open `index.html` directly in any modern web browser. No build step or server is required.

For GitHub Pages, use the published site:

https://tototofu123.github.io/macau-trip/

If you are testing locally:

```bash
open index.html
xdg-open index.html
start index.html
```

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| Leaflet | 1.9.4 | Interactive map |
| CartoDB Basemaps | - | Map tiles, free and keyless |

## File Structure

- `index.html` loads the static page shell.
- `styles.css` contains all page styling.
- `app.js` loads the map and location cards.
- `locations.json` stores the location data for the sidebar and markers.