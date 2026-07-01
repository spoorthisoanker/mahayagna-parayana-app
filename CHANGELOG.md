# Changelog

## [0.10.5] - 2026-06-17

QA follow-ups (#36) + theme (#37).

### Added
- **Header pause setting** (#36.1): a separate "Header pause (mātrās)" control in the operator settings panel (default 3), independent of the verse line-break pause.
- **Manual per-meter line pauses** (#36.2): "Anuṣṭubh line pause" and "Triṣṭubh line pause" are now editable in settings, restoring manual fine-tuning. Changes re-render the current page immediately.
- **Projector dark/light theme toggle** (#37): operator setting switches the projector between the dark (black bg, white/gold text) and a light (white bg, dark text, dark-goldenrod highlight) palette. Defaults to dark.

### Changed
- **Triṣṭubh line-end pause** default raised from 4 → **4.5 mātrās** (#36.2).
- **Samarpana slide 4** (#36.3): the `ōṁ acyutāya namaḥ…` invocation now sits on a single consolidated slide (shown 3× with a 3-mātrā pause after each iteration) instead of three fast page-flips.

## [0.10.4] - 2026-06-17

### Fixed
- **Uvāca speaker-label pause** (#26): every speaker label (arjuna uvāca -, śrī bhagavānuvāca -, sañjaya uvāca -, dhṛtarāṣṭra uvāca -) now pauses **2 mātrās** (one guru) at the line end before the verse begins, across all sections. Replaces the v0.10.2 behavior where labels flowed into the verse with no pause, which the tester reported as breaking the parayana flow.

## [0.10.3] - 2026-06-16

Parayana QA issue #27 (sloka line structure) re-fix.

### Fixed
- **Sloka line structure** (#27): rebuilt affected verses to render one pāda per line matching the English transcript (reference PDF). Removed stray duplicate-pāda entries that rendered a 5th line in 1.26, 2.40, 5.8, 5.9, 5.21, 5.23, 5.27, 6.14, 6.22, 18.35; removed entries that had leaked in from the following sloka in 9.14 and 9.31; removed a duplicate speaker label in 17.2; and split merged pādas in 6.9 and 17.8. (The earlier v0.10.2 pass only corrected diacritics, not the line structure.)

## [0.10.2] - 2026-06-16

Parayana QA issues #19–#35 (GitHub).

### Added
- **Gita Sāram & Gita Ārati lyrics restored** (#33) with the full verses (sourced/corrected from the reference PDF), for practice use.
- **Gita Sāram repetition** (#28): the 4th pāda of slokas 3 & 4 repeat ×2, the closing Pallavi repeats ×2, and the Pallavi's 4th pāda repeats ×4.
- **Verse zoom** setting (#34): operator-controlled projector text zoom (50–250%), persisted.
- **Datta Stavam** now ends with the gaṇēśāya invocation slide (#31).

### Changed
- **Dhyana line pauses are now meter-aware** (#20/#21): 3 mātrās for anuṣṭubh shlokas, 4 for triṣṭubh (matching the rest of the chapters).
- **No pause after "uvāca" speaker labels** (#26) — they flow into the verse.
- **Countdown now precedes the chapter header** "Oṃ Śrī Paramātmanē Namaḥ" (#29).
- **Chapter titles are spaced** for chanting flow, e.g. "arjuna viṣāda yōgaḥ" (#30).
- **Gita Mahatmyam** re-lined to a 4-line-per-sloka layout per the English script (#35).

### Fixed
- Textual notation corrected in several slokas vs the reference PDF (#27): 2.40, 5.27, 6.14, 9.31.

## [0.10.1] - 2026-06-15

Parayana QA fixes (issue #36) + pointer refinements.

### Changed
- **Even pointer movement**: the hand now glides at a constant rate across all asterisks (each syllable gets the line's average beats) instead of dwelling longer on heavy syllables; the line's total time and tempo are preserved.
- **Header pause**: a 3-mātrā pause after each header line (headers no longer race past).
- **Meter-aware line pauses**: each shloka carries a syllable count + meter in the data; line-end pauses are now **3 mātrās for anuṣṭubh, 4 for triṣṭubh** automatically. The manual line-pause setting is removed (now data-driven).
- **Namaskara Mudra**: the crossed-fingers visual is replaced everywhere with the Pranam añjali (palms-together) mudra.
- **Gita Sāram & Gita Ārati**: shown as a heading-only title (no lyrics); the app stays on the title and does not auto-advance — the operator moves on manually, with instructions in the top-right overlay.

### Fixed
- **Dhyana shlokas** re-lined to the script's 8-line / 4-line layout (each pāda split into a main line + continuation), with a 3-mātrā pause per line.
- **Samarpana** slide 4: only the first line (`ōṁ acyutāya namaḥ…`) repeats ×3; the second line shows once (the two extra slides are gone).
- Pointer no longer overshoots past the last asterisk at line end.

## [0.10.0] - 2026-06-12

User-feedback release (App Fixes.xlsx — see issue #18).

### Added
- **Operator settings panel** (⚙ Settings): tune all chant constants live — line-end pause (mātrās), Dhyana sloka-end pause, colophon slowdown, countdown duration, chapter gap, and per-section tempo. Persisted across restarts, with reset-to-defaults.
- **Configurable inter-chapter gap** (3/5/7 s) before the auto-mode countdown.
- **Repeat playback**: a shloka can repeat N times (e.g. Samarpana "ōṁ acyutāya namaḥ…" ×3) with a (pass/total) page label.
- **Purnam** closing section added to the parayana krama.

### Changed
- **Line-end pause = 2 mātrās (one guru)** at every line end for all chapters except the Dhyana shlokas, which keep their meter-aware pacing.
- **Per-section default tempo** applied from the feedback table (Datta 90, Invocation 85, Dhyana 75, Ch1 85, Ch2–18 & Mahatmyam 95, Samarpana 80 SPM).
- **Auto-play flow**: full stop after Datta Stavam (manual resume); countdown (with śruti cue) now plays before each chapter in auto mode; namaskara mudra shows during header animation (no post-header pause) and on colophon / Ch18 verses 66 & 78 / Ch1 entry / pre-invocation.
- **Parayana krama**: Sadguru Stavam removed from the running order; Gita Saram and Gita Arati are now heading-only (no verse guidance).
- **Page labels** show "Header" / "Closing" instead of "Shloka 0" / "Shloka 31".
- Asterisk syllables render contiguous (no word gaps); long verse/header lines auto-fit; colophon pages run slightly slower and are center-aligned.

### Fixed
- **Chapter 18 ending colophon** corrected to the full "ōṁ tatsaditi śrīmanmahābhāratē … aṣṭādaśōdhyāyaḥ" form (center-aligned), keeping the sarvadharmān verse.
- Chapter 6 verse 1 duplicate "śrī bhagavānuvāca" removed; 6.33 zero-width artifact fixed; Chapter 15 title corrected (puruṣōttamaprāptiyōgaḥ); Chapter 13 title spacing; Datta Stavam trailing duplicate page removed.
- Samarpana: "Kshama Prarthana" header/line removed; the Purnam mantra moved out to its own section.
- Web app engine resynced with the desktop engine (chapter order, header detection, per-section tempo).

## [0.9.2] - 2026-06-06

### Fixed
- Dhyana Shlokas now defaults to 70 SPM (slower pace) when selected; other chapters keep their current SPM
- Header lines (chapter title, intro text) now animate without pauses between them — pointer sweeps continuously from one line to the next
- Pressing Play after a restart now always blanks the projector before the countdown, so the header only appears after countdown ends
- Removed the 2-second pause between "ōṃ tatsaditi…" colophon and "sarvadharmān…" — they now flow directly

## [0.9.1] - 2026-06-05

### Fixed
- Pointer now animates across all header lines (chapter title, intro text) in both asterisk and English mode — the pointer sweeps left→right across each header line exactly as it does for verse lines

## [0.9.0] - 2026-06-05

### Fixed
- **Countdown on first launch**: projector window now correctly shows blank screen on first open — previously the `projector-status` connection event was overwriting the blank before the countdown could run
- **Uvaca lines on same slide**: speaker labels ("sañjaya uvāca", "arjuna uvāca", "śrī bhagavānuvāca") now appear on the same slide as the verse they introduce in all affected chapters (2, 4, 5, 7, 8, 9, 12, 16, ch18 shloka 2)
- **Chapter 8 colophon on single slide**: "ōṃ tatsaditi śrīmad…" closing text was split across 8 separate slides — now grouped as one page (the entries had incorrect `sty=th/uh` tags instead of empty)
- **Pranam mudra for colophon and Sarvadharman**: Pranam cue now shows when transitioning through "Om Tatsaditi" colophon and Sarvadharman shloka, not just at chapter headers

## [0.8.9] - 2026-06-05

### Fixed
- Sarvadharman shloka (18.66) now comes AFTER the closing colophon ("ōṃ tatsaditi śrīmad…") in all 18 chapters, as per traditional recitation order
- Long-chandas verses (Trishtubh etc.) in chapters 1–18 now display as 4 lines matching book layout — 8-line split is restricted to Dhyana Shlokas and Invocation Prayers only
- Chapter header pages now show Pranam (namaskara) mudra image instead of folded hands

## [0.8.8] - 2026-06-05

### Added
- App icon: Gita Pacer logo (lotus/flame/speedometer, by SGS Gita Foundation)

### Fixed
- Chapter header ("ōṃ śrī paramātmanē namaḥ…") now correctly appears AFTER the countdown: projector blanks when chapter loads, page pre-renders during countdown, header appears the instant the overlay lifts
- Header page stays visible for 3 seconds with folded-hands cue before verse 1 begins (works for both initial play and mid-session chapter transitions)
- Last line of invocation prayers shlokas now respects BPM: root cause was Unicode dandas (॥ U+0965) not recognized by prosody engine — normalized to ASCII || so | = 2-beat pause, || = 4-beat pause
- Mid-pada split (continuation lines in long-chandas) flows without an extra beat pause, keeping pointer in rhythmic sync

## [0.8.7] - 2026-06-03

### Fixed
- Pointer animation is now smooth and predictable in asterisk mode:
  - **Ahead-prediction model**: pointer snaps to the current syllable center, then immediately glides toward the next syllable on the same line over the full syllable duration — so it arrives exactly when the next syllable activates.
  - **Clean line transitions**: at the end of each line the pointer glides to the right edge of the last syllable, then snaps cleanly to the start of the next line with no horizontal carry-over.
  - **No cross-line jumps**: previously the pointer carried over from the right side of line N to the left side of line N+1, creating a jarring right-to-left motion. Now every new line starts from a snap at the first syllable's center.
  - **English mode unchanged**: left-edge snap → right-edge sweep per line (already correct).

## [0.8.6] - 2026-06-03

### Fixed
- Reduced verse line spacing so all 8 lines of a long-chandas shloka fit on screen — margin reduced from 1.2em (1.5em at 1600px+) to 0.6em across all breakpoints. Verified: 8 lines occupy 693px within a 731px display area on a standard 1280px viewport.

## [0.8.5] - 2026-06-03

### Added
- Invocation Prayers (āvāhana ślōkāḥ) added as a new chapter between Datta Stavam and Dhyana Shlokas, containing the Guru Parampara shloka, Ganapati shloka, Guru Brahma shloka, and closing mantra (closes #15)

### Changed
- Left-aligned verse text within a centered panel; continuation lines (even rows in 8-line long-chandas display) staggered 20% from the left
- Chapter header/intro pages now automatically show the folded-hands image during the 3-second pause, signalling chanters to do namaskara

## [0.8.4] - 2026-06-03

### Fixed
- Asterisk mode: long-chandas padas now split into two evenly balanced lines at the exact syllable midpoint — 11 syllables gives 5+6, 12 gives 6+6, 19 gives 9+10. Previously long-chandas padas showed as one unbroken line of asterisks.
- English mode: line split now uses syllable-count word boundaries instead of character-count midpoint, giving more natural splits aligned to the meter.

## [0.8.3] - 2026-06-03

### Fixed
- English mode: long-chandas verses (Trishtubh, Jagatī) in all chapters now correctly split into 8 display lines. Previously used character count (threshold 40) which missed Chapter 11 Vishwarupa verses and others with 38-39 char entries. Now uses syllable count from the prosody engine (threshold 9) — Anushtubh padas always have 8 syllables (no split), Trishtubh have 11+ (splits).

## [0.8.2] - 2026-06-02

### Added
- BG 18.66 (sarvadharmān parityajya…) repeats 3 times in its natural position in Chapter 18
- BG 18.78 (yatra yōgēśvaraḥ kṛṣṇaḥ…), the final verse of Chapter 18, repeats 3 times before the closing colophon

## [0.8.1] - 2026-06-02

### Fixed
- Windows installer no longer shows "cannot be closed" error on reinstall/upgrade — added single-instance lock so the NSIS installer can always terminate a running instance cleanly

## [0.8.0] - 2026-06-02

### Added
- Sarvadharman shloka (BG 18.66 "sarvadharmān parityajya…") now appears at the end of all 18 chapters before the closing colophon
- Instruction overlay is now a compact top-right corner popup — verse display remains fully visible while instructions are shown

### Changed
- Asterisk mode now hides all text including chapter headers and intro lines — full asterisk-only display throughout
- English mode: long-chandas verses (entries >40 IAST chars) split into two display lines per pada, matching traditional book layout (8 lines for Vasantatilaka/Sragdhara, 4 lines for Anushtubh)
- Automatic folded-hands instruction after the 2nd shloka removed — all shlokas now play uninterrupted
- Updated "Increase Sruti" instruction image to a clearer visual guide
- Split lines use tighter spacing (0.25em) within a pada pair vs full spacing between separate padas

## [0.7.1] - 2026-05-21

### Fixed
- Pause button is now always visible as its own distinct control alongside Play — no longer toggling visibility; Play dims when playing, Pause dims when paused (#11)
- Chapter 1 intro now correctly begins with "Atha Srimad Bhagavad Gita" (not "Om Sri Paramatmane Namah") as the golden first-header, matching the traditional recitation sequence (#12)

## [0.7.0] - 2026-05-19

### Added
- Chapter intro sequence: every chapter (1–18) now displays "ōṃ śrī paramātmanē namaḥ", chapter number header, and chapter name as distinct header slides before the first shloka (#9)
- Chapter 1 specific intro: "atha śrīmadbhagavadgītā" header slide added before "atha prathamō'dhyāyaḥ" (#5)
- Countdown slide now shows "Start in" with the countdown number and "Listen to Śruti" at the bottom (#6)
- Folded hands GIF auto-displays on the projector after the first two shlokas of each chapter complete (#8)

### Changed
- Transport: back-arrow button replaced with "Restart Chapter" button — resets to page 0 of the current chapter (#7)
- Keyboard left-arrow now restarts the chapter (previously: navigate to previous page)
- `sh`-style entries (chapter sub-headers) now render as plain-text header pages rather than syllable-animated content

## [0.6.0] - 2026-05-03

### Fixed
- Pointer animation corrected
- x64 DMG detection fix in release script

### Added
- Release script builds both arm64 and x64 DMGs for every release
