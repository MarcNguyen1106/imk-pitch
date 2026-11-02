// B03 Score (FULL): gauge lands exactly on the 3.50 threshold; tornado shows any -1 flips it; score != decision.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {factors, score, SRC} from '../data/facts';
import {C, display, hero} from '../theme';
import {clamp, cue, durLocal, stateStyle} from '../lib';
import {Counter, Eyebrow, Footnote, KeywordPop, SourceTag} from '../components/Panel';
import {Gauge, Tornado} from '../components/Charts';
import {BeatContent, CW, P, SceneProps} from './common';

export const B03Score: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const end = durLocal(beat);
	const gAt = 8;
	const exactly = cue(beat, 'exactly');
	const sens = cue(beat, 'sensitivity');
	const flips = cue(beat, 'flips');
	const evidence = cue(beat, 'Evidence');
	// gauge group moves up and shrinks for state B
	const m = interpolate(frame, [sens, sens + 18], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const gScale = 1 - m * 0.58;
	const gx = P + 20 * (1 - m) - 6 * m;
	const gy = 96 - m * 8;
	const dim = interpolate(frame, [evidence, evidence + 10], [1, 0.2], clamp);
	const cover = interpolate(frame, [evidence, evidence + 10], [0, 1], clamp);
	const s1 = interpolate(frame, [evidence, evidence + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s2 = interpolate(frame, [evidence + 12, evidence + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<BeatContent beat={beat}>
			<div style={{opacity: dim}}>
				<div style={stateStyle(frame, 0, sens, true)}>
					<Eyebrow style={{position: 'absolute', left: P, top: 44}}>Preliminary screening · Part 1</Eyebrow>
				</div>
				<div style={stateStyle(frame, sens, end + 30)}>
					<Eyebrow style={{position: 'absolute', left: P, top: 44}}>One-point sensitivity</Eyebrow>
				</div>
				<div style={{position: 'absolute', left: gx, top: gy, transform: `scale(${gScale})`, transformOrigin: '0 0'}}>
					<Gauge at={gAt} value={score.value} threshold={score.threshold} labelOpacity={1 - m} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: P + 20 + m * 210,
						top: 404 - m * 282,
						width: 520,
						textAlign: m > 0.5 ? 'left' : 'center',
						transform: `scale(${1 - m * 0.42})`,
						transformOrigin: m > 0.5 ? '0 0' : '50% 0',
						whiteSpace: 'nowrap',
						...hero(130),
						opacity: interpolate(frame, [gAt + 20, gAt + 30], [0, 1], clamp),
					}}
				>
					<Counter to={3.5} at={gAt + 18} len={34} decimals={2} style={{color: C.gold}} />
					<span style={{fontSize: 72, color: C.cremaDim}}> / 5</span>
				</div>
				{/* "exactly on threshold" callout, state A */}
				<div style={{...stateStyle(frame, exactly, sens)}}>
					<div style={{position: 'absolute', left: P, top: 590, width: CW, textAlign: 'center', ...display(40), color: C.crema}}>
						<KeywordPop at={exactly}>exactly on the threshold</KeywordPop>
					</div>
				</div>
				{/* state B: tornado */}
				{frame >= sens ? (
					<div style={{position: 'absolute', left: P, top: 262, opacity: interpolate(frame, [sens, sens + 8], [0, 1], clamp)}}>
						<Tornado at={sens + 6} rows={factors} width={CW} rowH={40} labelW={282} />
					</div>
				) : null}
				{frame >= flips ? (
					<Footnote style={{position: 'absolute', left: P, top: 652, width: CW + 20, fontSize: 22, opacity: interpolate(frame, [flips, flips + 8], [0, 1], clamp)}}>
						Every one-point drop falls below 3.50 · ESG weighted only 5%
					</Footnote>
				) : null}
				<SourceTag>{frame < sens ? SRC.part1 : `${SRC.part1}; ${SRC.n1}`}</SourceTag>
			</div>
			{/* state C */}
			{frame >= evidence ? (
				<>
					<div style={{position: 'absolute', left: 24, right: 24, top: 200, height: 330, borderRadius: 22, background: 'rgba(18,11,8,0.86)', border: '1px solid rgba(242,169,59,0.25)', opacity: cover}} />
					<div style={{position: 'absolute', left: P, top: 250, width: CW, textAlign: 'center'}}>
						<div style={{...display(54), whiteSpace: 'nowrap', opacity: s1, transform: `translateY(${(1 - s1) * 16}px)`}}>
							SCORE <span style={{color: C.robusta}}>≠</span> DECISION
						</div>
						<div style={{...display(54), color: C.gold, marginTop: 34, opacity: s2, transform: `translateY(${(1 - s2) * 16}px)`}}>
							GATES + EVIDENCE
							<br />
							<KeywordPop at={evidence + 12}>DECIDE</KeywordPop>
						</div>
					</div>
				</>
			) : null}
		</BeatContent>
	);
};
