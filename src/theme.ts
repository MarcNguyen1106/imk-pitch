// Design tokens: colour, type, spacing, motion (prompt section 4).
import {loadFont as loadVietnam} from '@remotion/google-fonts/BeVietnamPro';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadVariableFont as loadArchivoVar} from '@remotion/google-fonts/Archivo';

const vn = loadVietnam('normal', {
	weights: ['400', '500', '600', '700', '800'],
	subsets: ['latin', 'latin-ext', 'vietnamese'],
});
loadVietnam('italic', {weights: ['500'], subsets: ['latin', 'latin-ext', 'vietnamese']});
const mono = loadMono('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']});
loadArchivoVar('normal', {subsets: ['latin', 'latin-ext', 'vietnamese']});

export const C = {
	roast: '#120B08',
	espresso: '#24150F',
	espresso2: '#33201A',
	crema: '#F6E7D0',
	cremaDim: '#CDB89C',
	gold: '#F2A93B',
	goldHot: '#FFC965',
	robusta: '#E5533D',
	highland: '#3FA27A',
	steel: '#9AA3A8',
	harbour: '#17384A',
} as const;

export const F = {
	display: '"Archivo", sans-serif',
	text: `${vn.fontFamily}, sans-serif`,
	mono: `${mono.fontFamily}, monospace`,
};

// Archivo at 125 width, 900 weight: hero numbers.
export const hero = (size: number): React.CSSProperties => ({
	fontFamily: F.display,
	fontWeight: 900,
	fontStretch: '125%',
	fontSize: size,
	letterSpacing: '-0.02em',
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 0.92,
	color: C.crema,
});

// Archivo at 112 width, 800 weight: display headings.
export const display = (size: number): React.CSSProperties => ({
	fontFamily: F.display,
	fontWeight: 800,
	fontStretch: '112%',
	fontSize: size,
	letterSpacing: '-0.01em',
	lineHeight: 1.02,
	color: C.crema,
});

export const eyebrow: React.CSSProperties = {
	fontFamily: F.mono,
	fontWeight: 500,
	fontSize: 22,
	letterSpacing: '0.12em',
	textTransform: 'uppercase',
	color: C.gold,
};

export const body = (size = 32, weight = 500): React.CSSProperties => ({
	fontFamily: F.text,
	fontWeight: weight,
	fontSize: size,
	lineHeight: 1.3,
	color: C.crema,
});

export const sourceTag: React.CSSProperties = {
	fontFamily: F.mono,
	fontWeight: 500,
	fontSize: 22,
	color: C.cremaDim,
	letterSpacing: '0.02em',
};

export const footnote: React.CSSProperties = {
	fontFamily: F.text,
	fontWeight: 500,
	fontStyle: 'italic',
	fontSize: 23,
	lineHeight: 1.3,
	color: C.cremaDim,
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;

// Layout (section 4.4)
export const PANEL = {x: 1080, y: 116, w: 760, h: 772, r: 28, pad: 44};
export const SAFE_X = 1040; // speaker zone, left 54 %
export const PIP = {x: 64, y: 120, w: 512, h: 288, r: 24};
export const HUD_H = 56;

// Motion
export const SPRING = {damping: 14, mass: 0.6, stiffness: 120};
export const LEAD = 7; // frames an element starts before its word
