// 4P tab bar across the top of the panel (B06-B10); gold underline slides to the active tab.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, PANEL} from '../theme';
import {clamp, useTimeline} from '../lib';

export const TABS = ['PRODUCT', 'PLACE', 'PRICE', 'PROMOTION', 'PARTNER'];
const IDS = ['B06', 'B07', 'B08', 'B09', 'B10'];
const CHAR = 13.6;
const GAP = 34;

export const TabBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tl = useTimeline();
	const beats = IDS.map((id) => tl.beats.find((b) => b.id === id)!);
	const first = beats[0].start;
	const last = beats[4].end;
	if (frame < first - 2 || frame > last + 12) return null;
	const widths = TABS.map((t) => t.length * CHAR + t.length * 22 * 0.08);
	const xs: number[] = [];
	let acc = 0;
	widths.forEach((w) => {
		xs.push(acc);
		acc += w + GAP;
	});
	// active index slides with a spring between beats
	let pos = 0;
	let wNow = widths[0];
	beats.forEach((b, i) => {
		if (i === 0) return;
		const p = spring({frame: frame - b.start, fps, config: {damping: 18, mass: 0.6, stiffness: 140}});
		pos += (xs[i] - xs[i - 1]) * p;
		wNow += (widths[i] - widths[i - 1]) * p;
	});
	const active = beats.reduce((a, b, i) => (frame >= b.start - 4 ? i : a), 0);
	const enter = interpolate(frame, [first, first + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const exit = interpolate(frame, [last - 2, last + 10], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: PANEL.x + PANEL.pad, top: PANEL.y + 24, width: PANEL.w - 2 * PANEL.pad, height: 50, opacity: enter * (1 - exit), transform: `translateY(${(1 - enter) * -10}px)`}}>
			{TABS.map((t, i) => (
				<div
					key={t}
					style={{
						position: 'absolute',
						left: xs[i],
						top: 8,
						fontFamily: F.mono,
						fontWeight: i === active ? 700 : 500,
						fontSize: 22,
						letterSpacing: '0.08em',
						color: i === active ? (i === 4 ? C.highland : C.gold) : C.cremaDim,
						whiteSpace: 'nowrap',
					}}
				>
					{t}
				</div>
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: 46, height: 1, background: 'rgba(246,231,208,0.14)'}} />
			<div style={{position: 'absolute', left: pos, top: 44, width: wNow, height: 4, borderRadius: 2, background: active === 4 ? C.highland : C.gold}} />
		</div>
	);
};
