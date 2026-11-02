// Script, timing, keywords, speaker mode and delivery cue per beat (prompt section 5).
// The spoken lines are final. **bold** marks keyword pops and gold caption words.
import wordTimings from './word-timings.json';

export type SpeakerMode = 'STRAP' | 'FULL' | 'PIP';

export interface BeatDef {
	id: string;
	name: string;
	section: number; // 0 HOOK, 1 EVIDENCE, 2 STRATEGY, 3 ROLL-OUT, 4 ASK
	pause: number; // seconds after speech
	mode: SpeakerMode;
	modeLabel: string;
	line: string;
	cue: string;
}

export const SECTIONS = ['HOOK', 'EVIDENCE', 'STRATEGY', 'ROLL-OUT', 'ASK'];

export const BEAT_DEFS: BeatDef[] = [
	{
		id: 'B01', name: 'Hook', section: 0, pause: 0.6, mode: 'STRAP', modeLabel: 'STRAP',
		line: "Hello, I'm **Nguyễn Lê Văn Đức**, and I'd like your support for a **twelve-month** coffee pilot in **Sydney and Melbourne**.",
		cue: 'Smile before speaking · eyes on the lens · open palms at chest height',
	},
	{
		id: 'B02', name: 'Opportunity', section: 0, pause: 0.8, mode: 'FULL', modeLabel: 'FULL',
		line: "Here's why now. **Nearly three in ten** surveyed Australians have swapped café coffee for **brewing at home**. Picture a **Melbourne kitchen**, a **phin** dripping beside the kettle. That's where **we can win**.",
		cue: 'Slow down on "Picture a Melbourne kitchen" · one hand drifts down like a drip · pause after "win"',
	},
	{
		id: 'B03', name: 'Score', section: 1, pause: 0.6, mode: 'FULL', modeLabel: 'FULL',
		line: "My **preliminary screening** scored Australia **3.5 out of 5**, **exactly on my threshold**. A **sensitivity test** shows any **one-point drop flips the verdict**, so the score can't decide. **Evidence must.**",
		cue: 'Steady, serious tone · small flat-hand gesture on "exactly on my threshold" · beat of silence, then "Evidence must." firmly',
	},
	{
		id: 'B04', name: 'Evidence', section: 1, pause: 0.4, mode: 'FULL', modeLabel: 'FULL',
		line: "So I gathered **primary data**. Vietnam's **import price per kilo** is low, but that mostly reflects **robusta**, not what shoppers think. In **forty-four public reviews** I coded, **taste** came up **twenty-four times**, Vietnamese identity **six**, the phin **once**.",
		cue: 'Lift energy on "primary data" · stress "twenty-four", "six", "once"',
	},
	{
		id: 'B05', name: 'Warnings', section: 1, pause: 0.8, mode: 'FULL', modeLabel: 'FULL',
		line: "My audits add **two warnings**: Trung Nguyên ground coffee already sells from **three dollars ten** per hundred grams, and our **'we are green'** claim names **no certification**.",
		cue: 'Lower, measured voice · two fingers on "two warnings" · full pause after this beat (the turn)',
	},
	{
		id: 'B06', name: 'Product', section: 2, pause: 0.4, mode: 'FULL', modeLabel: 'FULL',
		line: "So here's the **strategy**. **Product**: an **Australia-only Legend phin pack** for home brewers aged **eighteen to forty-four**, plus a **starter kit** with a phin and a **QR video**, because the **ritual must be taught**.",
		cue: 'Lean in on "So here\'s the strategy" · brighter tone from here',
	},
	{
		id: 'B07', name: 'Place', section: 2, pause: 0.4, mode: 'PIP', modeLabel: 'PIP',
		line: "**Place**: one **exclusive distributor** for **New South Wales and Victoria**, plus our own **Amazon store**, with **trademarks filed first**. Supermarkets wait until **Gate 1**. **Lavazza** did the same here: **distributor first, ownership later**.",
		cue: 'Hand sweeps left to right on "distributor first, ownership later"',
	},
	{
		id: 'B08', name: 'Price', section: 2, pause: 0.4, mode: 'FULL', modeLabel: 'FULL',
		line: "**Price**: **value-based**, at **fifteen ninety-nine** for 250 grams, about **ninety-six cents a serve**. That's above **nine of thirteen** supermarket blends but below **Campos**: **upper-mainstream**, set against **real shelf prices**.",
		cue: 'Say the numbers slowly · pause after "a serve"',
	},
	{
		id: 'B09', name: 'Promotion', section: 2, pause: 0.4, mode: 'FULL', modeLabel: 'FULL',
		line: "**Promotion**: **no unproven slogans**. We test a **heritage claim** against a **taste claim** with **two hundred buyers**, plus a **blind-versus-branded tasting**. Then **phin demonstrations** drive trial.",
		cue: 'Stress "test" · brief smile on "no unproven slogans"',
	},
	{
		id: 'B10', name: 'Partner', section: 2, pause: 0.8, mode: 'FULL', modeLabel: 'FULL (highland accent)',
		line: "Our proposed partner is **Cooee Foods Australia**, led by **Wiradjuri** founder **Terri-Anne Daniel**. We **start small**: Cooee's own **wattleseed cookie** beside our pack. Cooee **sets its price**, is **paid within fourteen days** and can **withdraw anytime**. **We begin by listening.**",
		cue: 'Slower and warmer · say the names carefully · pause before "We begin by listening."',
	},
	{
		id: 'B11', name: 'Roll-out', section: 3, pause: 0.8, mode: 'PIP', modeLabel: 'PIP',
		line: "How does it unfold? Three **go/no-go gates**. **March 2027**: capital moves only if buyers **accept our price**, Cooee **consents** and **certified stock** is ready. **September**: **sell-through** and **repeat buying** unlock the supermarkets. **March 2028**: **margin** decides **scale, adjust or exit**.",
		cue: 'Count the gates on your fingers · firm, even tone on "scale, adjust or exit"',
	},
	{
		id: 'B12', name: 'Ask', section: 4, pause: 0.5, mode: 'FULL', modeLabel: 'FULL, then CLEAR',
		line: "So my ask is simple: **approve Phase Zero**, the **buyer study** and first talks with Cooee, **from January**. It costs **a study, not a launch**, and **by March** we'll know. Can I count on your support?",
		cue: 'Look straight into the lens · rising tone on the question · hold eye contact and smile for 2 seconds',
	},
	{
		id: 'B13', name: 'Close', section: 4, pause: 0.5, mode: 'STRAP', modeLabel: 'STRAP',
		line: 'Thank you.',
		cue: 'Small nod · stay still for 1 second',
	},
];

export const END_SLATE_SECONDS = 2.0;

export interface Word {
	text: string; // as spoken, with punctuation (captions)
	norm: string; // lower-case, no punctuation (cue lookup)
	keyword: boolean;
	frame: number; // absolute frame the word starts
}

export interface Beat extends BeatDef {
	index: number;
	start: number;
	speakEnd: number;
	end: number;
	words: Word[];
}

export interface Timeline {
	fps: number;
	wpm: number;
	beats: Beat[];
	slateStart: number;
	total: number;
}

const norm = (s: string) =>
	s
		.toLowerCase()
		.replace(/[’']/g, "'")
		.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

export const parseLine = (line: string): Omit<Word, 'frame'>[] => {
	let inKw = false;
	return line
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => {
			const parts = token.split('**');
			let state = inKw;
			let keyword = false;
			parts.forEach((seg, i) => {
				if (/[\p{L}\p{N}]/u.test(seg) && state) keyword = true;
				if (i < parts.length - 1) state = !state;
			});
			inKw = state;
			const text = token.replace(/\*\*/g, '');
			return {text, norm: norm(text), keyword};
		});
};

// Real word timestamps (section 9) are written to word-timings.json as
// {"B01": [startSeconds, ...], ...}. When present they replace the even spread.
type Timings = Record<string, {start: number; speakEnd: number; end: number; words: number[]}>;

export const buildTimeline = (wpm = 140, fps = 30, useRealTimings = true): Timeline => {
	const real = (useRealTimings ? (wordTimings as unknown as Timings) : {}) ?? {};
	let t = 0;
	const beats: Beat[] = BEAT_DEFS.map((def, index) => {
		const parsed = parseLine(def.line);
		const n = parsed.length;
		const r = real[def.id];
		if (r && r.words.length === n) {
			const start = Math.round(r.start * fps);
			const speakEnd = Math.round(r.speakEnd * fps);
			const end = Math.round(r.end * fps);
			t = r.end;
			return {
				...def, index, start, speakEnd, end,
				words: parsed.map((w, i) => ({...w, frame: r.words[i] * fps})),
			};
		}
		const speak = (n * 60) / wpm;
		const start = Math.round(t * fps);
		const speakEnd = Math.round((t + speak) * fps);
		const words = parsed.map((w, i) => ({...w, frame: start + (i / n) * (speakEnd - start)}));
		t += speak + def.pause;
		const end = Math.round(t * fps);
		return {...def, index, start, speakEnd, end, words};
	});
	const slateStart = Math.round(t * fps);
	return {fps, wpm, beats, slateStart, total: slateStart + Math.round(END_SLATE_SECONDS * fps)};
};

export const TIMELINE = buildTimeline(140);

export const beatById = (tl: Timeline, id: string): Beat => {
	const b = tl.beats.find((x) => x.id === id);
	if (!b) throw new Error(`Unknown beat ${id}`);
	return b;
};

// Index of the first word of `phrase` inside a beat (optionally the nth match).
export const wordIndex = (beat: Beat, phrase: string, nth = 0): number => {
	const target = phrase.split(/\s+/).map(norm);
	let found = -1;
	let count = 0;
	for (let i = 0; i <= beat.words.length - target.length; i++) {
		if (target.every((tw, j) => beat.words[i + j].norm === tw)) {
			if (count === nth) {
				found = i;
				break;
			}
			count++;
		}
	}
	if (found < 0) throw new Error(`Cue "${phrase}" not found in ${beat.id}`);
	return found;
};

export const fmtTime = (frames: number, fps = 30) => {
	const s = frames / fps;
	const m = Math.floor(s / 60);
	return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`;
};
