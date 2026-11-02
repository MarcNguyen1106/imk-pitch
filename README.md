# MKTG3007 Part 3: elevator pitch motion graphics (Remotion)

Trung Nguyên Legend in Australia: a 12-month pilot in Sydney & Melbourne. 3-minute pitch animatic, overlay track and rehearsal prompter.

## Setup
```
npm install
```
Fonts load from Google Fonts at render time (Archivo, Be Vietnam Pro, JetBrains Mono).

## Renders
| Command | Output |
|---|---|
| `npm run render:animatic` | `out/animatic.mp4`: full film on a clean backdrop (your camera goes on the left) |
| `npm run render:overlays` | `out/overlays.mov`: ProRes 4444 with alpha, graphics + HUD + captions only |
| `npm run render:overlays-nocap` | `out/overlays_nocaptions.mov` |
| `npm run render:prompter` / `render:prompter-slow` | rehearsal prompter at 140 / 130 wpm |
| `npm run stills` | one PNG per panel state + `out/stills/contact-sheet.png` |
| `npm run guides` | `out/edit-guide.md`, `out/script.txt` |
| `npm run check-timing` | checks beat frames against the section 5 table |

The 8 GB laptop gets concurrency 2 and the 16 GB desktop gets 4; `remotion.config.ts` picks this automatically. Render stills before full videos.

## Structure
- `src/data/beats.ts`: script, keywords, modes, delivery cues; timing generator (140 wpm + pauses). `word-timings.json` takes real Whisper timestamps later.
- `src/data/facts.ts`: every on-screen number with its source; the charts read only from here.
- `src/scenes/B01…B13`: one file per beat. Animations are cued to spoken words (`cue(beat, 'phrase')`), not hard-coded frames.
- `src/components/`: HUD, captions, panel, charts, signage, map, emblem, product mock-ups.

## Recording
Frame yourself on the left half, mid-chest up. The animatic's left 54 % is left empty for you. In B07 and B11 the speaker shrinks to a picture-in-picture window; see `out/edit-guide.md`.
