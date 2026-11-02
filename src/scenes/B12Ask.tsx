// B12 Ask (FULL, then CLEAR): approve Phase 0; Jan-Mar 2027; a study, not a launch.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F, body, display} from '../theme';
import {clamp, cue, useEnterExit} from '../lib';
import {Eyebrow, Footnote, Gold, KeywordPop} from '../components/Panel';
import {Icon} from '../components/Icon';
import {BeatContent, CW, P, SceneProps} from './common';

const Seal: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const s = interpolate(t, [0, 10, 16], [1.5, 0.94, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const o = interpolate(t, [0, 4], [0, 1], clamp);
	const rot = interpolate(t, [0, 16], [-20, -8], clamp) + Math.max(0, t - 16) * 0.05;
	const teeth = 28;
	const pts: string[] = [];
	for (let i = 0; i < teeth * 2; i++) {
		const r = i % 2 ? 92 : 100;
		const a = (i / (teeth * 2)) * Math.PI * 2;
		pts.push(`${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`);
	}
	return (
		<svg width={200} height={200} viewBox="0 0 200 200" style={{opacity: o, transform: `scale(${s}) rotate(${rot}deg)`, overflow: 'visible'}}>
			<circle cx={100} cy={100} r={110} fill={C.gold} opacity={0.12} />
			<polygon points={pts.join(' ')} fill={C.gold} />
			<circle cx={100} cy={100} r={74} fill="none" stroke={C.roast} strokeWidth={3} strokeDasharray="3 6" />
			<path d="M64 102 L90 128 L138 74" fill="none" stroke={C.roast} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const B12Ask: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const approve = cue(beat, 'approve Phase Zero');
	const buyer = cue(beat, 'buyer study');
	const jan = cue(beat, 'from January');
	const study = cue(beat, 'a study, not a launch');
	const march = cue(beat, 'by March');
	const months = ['JAN', 'FEB', 'MAR'];
	return (
		<BeatContent beat={beat}>
			<Eyebrow style={{position: 'absolute', left: P, top: 52}}>The ask</Eyebrow>
			<div style={{position: 'absolute', left: P, top: 104, width: CW - 200, ...display(76), lineHeight: 1}}>
				{frame >= approve ? (
					<KeywordPop at={approve} swipe={false}>
						Approve <Gold>Phase 0</Gold>
					</KeywordPop>
				) : null}
			</div>
			<div style={{position: 'absolute', right: P - 10, top: 66}}>{frame >= approve + 6 ? <Seal at={approve + 6} /> : null}</div>
			<div style={{position: 'absolute', left: P, top: 280, width: CW, ...body(30, 600), ...ee(buyer)}}>
				Buyer study + first talks with Cooee
			</div>
			<div style={{position: 'absolute', left: P, top: 356, display: 'flex', alignItems: 'center', gap: 14}}>
				{months.map((m, i) => {
					const on = interpolate(frame, [jan + i * 12, jan + i * 12 + 8], [0, 1], clamp);
					return (
						<div
							key={m}
							style={{
								width: 116,
								height: 76,
								borderRadius: 14,
								border: `2px solid ${on > 0.5 ? C.gold : 'rgba(154,163,168,0.4)'}`,
								background: on > 0.5 ? 'rgba(242,169,59,0.18)' : 'transparent',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								opacity: frame >= jan - 6 ? 0.4 + 0.6 * on : 0,
								transform: `translateY(${(1 - on) * 6}px)`,
							}}
						>
							<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: on > 0.5 ? C.gold : C.cremaDim}}>{m}</div>
							<div style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>2027</div>
						</div>
					);
				})}
				<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.crema, marginLeft: 6, ...ee(march)}}>
					→ answer at <Gold>Gate 0</Gold>
				</div>
			</div>
			<div style={{position: 'absolute', left: P, top: 476, width: CW, display: 'flex', alignItems: 'center', gap: 22, ...ee(study)}}>
				<div style={{width: 92, height: 92, borderRadius: 46, background: 'rgba(242,169,59,0.14)', border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Icon name="flask" size={56} color={C.crema} />
				</div>
				<div style={{...display(40), whiteSpace: 'nowrap'}}>
					A study, <span style={{color: C.cremaDim}}>not a launch</span>
				</div>
				<div style={{opacity: 0.3}}>
					<Icon name="rocket" size={56} />
				</div>
			</div>
			<Footnote style={{position: 'absolute', left: P, top: 612, width: CW, ...ee(study + 16)}}>No capital before Gate 0</Footnote>
		</BeatContent>
	);
};
