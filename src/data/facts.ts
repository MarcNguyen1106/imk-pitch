// Every number shown on screen, with its source tag (prompt section 6).
// Charts are drawn to scale from these values only.

export const SRC = {
	canstar: 'Canstar 2026',
	part1: 'Part 1 scorecard',
	n1: 'Part 2, Table N1',
	wits: 'WITS 2024',
	dcn: 'Daily Coffee News 2026',
	appA: 'Part 2, Appendix A',
	appE: 'Part 2, Appendix E',
	appD: 'Part 2, Appendix D',
	appF: 'Part 2, Appendix F',
	clorox: 'Torcasio, Vise & Jones 2025',
	accc: 'ACCC 2023a',
};

export const homeBrew = {pct: 29, respondents: 'over 2,100', source: 'Canstar 2026'};

export const score = {value: 3.5, threshold: 3.5, max: 5};

export interface Factor {
	name: string;
	weight: number; // %
	score: number;
	minus: number;
	plus: number | null; // null = n/a (already 5)
}

export const factors: Factor[] = [
	{name: 'Market size', weight: 20, score: 4, minus: 3.3, plus: 3.7},
	{name: 'Market access', weight: 15, score: 5, minus: 3.35, plus: null},
	{name: 'Competitive intensity', weight: 15, score: 2, minus: 3.35, plus: 3.65},
	{name: 'Cultural fit', weight: 15, score: 3, minus: 3.35, plus: 3.65},
	{name: 'Purchasing power', weight: 10, score: 4, minus: 3.4, plus: 3.6},
	{name: 'Regulatory burden', weight: 10, score: 3, minus: 3.4, plus: 3.6},
	{name: 'Channel & digital', weight: 10, score: 4, minus: 3.4, plus: 3.6},
	{name: 'Firm ESG readiness', weight: 5, score: 2, minus: 3.45, plus: 3.55},
];

// Sanity check: weighted score must equal 3.50 and every -1 total must be weight-consistent.
const total = factors.reduce((s, f) => s + (f.weight / 100) * f.score, 0);
if (Math.abs(total - 3.5) > 1e-9) throw new Error(`Scorecard total ${total} != 3.50`);
factors.forEach((f) => {
	if (Math.abs(3.5 - f.weight / 100 - f.minus) > 1e-9) throw new Error(`Sensitivity mismatch ${f.name}`);
});

export const importPrice = {
	year: 2023,
	vietnam: 2.58,
	allOrigins: 4.64,
	unit: 'US$/kg',
};

export const robustaShare = 97; // ≈ %, 31.4m bags robusta vs 1.1m arabica (forecast)

export const primaryData = {listings: 21, comments: 44};

export const themes = [
	{label: 'Taste', n: 24, pct: 55},
	{label: 'Vietnamese identity', n: 6, pct: 14},
	{label: 'Phin', n: 1, pct: 2},
];
export const themeN = 44;

export const tnOnShelf = {listings: 7, low: 3.1, high: 6.0};

export const clorox = 'A$8.25m';

export const vietnamBorn = '326,630';

export const shares = {woolworths: 38, coles: 29};

export const distributorCost = 2.6;

export const shelf = {price: 15.99, grams: 250, per100: 6.4, bandLow: 6.0, bandHigh: 6.8, priceLow: 14.99, priceHigh: 16.99};
if (Math.abs((shelf.price / shelf.grams) * 100 - shelf.per100) > 0.01) throw new Error('unit price');

// Supermarket price ladder, A$ per 100 g, 13 listings (Part 2, Table D1).
export const ladder: {v: number; label: string}[] = [
	{v: 1.8, label: 'ALDI Lazzio'},
	{v: 2.2, label: 'ALDI Lazzio'},
	{v: 3.0, label: 'Lavazza Intenso (special)'},
	{v: 3.9, label: 'Vittoria Espresso (special)'},
	{v: 4.2, label: 'Vittoria Oro'},
	{v: 4.4, label: 'Lavazza Napoli (special)'},
	{v: 4.6, label: 'Grinders Crema 1 kg'},
	{v: 5.6, label: 'Vittoria Espresso 1 kg'},
	{v: 5.75, label: 'Grinders Espresso (special)'},
	{v: 6.0, label: 'Daley Street'},
	{v: 6.5, label: 'Vittoria Espresso 500 g'},
	{v: 7.0, label: 'Grinders Crema 200 g'},
	{v: 8.8, label: 'Campos'},
];
export const belowBand = ladder.filter((d) => d.v < shelf.bandLow).length; // 9
if (belowBand !== 9 || ladder.length !== 13) throw new Error('ladder');

export const perServe = [
	{label: 'Lazzio', v: 0.33, ours: false},
	{label: 'Vittoria', v: 0.84, ours: false},
	{label: 'Legend', v: 0.96, ours: true},
	{label: 'Campos', v: 1.32, ours: false},
];

export const partnerScreen = [
	{label: 'Cooee', v: 4.5, ours: true},
	{label: 'Warndu', v: 3.35, ours: false},
	{label: 'DHUWA Coffee', v: 2.8, ours: false},
];

export const study = {survey: 200, perCity: 100, nonHeritage: 120, tasting: 60};

// Geography
export const GEO = {
	buonMaThuot: [108.04, 12.67] as [number, number],
	sydney: [151.21, -33.87] as [number, number],
	melbourne: [144.96, -37.81] as [number, number],
};
