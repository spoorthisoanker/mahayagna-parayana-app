# Gita Parayana Pace Helper

## Project Overview

A web-based presentation tool for Bhagavad Gita parayana (recitation). It displays Sanskrit verses with syllable-level animation pacing, helping groups chant at a consistent tempo. The app is a single-page HTML file (`index.html`) with no build step.

## Hosting

- **Firebase Hosting**, project ID: `gita-pacer`
- Serves from repo root (not a subfolder)
- Deploy with `firebase deploy`
- `docs/` folder is ignored by hosting

## Architecture

Single file: `index.html` containing all CSS, HTML, and JavaScript.

### Key Modules (all in `index.html`)

1. **EMBEDDED_DHYANA** — Chapter 0 (Gita Dhyana Shlokas) data, embedded inline so it loads instantly with no network request.
2. **prosody** — Sanskrit prosody engine (Devanagari). Splits Devanagari text into syllables, classifies guru (heavy, 2 beats) vs laghu (light, 1 beat) for pacing.
3. **iastProsody** — IAST/ISO 15919 prosody engine. Same syllable/beat analysis but for romanized text. Used for chapters without Devanagari source (datta_stavam, sadguru_stavam, gita_mahatmyam, kshama_prarthana).
4. **dataLayer** — Loads chapter data. Chapter 0 (Dhyana Shlokas) is embedded; others are lazy-loaded from `data/` JSON files. Supports string chapter IDs. Maintains ordered chapter list for navigation. Caches loaded chapters and prefetches next.
5. **renderer** — Renders verse pages. Two display modes: Asterisks (hides text, shows `*` per syllable), English (ISO 15919 transliteration). Auto-detects Devanagari vs IAST text for prosody analysis.
5. **animator** — Syllable-by-syllable animation engine. Highlights current syllable in gold, dims completed ones. Auto-advances pages and chapters.
6. **ui** — UI controller. Binds controls, handles chapter selection, page navigation, keyboard shortcuts.

### Data Files

- `data/chapter_01.json` through `data/chapter_18.json` — Per-chapter verse data with both Devanagari `text` and `iast` (ISO 15919) fields
- `data/datta_stavam.json`, `data/sadguru_stavam.json`, `data/gita_mahatmyam.json`, `data/kshama_prarthana.json` — Additional prayer/chapter data (IAST only, no Devanagari)
- IAST text uses ISO 15919 convention (ē/ō for long e/o)
- Each chapter JSON has: `name`, `iastName`, `chapterNum`, `shloka[]` array
- Each shloka has: `shlokaNum`, `entry[]` with `swhtsp` (line position marker), `sty` (style: fh=first header, th=title header, uh=closing header), `text`, `iast`

### Chapter Order (in dropdown)

Datta Stavam → Starting Prayers (Sadguru Stavam) → Gita Dhyana Shlokas → Chapters 1-18 → Gita Mahatmyam → Samarpana + Kshama Prarthana

## Controls

- **SPM (Syllables Per Minute)**: Controls animation tempo. +/- buttons or keyboard `+`/`-`. Range: 40-600.
- **Play/Pause**: Space bar or buttons
- **Reset**: `R` key or button
- **Prev/Next page**: Arrow keys or buttons. At chapter boundaries, navigates to adjacent chapters.
- **Chapter selector**: Dropdown to jump to any chapter (Datta Stavam through Kshama Prarthana)
- **Display modes**: Asterisks (default), English (ISO 15919 transliteration)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| Arrow Right | Next page |
| Arrow Left | Previous page |
| R | Reset animation |
| +/= | Increase SPM by 10 |
| -/_ | Decrease SPM by 10 |

## Design Reference

- `Gita-Parayana-HTML5-Viewer-Design.docx` — Original design spec
- `Updated Parayana Instructions Final-resized on 7.17.25 - black background.pptx` — Reference PowerPoint with all chapter slides (black background, gold/white text)

## Electron App

The app runs as an Electron desktop app with two windows:
- **Operator window** (`src/operator.html`) — controls, runs the animator
- **Projector window** (`src/projector.html`) — fullscreen verse display, driven by IPC from operator
- **Shared module** (`src/shared.js`) — prosody, dataLayer, renderer, animator (loaded by both windows)

Run locally: `npm start`

## Release Procedure (MANDATORY)

Every release **must** include DMG (macOS) and EXE (Windows) assets attached to the GitHub release.

### Steps
1. Implement and verify changes locally (`npm start`)
2. Bump version: `npm version X.Y.Z --no-git-tag-version`
3. Commit: `git commit -am "feat: ... vX.Y.Z"`
4. Push + tag: `git push && git tag vX.Y.Z && git push --tags`
5. Create GitHub release: `gh release create vX.Y.Z --title "vX.Y.Z — ..." --notes "..."`
6. **Build and attach assets**: `./scripts/release.sh X.Y.Z`

### Release script
`scripts/release.sh [version]` — builds macOS DMG (arm64 + x64) and Windows EXE via `electron-builder`, then uploads all artifacts to the existing GitHub release tag.

Never publish a release without running `scripts/release.sh`. The DMG and EXE are required.

## Conventions

- Black background, white/gold text throughout
- No build tools, no dependencies, no npm — pure vanilla HTML/CSS/JS for web; Electron for desktop app
- Keep the site lightweight: lazy-load chapters, don't bundle all data
