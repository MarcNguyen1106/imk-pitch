// Rehearsal prompter: 3-2-1 countdown, script scrolling at the section 5 timing, delivery cues in gold.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {buildTimeline} from './data/beats';
import {C, F} from './theme';
import {clamp} from './lib';

const COUNTDOWN = 90;
const CHARS = 44;
const LINE_H = 90;
const CUE_H = 64;
const GAP = 46;
const ANCHOR_Y = 330; // current line sits on the upper third

interface Line {
	kind: 'cue' | 'text';
	y: number;
	text?: string;
	beat: number;
	words?: number[]; // word indices within the beat
}

export const Prompter: React.FC<{wpm: number}> = ({wpm}) => {
	const raw = useCurrentFrame();
	const tl = useMemo(() => buildTimeline(wpm, 30, false), [wpm]);
	const frame = raw - COUNTDOWN;

	const lines = useMemo(() => {
		const out: Line[] = [];
		let y = 0;
		tl.beats.forEach((b, bi) => {
			const cueText = `${b.id} · ${b.cue}`;
			out.push({kind: 'cue', y, text: cueText, beat: bi});
			y += CUE_H + Math.floor(cueText.length / 92) * 36;
			let cur: number[] = [];
			let len = 0;
			b.words.forEach((w, i) => {
				if (len + w.text.length + 1 > CHARS && cur.length) {
					out.push({kind: 'text', y, beat: bi, words: cur});
					y += LINE_H;
					cur = [];
					len = 0;
				}
				cur.push(i);
				len += w.text.length + 1;
			});
			if (cur.length) {
				out.push({kind: 'text', y, beat: bi, words: cur});
				y += LINE_H;
			}
			y += GAP;
		});
		return out;
	}, [tl]);

	// scroll: interpolate the y of the line holding the current word
	const textLines = lines.filter((l) => l.kind === 'text');
	const lineStart = (l: Line) => tl.beats[l.beat].words[l.words![0]].frame;
	let scrollY = textLines[0].y;
	for (let i = 0; i < textLines.length; i++) {
		const a = textLines[i];
		const next = textLines[i + 1];
		const fa = lineStart(a);
		if (frame >= fa) {
			if (next) {
				const fb = lineStart(next);
				scrollY = interpolate(frame, [fb - 10, fb], [a.y, next.y], clamp);
			} else scrollY = a.y;
		}
	}
	const words = tl.beats.flatMap((b, bi) => b.words.map((w, wi) => ({bi, wi, f: w.frame})));
	let curIdx = -1;
	words.forEach((w, i) => {
		if (frame >= w.f) curIdx = i;
	});
	const cur = curIdx >= 0 ? words[curIdx] : {bi: -1, wi: -1};

	const scaleMax = Math.max(tl.total, 180 * 30) + 10 * 30;
	const tSec = Math.max(0, frame) / 30;
	const mm = Math.floor(tSec / 60);
	const ss = Math.floor(tSec % 60);

	return (
		<AbsoluteFill style={{background: C.roast}}>
			{frame < 0 ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
					<div style={{fontFamily: F.display, fontWeight: 900, fontStretch: '125%', fontSize: 320, color: C.gold, transform: `scale(${interpolate((raw % 30) / 30, [0, 1], [1.15, 0.95])})`}}>
						{3 - Math.floor(raw / 30)}
					</div>
					<div style={{fontFamily: F.mono, fontSize: 28, color: C.cremaDim, letterSpacing: '0.2em', marginTop: 20}}>EYES ON THE LENS · {wpm} WPM</div>
				</AbsoluteFill>
			) : (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: ANCHOR_Y, height: LINE_H, background: 'rgba(242,169,59,0.07)', borderTop: '1px solid rgba(242,169,59,0.25)', borderBottom: '1px solid rgba(242,169,59,0.25)'}} />
					<div style={{position: 'absolute', left: 160, width: 1600, top: ANCHOR_Y - scrollY}}>
						{lines.map((l, i) => {
							const dist = Math.abs(l.y - scrollY);
							if (dist > 1100) return null;
							if (l.kind === 'cue')
								return (
									<div key={i} style={{position: 'absolute', top: l.y + 14, fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: '36px', color: C.gold, letterSpacing: '0.04em', width: 1600}}>
										▸ {l.text}
									</div>
								);
							return (
								<div key={i} style={{position: 'absolute', top: l.y, fontFamily: F.text, fontWeight: 600, fontSize: 64, lineHeight: `${LINE_H}px`, whiteSpace: 'nowrap'}}>
									{l.words!.map((wi, k) => {
										const w = tl.beats[l.beat].words[wi];
										const spoken = l.beat < cur.bi || (l.beat === cur.bi && wi < cur.wi);
										const now = l.beat === cur.bi && wi === cur.wi;
										return (
											<span key={wi} style={{color: now ? C.goldHot : spoken ? 'rgba(205,184,156,0.45)' : C.crema}}>
												{w.text}
												{k < l.words!.length - 1 ? ' ' : ''}
											</span>
										);
									})}
								</div>
							);
						})}
					</div>
					{/* fade top & bottom */}
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 200, background: `linear-gradient(${C.roast}, rgba(18,11,8,0))`}} />
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: `linear-gradient(rgba(18,11,8,0), ${C.roast})`}} />
				</>
			)}
			{/* progress bar with a red marker at 3:00 */}
			<div style={{position: 'absolute', left: 160, right: 160, bottom: 70, height: 8, borderRadius: 4, background: 'rgba(154,163,168,0.25)'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(Math.max(0, frame) / scaleMax) * 100}%`, background: C.gold, borderRadius: 4}} />
				<div style={{position: 'absolute', left: `${((180 * 30) / scaleMax) * 100}%`, top: -14, width: 4, height: 36, background: C.robusta}} />
				<div style={{position: 'absolute', left: `${((180 * 30) / scaleMax) * 100}%`, top: 26, transform: 'translateX(-50%)', fontFamily: F.mono, fontSize: 22, color: C.robusta}}>3:00</div>
			</div>
			<div style={{position: 'absolute', right: 160, bottom: 100, fontFamily: F.mono, fontSize: 30, color: C.crema}}>
				{mm}:{String(ss).padStart(2, '0')}
			</div>
		</AbsoluteFill>
	);
};
