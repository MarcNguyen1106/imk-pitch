// Writes out/edit-guide.md and out/script.txt from the beat table.
import fs from 'node:fs';
import {TIMELINE, fmtTime} from '../src/data/beats.ts';

const PIP = 'x 64, y 120, 512 × 288, radius 24, 3 px gold ring';
const CROP = 'source crop x 0–1040, y 60–645 (scale 0.492)';
let md = `# Edit guide: MKTG3007 Part 3 pitch\n\n30 fps · 1920 × 1080 · total ${fmtTime(TIMELINE.total)} (${TIMELINE.total} frames)\n\n`;
md += `| Beat | Start | End | Frames | Speaker mode | PIP |\n|---|---|---|---|---|---|\n`;
for (const b of TIMELINE.beats) {
	md += `| ${b.id} ${b.name} | ${fmtTime(b.start)} (${b.start}) | ${fmtTime(b.end)} (${b.end}) | ${b.end - b.start} | ${b.modeLabel} | ${b.mode === 'PIP' ? `${PIP}; ${CROP}; 24-frame spring in at start, back to full frame from ${fmtTime(b.end - 18)}` : '—'} |\n`;
}
md += `| End slate | ${fmtTime(TIMELINE.slateStart)} (${TIMELINE.slateStart}) | ${fmtTime(TIMELINE.total)} (${TIMELINE.total}) | ${TIMELINE.total - TIMELINE.slateStart} | full frame | — |\n\n`;
md += `## Rebuilding the PIP in CapCut\n\n1. Put your footage on the bottom track and \`overlays.mov\` above it.\n2. During B07 and B11 the overlay shows a full-frame map/road with a gold ring at ${PIP}. Duplicate your footage above the overlay for those beats, scale to 49.2 %, and position it so the face sits inside the ring (crop the source to ${CROP}).\n3. Ease the scale in over 0.8 s at the beat start and back out over 0.8 s at the end.\n\n`;
md += `## Clear moment\n\nAt "Can I count on your support?" (B12) every overlay and the HUD fade out over 12 frames. Captions stay for accessibility.\n`;
fs.writeFileSync('out/edit-guide.md', md);
const script = TIMELINE.beats.map((b) => `[${b.id} ${b.name} · ${fmtTime(b.start)}]\n${b.line.replace(/\*\*/g, '')}`).join('\n\n') + '\n';
fs.writeFileSync('out/script.txt', script);
console.log('written');
