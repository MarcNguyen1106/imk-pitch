// B04 Evidence (FULL): primary data chips; import price is species & grade, not perception; 44 reviews coded.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {importPrice, primaryData, robustaShare, SRC, themeN, themes} from '../data/facts';
import {C, F, body, display} from '../theme';
import {clamp, cue, durLocal, stateStyle, useEnterExit, wordAt} from '../lib';
import {Chip, Eyebrow, Footnote, Gold, SourceTag, Stamp, StrikeRevise, stampShake} from '../components/Panel';
import {BarPair, ThemeBars, barPairGeometry} from '../components/Charts';
import {Icon} from '../components/Icon';
import {BeatContent, CW, P, SceneProps} from './common';
import {wordIndex} from '../data/beats';

export const EVIDENCE_CHIPS = [
	{icon: 'clipboard' as const, text: `SHELF AUDIT · ${primaryData.listings} LISTINGS`},
	{icon: 'speech' as const, text: `${primaryData.comments} REVIEWS CODED`},
	{icon: 'magnifier' as const, text: 'CLAIMS AUDIT'},
];

export const B04Evidence: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const prim = cue(beat, 'primary data');
	const imp = cue(beat, 'import price');
	const kilo = cue(beat, 'kilo');
	const but = cue(beat, 'but');
	const rob = cue(beat, 'robusta');
	const not = cue(beat, 'not');
	const shoppers = cue(beat, 'shoppers');
	const ff = cue(beat, 'forty-four');
	const taste = cue(beat, 'taste');
	const ident = cue(beat, 'Vietnamese');
	const phin = cue(beat, 'phin');
	const stampAt = shoppers + 2;
	const shake = stampShake(frame, stampAt);
	const {labelW, bw} = barPairGeometry(CW);
	const xv = labelW + (importPrice.vietnam / 5) * bw;
	const xa = labelW + (importPrice.allOrigins / 5) * bw;
	const br = interpolate(frame, [rob, rob + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
		return (
		<BeatContent beat={beat} shake={shake}>
			{/* State A: primary data */}
			<div style={stateStyle(frame, 0, imp, true)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 44}}>Primary data · Oct–Nov 2026</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 110, width: CW, ...display(64), ...ee(2)}}>
					My own <Gold>evidence</Gold>
				</div>
				<div style={{position: 'absolute', left: P, top: 230, display: 'flex', flexDirection: 'column', gap: 22}}>
					{EVIDENCE_CHIPS.map((c, i) => (
						<div key={c.text} style={ee(prim - 6 + i * 3)}>
							<Chip icon={<Icon name={c.icon} size={40} />} style={{fontSize: 28, padding: '14px 26px 14px 18px'}}>
								{c.text}
							</Chip>
						</div>
					))}
				</div>
				<SourceTag>{SRC.appA}</SourceTag>
			</div>
			{/* State B: import price is species & grade */}
			<div style={stateStyle(frame, imp, ff)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 44}}>Import price · {importPrice.year}</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 98}}>
					<BarPair
						at={imp + 4}
						max={5}
						width={CW}
						rows={[
							{label: 'Vietnam', v: importPrice.vietnam, color: C.steel, valueLabel: `US$${importPrice.vietnam.toFixed(2)}`},
							{label: 'All origins', v: importPrice.allOrigins, color: C.steel, valueLabel: `US$${importPrice.allOrigins.toFixed(2)}`},
						]}
					/>
					{/* the gap: the part of the all-origins bar beyond Vietnam's price */}
					{frame >= rob ? (
						<svg width={CW} height={200} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
							<line x1={xv} y1={4} x2={xv} y2={160} stroke={C.gold} strokeWidth={2} strokeDasharray="4 6" opacity={br} />
							<rect x={xv} y={92} width={(xa - xv) * br} height={52} rx={4} fill={C.gold} opacity={0.35} />
							<rect x={xv} y={92} width={(xa - xv) * br} height={52} rx={4} fill="none" stroke={C.gold} strokeWidth={3} />
							<path d={`M${xv} 156 V166 H${xv + (xa - xv) * br} V156`} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
						</svg>
					) : null}
				</div>
				<div style={{position: 'absolute', right: P, top: 44, fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>green coffee · US$/kg</div>
				<div style={{position: 'absolute', left: P, top: 276, width: CW, ...body(30, 600), opacity: interpolate(frame, [rob, rob + 8], [0, 1], clamp)}}>
					<Gold>≈ {robustaShare}%</Gold> of Vietnam’s crop is robusta
					<br />
					<Gold>→ species & grade</Gold>
				</div>
				<div style={{position: 'absolute', left: P, top: 392}}>
					<StrikeRevise
						at={kilo}
						old="Part 1: Vietnam = cheap-origin image"
						strikeAt={but}
						reviseAt={not}
						revised={
							<>
								Shopper perception = <Gold>hypothesis</Gold>
							</>
						}
						size={44}
					/>
				</div>
				<Stamp at={stampAt} text="Test, don't assume" color={C.gold} style={{left: P + 60, top: 572}} rotate={-4} size={36} />
				<SourceTag>
					{SRC.wits}; {SRC.dcn}
				</SourceTag>
			</div>
			{/* State C: 44 reviews coded */}
			<div style={stateStyle(frame, ff, end + 30)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 44}}>Public reviews coded · themes</Eyebrow>
				<div style={{position: 'absolute', right: P, top: 34, fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.crema, padding: '4px 14px', border: `2px solid ${C.steel}`, borderRadius: 10}}>
					n = {themeN}
				</div>
				<div style={{position: 'absolute', left: P, top: 118}}>
					<ThemeBars
						at={ff}
						max={24}
						width={CW}
						cueAts={[taste, ident, phin]}
						rows={[
							{...themes[0], color: C.gold},
							{...themes[1], color: C.steel},
							{...themes[2], color: C.steel},
						]}
					/>
				</div>
				<Footnote style={{position: 'absolute', left: P, top: 452, width: CW}}>
					Public comments, mostly US, mostly G7 instant · shows brand perception, not demand
				</Footnote>
				<SourceTag>{SRC.appE}</SourceTag>
			</div>
		</BeatContent>
	);
};
