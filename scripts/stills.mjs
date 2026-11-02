// Render one PNG at the midpoint of every panel state (or given frames), plus a contact sheet.
// Usage: node scripts/stills.mjs [frame frame ...]   (no args = every state in scripts/states.json)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, ensureBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'out', 'stills');
fs.mkdirSync(outDir, {recursive: true});

const browserExecutable = process.env.REMOTION_CHROME ?? (fs.existsSync('/opt/pw-browsers') ? findShell() : null);
function findShell() {
	try {
		return execSync("ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell | head -1").toString().trim() || null;
	} catch {
		return null;
	}
}

const args = process.argv.slice(2);
const comp = process.env.COMP ?? 'Stills';
let jobs;
if (args.length) {
	jobs = args.map((f) => ({frame: Number(f), name: `f${String(f).padStart(5, '0')}`}));
} else {
	jobs = JSON.parse(fs.readFileSync(path.join(root, 'out', 'states.json'), 'utf8'));
}

const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), webpackOverride: (c) => c});
if (!browserExecutable) await ensureBrowser();
const composition = await selectComposition({serveUrl, id: comp, inputProps: {}, browserExecutable});
for (const j of jobs) {
	const output = path.join(outDir, `${j.name}.png`);
	await renderStill({composition, serveUrl, frame: j.frame, output, browserExecutable, inputProps: {}, overwrite: true});
	console.log('still', j.frame, output);
}
