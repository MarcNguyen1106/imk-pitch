// B06 Product (FULL): target rings -> Australia-only pack + starter kit -> the ritual must be taught.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {vietnamBorn} from '../data/facts';
import {C, F, body} from '../theme';
import {clamp, cue, durLocal, stateStyle, useEnterExit} from '../lib';
import {Chip, Eyebrow, Footnote, SourceTag} from '../components/Panel';
import {PhinSteps, Pouch, StarterKit} from '../components/Product';
import {BeatContent, CW, P, SceneProps} from './common';

export const QR_TEXT = 'Phin brewing video (placeholder)';

export const B06Product: React.FC<SceneProps & {qrText?: string}> = ({beat, qrText = QR_TEXT}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const ausOnly = cue(beat, 'Australia-only');
	const eighteen = cue(beat, 'eighteen');
	const kit = cue(beat, 'starter kit');
	const ritual = cue(beat, 'ritual');
	const ring = (r: number, at: number) => interpolate(frame, [at, at + 20], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.3))}) * r;
	return (
		<BeatContent beat={beat} inDelay={12}>
			{/* State A: who it is for */}
			<div style={stateStyle(frame, 0, ausOnly, true)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>Product · who it’s for</Eyebrow>
				<svg width={300} height={300} style={{position: 'absolute', left: P - 10, top: 200, overflow: 'visible'}}>
					<circle cx={150} cy={150} r={ring(146, 12)} fill="none" stroke={C.steel} strokeWidth={3} strokeDasharray="6 8" />
					<circle cx={150} cy={150} r={ring(100, 6)} fill="rgba(242,169,59,0.12)" stroke={C.gold} strokeWidth={3} />
					<circle cx={150} cy={150} r={ring(52, 0)} fill={C.gold} />
					<text x={150} y={158} textAnchor="middle" fill={C.roast} fontFamily={F.display} fontWeight={900} fontSize={30} opacity={interpolate(frame, [10, 18], [0, 1], clamp)}>
						18–44
					</text>
				</svg>
				<div style={{position: 'absolute', left: P + 320, top: 190, width: CW - 320, ...ee(8)}}>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.gold, letterSpacing: '0.1em'}}>PRIMARY</div>
					<div style={{...body(30, 700)}}>Home brewers 18–44</div>
					<div style={{...body(24, 500), color: C.cremaDim}}>ground & filter favoured</div>
				</div>
				<div style={{position: 'absolute', left: P + 320, top: 350, width: CW - 320, ...ee(14)}}>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.steel, letterSpacing: '0.1em'}}>SEED</div>
					<div style={{...body(26, 600)}}>Vietnamese-Australians</div>
					<div style={{...body(22, 500), color: C.cremaDim}}>({vietnamBorn} born in Vietnam)</div>
				</div>
				<div style={{position: 'absolute', left: P + 320, top: 490, width: CW - 320, ...ee(18)}}>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.steel, letterSpacing: '0.1em'}}>SEED</div>
					<div style={{...body(26, 600)}}>Returning travellers</div>
				</div>
				<SourceTag>BeanScene 2026; ABS 2026a</SourceTag>
			</div>
			{/* State B: pack + kit */}
			<div style={stateStyle(frame, ausOnly, ritual)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>Australia-only pack · English-first label</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 160, ...ee(ausOnly + 2, Infinity, 40)}}>
					<Pouch w={280} />
				</div>
				<div style={{position: 'absolute', left: P + 340, top: 230, ...ee(kit, Infinity, 40)}}>
					<StarterKit w={300} qrText={qrText} />
				</div>
				<div style={{position: 'absolute', left: P + 340, top: 176, ...ee(kit + 4)}}>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.gold, letterSpacing: '0.1em'}}>+ STARTER KIT</div>
				</div>
				<div style={{position: 'absolute', left: P, top: 600, ...ee(eighteen)}}>
					<Chip color={C.gold} style={{border: `2px solid ${C.gold}`}}>
						for home brewers 18–44
					</Chip>
				</div>
				<SourceTag>Part 2, Appendix I</SourceTag>
			</div>
			{/* State C: the ritual must be taught */}
			<div style={stateStyle(frame, ritual, end + 30)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>The ritual must be taught</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 190, transform: 'scale(1)'}}>
					<PhinSteps at={ritual + 2} width={CW} />
				</div>
				<Footnote style={{position: 'absolute', left: P, top: 520, width: CW, ...ee(ritual + 24)}}>phin mentioned in 1 of 44 reviews → teach it</Footnote>
				<SourceTag>Part 2, Appendix I; Appendix E</SourceTag>
			</div>
		</BeatContent>
	);
};
