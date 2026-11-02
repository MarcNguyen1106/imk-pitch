// Thin top HUD: emblem (left), 5-segment progress rail (centre), timecode (right).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SECTIONS} from '../data/beats';
import {C, F} from '../theme';
import {clamp, useTimeline} from '../lib';
import {Emblem} from './Emblem';

export const HUD_Y = 40;

export const Hud: React.FC<{opacity: number; slide: number; emblemPop?: number}> = ({opacity, slide, emblemPop = 1}) => {
	const frame = useCurrentFrame();
	const tl = useTimeline();
	if (opacity <= 0.001) return null;
	const secRanges = SECTIONS.map((_, si) => {
		const bs = tl.beats.filter((b) => b.section === si);
		return [bs[0].start, bs[bs.length - 1].end];
	});
	const t = frame / tl.fps;
	const mm = Math.floor(t / 60);
	const ss = Math.floor(t % 60);
	const segW = 168;
	const gap = 14;
	const railW = SECTIONS.length * segW + (SECTIONS.length - 1) * gap;
	return (
		<div style={{position: 'absolute', left: 96, top: HUD_Y, width: 1728, height: 56, opacity, transform: `translateY(${(1 - slide) * -30}px)`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(18,11,8,0.7)', border: '1px solid rgba(246,231,208,0.08)'}} />
			<div style={{position: 'absolute', left: 18, top: 5, transform: `scale(${emblemPop})`, transformOrigin: '50% 50%'}}>
				<Emblem size={33} static />
			</div>
			<div style={{position: 'absolute', left: 64, top: 15, fontFamily: F.mono, fontSize: 22, color: C.cremaDim, letterSpacing: '0.1em'}}>PITCH</div>
			<div style={{position: 'absolute', left: (1728 - railW) / 2, top: 0, width: railW, height: 56, display: 'flex', gap}}>
				{SECTIONS.map((s, i) => {
					const [a, b] = secRanges[i];
					const p = interpolate(frame, [a, b], [0, 1], clamp);
					const active = frame >= a && frame < b;
					return (
						<div key={s} style={{position: 'relative', width: segW, height: 56}}>
							<div
								style={{
									position: 'absolute',
									left: 0,
									top: 9,
									fontFamily: F.mono,
									fontWeight: 500,
									fontSize: 22,
									letterSpacing: '0.1em',
									color: active ? C.gold : p >= 1 ? C.crema : C.cremaDim,
								}}
							>
								{s}
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 9, height: 4, borderRadius: 2, background: 'rgba(154,163,168,0.28)'}} />
							<div style={{position: 'absolute', left: 0, bottom: 9, height: 4, borderRadius: 2, width: `${p * 100}%`, background: C.gold, boxShadow: active ? `0 0 10px ${C.gold}` : undefined}} />
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', right: 20, top: 14, fontFamily: F.mono, fontSize: 22, color: C.crema, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em'}}>
				{mm}:{String(ss).padStart(2, '0')}
				<span style={{color: C.cremaDim}}> / 3:00</span>
			</div>
		</div>
	);
};
