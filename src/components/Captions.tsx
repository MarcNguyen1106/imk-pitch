// Karaoke captions: bottom centre, max two lines of 52 characters, Be Vietnam Pro 600 / 40 px.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Beat, Word} from '../data/beats';
import {C, F} from '../theme';
import {clamp, useTimeline} from '../lib';

const MAX = 52;

export interface CaptionPage {
	lines: number[][]; // word indices
	first: number;
	last: number;
}

export const paginate = (words: Word[]): CaptionPage[] => {
	const pages: CaptionPage[] = [];
	let lines: number[][] = [[]];
	let len = 0;
	const flush = () => {
		const flat = lines.flat();
		if (flat.length) pages.push({lines: lines.filter((l) => l.length), first: flat[0], last: flat[flat.length - 1]});
		lines = [[]];
		len = 0;
	};
	words.forEach((w, i) => {
		const add = (len ? 1 : 0) + w.text.length;
		if (len + add > MAX) {
			if (lines.length === 2) flush();
			else {
				lines.push([]);
				len = 0;
			}
		}
		lines[lines.length - 1].push(i);
		len += (lines[lines.length - 1].length > 1 ? 1 : 0) + w.text.length;
		// Prefer to break pages at sentence ends once the second line has begun.
		const sentenceEnd = /[.?!]$/.test(w.text);
		const remaining = words.length - i - 1;
		if (sentenceEnd && lines.length === 2 && remaining > 0) flush();
	});
	flush();
	// Re-split each two-line page so the lines are balanced (no orphan words).
	return pages.map((pg) => {
		const idx = pg.lines.flat();
		if (pg.lines.length < 2) return pg;
		const len = (a: number[]) => a.reduce((n, i, k) => n + words[i].text.length + (k ? 1 : 0), 0);
		let best = pg.lines;
		let bestMax = Math.max(len(pg.lines[0]), len(pg.lines[1]));
		for (let cut = 1; cut < idx.length; cut++) {
			const a = idx.slice(0, cut);
			const b = idx.slice(cut);
			const m = Math.max(len(a), len(b));
			if (len(a) <= MAX && len(b) <= MAX && m < bestMax) {
				best = [a, b];
				bestMax = m;
			}
		}
		return {...pg, lines: best};
	});
};

export const Captions: React.FC<{opacity?: number}> = ({opacity = 1}) => {
	const frame = useCurrentFrame();
	const tl = useTimeline();
	const beat: Beat | undefined = tl.beats.find((b) => frame >= b.start && frame < b.end);
	if (!beat || opacity <= 0) return null;
	const pages = paginate(beat.words);
	let cur = -1;
	beat.words.forEach((w, i) => {
		if (frame >= w.frame) cur = i;
	});
	const pageIdx = Math.max(0, pages.findIndex((p) => cur >= p.first && cur <= p.last));
	const page = pages[cur < 0 ? 0 : pageIdx];
	const pageStart = beat.words[page.first].frame;
	const fadeIn = interpolate(frame, [pageStart - 3, pageStart + 3], [0, 1], clamp);
	const beatFade = interpolate(frame, [beat.start, beat.start + 4, beat.end - 4, beat.end], [0, 1, 1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, pointerEvents: 'none', opacity}}>
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,11,8,0) 0%, rgba(18,11,8,0.75) 62%, rgba(18,11,8,0.75) 100%)'}} />
			<div
				style={{
					position: 'absolute',
					left: 260,
					right: 260,
					bottom: 60,
					textAlign: 'center',
					fontFamily: F.text,
					fontWeight: 600,
					fontSize: 40,
					lineHeight: 1.3,
					opacity: Math.min(fadeIn, beatFade),
					textShadow: '0 2px 12px rgba(0,0,0,0.6)',
				}}
			>
				{page.lines.map((line, li) => (
					<div key={li}>
						{line.map((wi, k) => {
							const w = beat.words[wi];
							const spoken = wi < cur;
							const current = wi === cur;
							const color = w.keyword ? (current ? C.goldHot : C.gold) : current ? C.crema : C.cremaDim;
							const op = !spoken && !current && !w.keyword ? 0.78 : 1;
							return (
								<span key={wi} style={{color, opacity: op}}>
									{w.text}
									{k < line.length - 1 ? ' ' : ''}
								</span>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};
