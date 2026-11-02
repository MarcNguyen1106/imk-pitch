// Midpoint frame of every panel state, using the same word cues as the scenes. Writes out/states.json.
import fs from 'node:fs';
import {TIMELINE, beatById, wordIndex} from '../src/data/beats.ts';

const LEAD = 7;
const at = (id: string, phrase: string) => {
	const b = beatById(TIMELINE, id);
	return Math.round(b.words[wordIndex(b, phrase)].frame - LEAD);
};
const B = (id: string) => beatById(TIMELINE, id);
// [name, from, to] — absolute frames; still at the midpoint (biased late so animations have landed)
const S: [string, number, number][] = [
	['B01_hook', B('B01').start + 90, B('B01').end],
	['B02_A_29pct', at('B02', 'three in ten') + 20, at('B02', 'Picture')],
	['B02_B_kitchen', at('B02', 'Picture'), B('B02').end - 10],
	['B03_A_gauge', B('B03').start + 70, at('B03', 'sensitivity')],
	['B03_B_tornado', at('B03', 'flips') + 10, at('B03', 'Evidence')],
	['B03_C_gates', at('B03', 'Evidence') + 20, B('B03').end - 6],
	['B04_A_chips', at('B04', 'primary data') + 14, at('B04', 'import price')],
	['B04_B_import', at('B04', 'think.') + 10, at('B04', 'forty-four')],
	['B04_C_themes', at('B04', 'once.') + 6, B('B04').end - 4],
	['B05_0_two', at('B05', 'two warnings') + 20, at('B05', 'three dollars ten')],
	['B05_A_shelf', at('B05', 'three dollars ten') + 50, at('B05', "'we are green'")],
	['B05_B_claims', at('B05', 'no certification') + 20, B('B05').speakEnd - 4],
	['B05_handoff', B('B05').end - 4, B('B05').end - 2],
	['B06_A_rings', B('B06').start + 30, at('B06', 'Australia-only')],
	['B06_B_pack', at('B06', 'QR video') + 10, at('B06', 'ritual')],
	['B06_C_ritual', at('B06', 'ritual') + 40, B('B06').end - 6],
	['B07_A_map', at('B07', 'Victoria') + 20, at('B07', 'Supermarkets')],
	['B07_A2_gate1', at('B07', 'Supermarkets') + 30, at('B07', 'Lavazza')],
	['B07_B_lavazza', at('B07', 'ownership later') + 10, B('B07').end - 10],
	['B08_A_tag', at('B08', 'ninety-six cents') + 30, at('B08', 'nine of thirteen')],
	['B08_B_ladder', at('B08', 'real shelf prices') + 10, B('B08').end - 4],
	['B09_A_slogan', at('B09', 'We test'), at('B09', 'heritage claim')],
	['B09_B_ab', at('B09', 'two hundred buyers') + 30, at('B09', 'blind-versus-branded')],
	['B09_C_blind', at('B09', 'blind-versus-branded') + 30, at('B09', 'demonstrations')],
	['B09_D_demos', at('B09', 'demonstrations') + 30, B('B09').end - 4],
	['B10_A_cooee', at('B10', 'Terri-Anne Daniel') + 40, at('B10', 'start small')],
	['B10_B_depth', at('B10', 'wattleseed cookie') + 40, at('B10', 'sets its price')],
	['B10_C_terms', at('B10', 'withdraw anytime') + 46, at('B10', 'We begin by listening.')],
	['B10_D_listen', at('B10', 'We begin by listening.') + 30, B('B10').end - 4],
	['B11_A_phase0', at('B11', 'go/no-go gates') + 26, at('B11', 'March 2027')],
	['B11_B_gate0', at('B11', 'ready.') + 30, at('B11', 'September')],
	['B11_C_gate1', at('B11', 'unlock') + 24, at('B11', 'March 2028')],
	['B11_D_gate2', at('B11', 'exit.') + 14, B('B11').end - 8],
	['B12_A_ask', at('B12', 'by March') + 20, at('B12', 'Can')],
	['B12_B_clear', at('B12', 'Can') + 20, B('B12').end],
	['B13_close', B('B13').start + 24, B('B13').end],
	['END_slate', TIMELINE.slateStart + 40, TIMELINE.total],
];
const jobs = S.map(([name, a, b], i) => ({name: `${String(i + 1).padStart(2, '0')}_${name}`, frame: Math.min(b - 1, Math.round(a + (b - a) * 0.5))}));
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/states.json', JSON.stringify(jobs, null, 1));
console.log(jobs.map((j) => `${j.name}@${j.frame}`).join('\n'));
