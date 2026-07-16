# 10-Minute Coach · 10-минутный тренер 🏋️

A small installable **PWA** built from the workout poster **“30 minutes a day with dumbbells and a bench”**:
morning + midday + evening, **10 minutes each**. It tells you **what to do right now** — based on the
weekday and time of day — and guides you through the sets with a **timer**, sound, voice and a picture
for every exercise. Installs to your phone as an icon and **works offline**.

> **📦 Repo:** <https://github.com/Legion-IT/10min-coach>
> **Bilingual** — Русский / English, toggle in the header (auto-detected, remembered).

## Features
- **Two languages (RU / EN)** — header toggle, auto-detected from the browser, remembered.
- **“Now”** — auto-selects the weekday (Mon–Sun) and block (morning / midday / evening). Any day/block is browsable.
- **Guided timer** — warm-up → **3 or 4 exercises × 2 sets**, with longer changeover rests, a countdown ring, progress bar and set dots.
- **Room/equipment modes** — choose **Standing**, **Bench + standing**, or **Mat + standing** so one workout does not bounce between bench, mat and standing work.
- **Load modes** — choose a mixed session, dumbbells only, or bodyweight only.
- **Balanced rotation** — short sessions rotate through all target muscle groups instead of always taking the first four.
- **Replace one exercise** — swap an individual movement while keeping the rest of the workout intact.
- **Sound + voice (RU/EN)** — 3-2-1 cues, “switch sides”, spoken exercise names. Toggle 🔊.
- **Background music** — original looping klezmer/freylekhs tracks (instrumental, generated with ElevenLabs), one per time-of-day, playing quietly under the workout. Toggle 🎵.
- **50+ exercise variants** grouped by real target muscles: quads, hamstrings, glutes, adductors, calves, tibialis, chest, lats, mid-back, delts, biceps, triceps, abs, obliques, spinal erectors, grip/core and mobility.
- **Exercise illustrations + muscle badges** — crisp inline SVG, dumbbells with round plates, target-muscle labels, time-of-day accent colors.
- **Keeps the screen on** (Wake Lock), **fully offline** after first load (service worker).
- **Light days** (Wed/Sat) and **recovery** (Sun) with their own flows.
- Reference: how to progress, technique, when to stop, knee care.

The full program (all exercises, reps and repeats) is transcribed one-to-one from the source poster.

## Repo structure
```
index.html              # entry point
manifest.webmanifest    # PWA manifest (root — scope/start_url are relative to it)
sw.js                   # service worker (must stay at root to control the whole scope)
README.md
assets/
  css/styles.css        # all styling
  js/data.js            # program data + exercise SVG illustrations (bilingual)
  js/app.js             # logic: "now" detection, player, timer, sound/voice, music, i18n, PWA
  icons/                # app icons (svg + png, incl. maskable)
  audio/                # 3 looping background tracks (morning / day / evening)
```
Static files only — no build step. Asset URLs carry a `?v=N` query for cache-busting; bump it (and the
`CACHE` name in `sw.js`) when you change `app.js` / `data.js` / `styles.css`.

## Run locally
```powershell
cd C:\workspace\10min-coach
python -m http.server 8010
```
Open <http://127.0.0.1:8010/>.

> Service workers and PWA install only work over `http://localhost` or `https://`.
> Opening the file directly (`file://`) has no offline/install support.

## Install on Android (icon on the Home screen)
1. Open the hosted app URL in **Chrome** on the phone.
2. Menu (⋮) → **Install app** (or accept the prompt when it appears).
3. A **10-min Coach** icon appears — it opens like a normal app, no address bar, works offline.

**iPhone/Safari:** Share → **Add to Home Screen**.

## Hosting
The app is static and all paths are relative, so it runs from a site root or any subfolder. Host the
files on any **HTTPS** location — your own nginx, Netlify Drop, GitHub/Cloudflare Pages, etc.

## Credits
- Program: the “30 minutes a day with dumbbells and a bench” poster.
- Background music: original instrumental tracks generated with **ElevenLabs Music**.
