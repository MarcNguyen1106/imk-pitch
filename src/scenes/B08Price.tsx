// B08 Price (FULL): A$15.99 shelf tag, cost per 15 g serve, then the supermarket price ladder.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {belowBand, ladder, perServe, shelf} from '../data/facts';
import {C, F, display, hero} from '../theme';
import {clamp, cue, durLocal, useEnterExit} from '../lib';
import {Counter, Eyebrow, Footnote, KeywordPop, SourceTag} from '../components/Panel';
import {PriceLadder, ServeChips, ShelfTag, ladderX} from '../components/Charts';
import {BeatContent, CW, P, SceneProps} from './common';

export const B08Price: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const fifteen = cue(beat, 'fifteen ninety-nine');
	const cents = cue(beat, 'ninety-six cents');
	const nine = cue(beat, 'nine of thirteen');
	const campos = cue(beat, 'Campos');
	const upper = cue(beat, 'upper-mainstream');
	const real = cue(beat, 'real shelf prices');
	const tagDrop = interpolate(frame, [fifteen, fifteen + 16], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
	const m = interpolate(frame, [nine, nine + 18], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const ladderTop = 376;
	const lx = (v: number) => P + ladderX(v, CW);
	return (
		<BeatContent beat={beat}>
			<Eyebrow style={{position: 'absolute', left: P, top: 96, opacity: 1 - m}}>Shelf price · value-based</Eyebrow>
			<Eyebrow style={{position: 'absolute', left: P, top: 96, opacity: m}}>Against real shelf prices</Eyebrow>
			{/* tag: drops in, then shrinks to the top-left */}
			<div
				style={{
					position: 'absolute',
					left: P + (CW - 460) / 2 - m * ((CW - 460) / 2),
					top: 150 - (1 - tagDrop) * 140,
					opacity: Math.min(1, tagDrop * 2),
					transform: `scale(${1 - m * 0.5}) rotate(${(1 - tagDrop) * -6}deg)`,
					transformOrigin: '0 0',
				}}
			>
				<ShelfTag at={fifteen} />
			</div>
			{/* per-serve chips: full, then compact under the tag */}
			<div style={{position: 'absolute', left: P, top: 440 - m * 152, width: CW, opacity: frame >= cents ? 1 : 0}}>
				<div style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim, marginBottom: 10, height: 28 * (1 - m), opacity: 1 - m, overflow: 'hidden'}}>Cost per serve · 15 g serve (assumed)</div>
				<ServeChips at={cents} items={perServe} width={CW} compact={m > 0.5} />
			</div>
			{/* 9 of 13 counter, top-right in state B */}
			{frame >= nine ? (
				<div style={{position: 'absolute', left: P + 260, top: 150, width: CW - 260, textAlign: 'right', opacity: m}}>
					<div style={{...hero(92), color: C.gold, lineHeight: 1}}>
						<Counter to={belowBand} at={nine + 30} len={24} />
						<span style={{fontSize: 50, color: C.cremaDim}}> of {ladder.length}</span>
					</div>
					<div style={{fontFamily: F.mono, fontSize: 22, color: C.crema, letterSpacing: '0.06em', marginTop: 8}}>BLENDS BELOW OUR BAND</div>
				</div>
			) : null}
			{/* ladder */}
			{frame >= nine ? (
				<div style={{position: 'absolute', left: P, top: ladderTop, opacity: m}}>
					<PriceLadder at={nine + 8} dots={ladder} band={[shelf.bandLow, shelf.bandHigh]} glowAt={nine + 30} width={CW} />
				</div>
			) : null}
			{frame >= nine ? (
				<>
					<div style={{position: 'absolute', left: P, top: ladderTop + 60, fontFamily: F.mono, fontSize: 22, color: C.cremaDim, lineHeight: 1.25, ...ee(nine + 30)}}>
						ALDI Lazzio
						<br />
						value tier: not our fight
					</div>
					<div style={{position: 'absolute', left: lx(8.8) - 70, top: ladderTop + 60, width: 140, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.crema, textAlign: 'center', lineHeight: 1.25, ...ee(campos)}}>
						Campos
						<br />
						<span style={{color: C.robusta}}>ceiling</span>
					</div>
					<div style={{position: 'absolute', right: P, top: ladderTop + 214, fontFamily: F.mono, fontSize: 22, color: C.cremaDim, opacity: m}}>A$ per 100 g</div>
				</>
			) : null}
			{frame >= upper ? (
				<div style={{position: 'absolute', left: P, top: 600, ...display(34), color: C.gold}}>
					<KeywordPop at={upper}>UPPER-MAINSTREAM</KeywordPop>
				</div>
			) : null}
			{frame >= real ? (
				<Footnote style={{position: 'absolute', left: P, top: 646, width: CW, opacity: interpolate(frame, [real, real + 8], [0, 1], clamp)}}>
					Judged on shelf price & cost per serve, not tax status
				</Footnote>
			) : null}
			<SourceTag>Part 2, App. D/I/K; Nagle & Müller 2018</SourceTag>
		</BeatContent>
	);
};
