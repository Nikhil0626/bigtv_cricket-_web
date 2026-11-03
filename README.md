# Cricket Live Scorecard WebView

A zero-scroll, single-screen responsive Cricket Scorecard WebView built in **React** + **Vite** + **Tailwind CSS**, designed after the **Apple Sports** dark glassmorphism UI.

---

## 📱 Features

- **Single Screen Fit (Zero Scroll)**:
  - Fits 100% within a single screen (`h-[100dvh] overflow-hidden`) on mobile devices and WebViews with **no vertical page scrolling**.
  - All critical elements—Hero Scoreboard, 3D Isometric Pitch, Innings Table, Live Sync Action Pill, and Active Batting/Bowling & Team Stats Cards—are immediately visible simultaneously.
- **Genuine Web App Layout**:
  - Removed artificial phone mockup frames, simulated status bars, and notch overlays.
  - Renders as a true web interface: stretches edge-to-edge on mobile devices, and centers cleanly on desktop monitors (`max-w-[430px]`).
- **5-Minute Live PravasaMedia API Polling**:
  - Automatically fetches `GET https://api.pravasamedia.com/api/v1/cricket/matches/live` on load.
  - Passes the first match ID (e.g. `1002`) to `GET https://api.pravasamedia.com/api/v1/cricket/matches/{matchId}/livescore`.
  - **Auto-polls every 5 minutes (300 seconds)** with a live countdown display (`4:59`, `4:58`, ...), pulse indicator, and pause/resume button.
  - Provides a manual **"Live Sync"** button to immediately hit the API at any time.
  - If multiple live matches exist, tap **Today** to reveal the match dropdown selector.
- **Apple Sports UI**:
  - Deep crimson-ruby radial glow gradient background.
  - Large typography hero scores with custom SVG badges for SA, ENG, IND, AUS.
  - 3D Isometric Pitch tracking current over and target chase progress.
  - Quarters/Innings table breakdown.
  - Interactive tabs: `Stats`, `Betting Odds`, `Play-By-Play`, `Scorecard`.
  - Dual red comparison bars for current run rate vs. required run rate, and target equations.

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

## 🔄 CI/CD Deployment Pipeline (GitHub Actions)

A GitHub Actions deployment pipeline is located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### How It Works:
1. Every `git push` to the `main` branch triggers the workflow automatically.
2. The pipeline checks out the repository, installs dependencies via `npm ci`, compiles Vite with `@tailwindcss/vite`, and bundles production assets into `./dist`.
3. The built artifacts are deployed automatically to **GitHub Pages**.

### One-Time Setup on GitHub:
1. Go to your repository settings: **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Any subsequent push to `main` will build and publish your live app to:
   ```
   https://nikhil0626.github.io/bigtv_cricket-_web/
   ```
