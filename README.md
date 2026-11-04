# Cricket Live & Recent Scorecard WebView

A zero-scroll, single-screen responsive Cricket Scorecard WebView built in **React** + **Vite** + **Tailwind CSS**, designed after the **Apple Sports** dark glassmorphism UI.

---

## 📱 Features

- **Single Screen Fit (Zero Scroll)**:
  - Fits 100% within a single screen (`h-[100dvh] overflow-hidden`) on mobile devices and WebViews with **no vertical page scrolling**.
  - All critical elements—Hero Scoreboard, 3D Isometric Pitch, Innings Table, Live Sync Action Pill, and Active Batting/Bowling & Team Stats Cards—are immediately visible simultaneously.
- **Recent Matches API Integration**:
  - Automatically fetches `GET https://api.pravasamedia.com/api/v1/cricket/matches/recent` on load.
  - Takes the first match ID (e.g. `1000`: India vs Australia 2nd T20I at Sydney Cricket Ground) and fetches `GET https://api.pravasamedia.com/api/v1/cricket/matches/1000/livescore`.
  - Automatically adapts the display to show **FINAL** status, match winner, margin (+18 runs), run rates, top performers (Kohli, Pandya, Bumrah), and full innings scorecard.
  - **Auto-polls every 5 minutes (300 seconds)** with a live countdown display (`4:59`, `4:58`, ...), pulse indicator, and pause/resume button.
  - Provides a manual **"Live Sync"** button to immediately hit the API at any time.
- **Apple Sports UI**:
  - Deep crimson-ruby radial glow gradient background.
  - Large typography hero scores with custom SVG badges for IND, AUS, SA, ENG.
  - 3D Isometric Pitch tracking Sydney Cricket Ground match conclusion.
  - Quarters/Innings table breakdown (IND 188/6 @ 9.40 RR vs AUS 170/9 @ 8.50 RR).
  - Interactive tabs: `Stats`, `Match Result`, `Play-By-Play`, `Scorecard`.
  - Dual red comparison bars for match run rates and totals.

---

## 🚀 Running the App Locally

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Build for production
npm run build
```
- Local URL: `http://localhost:5173/`
- Network URL: `http://192.168.0.79:5173/`

---

## 🌐 Live GitHub Pages Deployment

- Live URL: **`https://nikhil0626.github.io/bigtv_cricket-_web/`**
