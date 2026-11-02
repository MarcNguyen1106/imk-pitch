// B05 Warnings (FULL): already on shelf at A$3.10-6.00/100 g; 'we are green' names no certification.
// Hand-off in the pause: the three evidence chips gather into a gold arrow that wipes the panel.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {SRC, clorox, tnOnShelf} from '../data/facts';
import {C, F, PANEL, body, display} from '../theme';
import {clamp, cue, durLocal, speakEndLocal, stateStyle, useEnterExit} from '../lib';
import {Eyebrow, Footnote, Gold, KeywordPop, SourceTag, Stamp, stampShake} from '../components/Panel';
import {Icon} from '../components/Icon';
import {WarningTriangle} from '../components/Signage';
import {EVIDENCE_CHIPS} from './B04Evidence';
import {BeatContent, CW, P, SceneProps} from './common';

export const B05_TAIL = 14;

const WarnHead: React.FC<{n: number; label: string; at: number}> = ({n, label, at}) => (
	<div style={{position: 'absolute', left: P, top: 40, display: 'flex', alignItems: 'center', gap: 16}}>
		<WarningTriangle size={54} at={at} />
		<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em', color: C.robusta}}>
			WARNING {n} · <span style={{color: C.crema}}>{label}</span>
		</div>
	</div>
);

export const B05Warnings: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const speakEnd = speakEndLocal(beat);
	const two = cue(beat, 'two warnings');
	const three = cue(beat, 'three dollars ten');
	const green = cue(beat, "'we are green'");
	const noCert = cue(beat, 'no certification');
	const stampAt = noCert + 4;
	const shake = stampShake(frame, stampAt);
	// mini range strip on the A$/100 g scale (0-10)
	const sx = (v: number) => (v / 10) * CW;
	const rng = interpolate(frame, [three + 4, three + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const scan = interpolate(frame, [green + 6, green + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
	// hand-off
	const h0 = speakEnd - 6;
	const gather = interpolate(frame, [h0, h0 + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const wipeIn = interpolate(frame, [h0 + 10, h0 + 20], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const wipeOut = interpolate(frame, [end + 2, end + B05_TAIL], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<BeatContent beat={beat} shake={shake}>
				<div style={{opacity: 1 - interpolate(frame, [h0 + 14, h0 + 20], [0, 1], clamp)}}>
					{/* intro: two warnings */}
					<div style={stateStyle(frame, 0, three, true)}>
						<Eyebrow color={C.robusta} style={{position: 'absolute', left: P, top: 44}}>
							My audits
						</Eyebrow>
						<div style={{position: 'absolute', left: P, top: 140, display: 'flex', gap: 30, ...ee(two - 4)}}>
							<WarningTriangle size={120} at={two} />
							<WarningTriangle size={120} at={two + 5} />
						</div>
						<div style={{position: 'absolute', left: P, top: 310, ...display(84), color: C.crema}}>
							{frame >= two ? <KeywordPop at={two} color={C.robusta}>Two warnings</KeywordPop> : null}
						</div>
						<div style={{position: 'absolute', left: P, top: 420, width: CW, ...body(30, 500), color: C.cremaDim, ...ee(two + 14)}}>
							from the shelf audit and the claims audit
						</div>
					</div>
					{/* State A: already on shelf */}
					<div style={stateStyle(frame, three, green)}>
						<WarnHead n={1} label="ALREADY ON SHELF" at={three} />
						<div style={{position: 'absolute', left: P, top: 128, ...body(28, 600)}}>Trung Nguyên ground coffee · 7 grocer listings</div>
						<svg width={CW} height={150} style={{position: 'absolute', left: P, top: 196, overflow: 'visible'}}>
							<line x1={0} y1={70} x2={CW} y2={70} stroke={C.steel} strokeOpacity={0.5} strokeWidth={2} />
							{[0, 2, 4, 6, 8, 10].map((v) => (
								<g key={v}>
									<line x1={sx(v)} y1={70} x2={sx(v)} y2={80} stroke={C.steel} strokeWidth={2} />
									<text x={sx(v)} y={106} textAnchor="middle" fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>
										{v}
									</text>
								</g>
							))}
							<rect x={sx(tnOnShelf.low)} y={46} width={(sx(tnOnShelf.high) - sx(tnOnShelf.low)) * rng} height={48} rx={24} fill={C.steel} opacity={0.3} />
							<rect x={sx(tnOnShelf.low)} y={46} width={(sx(tnOnShelf.high) - sx(tnOnShelf.low)) * rng} height={48} rx={24} fill="none" stroke={C.steel} strokeWidth={2} />
							{Array.from({length: tnOnShelf.listings}, (_, i) => {
								const o = interpolate(frame, [three + 10 + i * 3, three + 16 + i * 3], [0, 1], clamp);
								return <circle key={i} cx={sx(tnOnShelf.low) + 22 + i * ((sx(tnOnShelf.high) - sx(tnOnShelf.low) - 44) / (tnOnShelf.listings - 1))} cy={70} r={10} fill={C.crema} opacity={o} />;
							})}
							<text x={sx(tnOnShelf.low)} y={36} textAnchor="middle" fill={C.crema} fontFamily={F.mono} fontWeight={700} fontSize={24} opacity={rng}>
								A$3.10
							</text>
							<text x={sx(tnOnShelf.high)} y={36} textAnchor="middle" fill={C.crema} fontFamily={F.mono} fontWeight={700} fontSize={24} opacity={rng}>
								A$6.00
							</text>
							<text x={CW} y={140} textAnchor="end" fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>
								A$ per 100 g
							</text>
						</svg>
						<Footnote style={{position: 'absolute', left: P, top: 372, width: CW, ...ee(three + 18)}}>specialist grocers · G7 instant at Woolworths · dots show count, not price</Footnote>
						<div style={{position: 'absolute', left: P, top: 470, width: CW, ...display(46), color: C.gold, ...ee(three + 34)}}>
							→ Legend pack must look & taste distinct
						</div>
						<SourceTag>{SRC.appD}</SourceTag>
					</div>
					{/* State B: claims */}
					<div style={stateStyle(frame, green, end + 30)}>
						<WarnHead n={2} label="CLAIMS" at={green} />
						<div
							style={{
								position: 'absolute',
								left: P,
								top: 126,
								width: CW,
								height: 176,
								borderRadius: 18,
								background: C.espresso2,
								border: '1px solid rgba(246,231,208,0.14)',
								overflow: 'hidden',
								...ee(green),
							}}
						>
							<div style={{position: 'absolute', left: 26, top: 16, fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>company website · quote</div>
							<div style={{position: 'absolute', left: 26, top: 50, ...display(64), color: C.crema}}>‘WE ARE GREEN’</div>
							<div style={{position: 'absolute', left: 26, top: 130, fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: C.robusta, opacity: interpolate(frame, [green + 36, green + 44], [0, 1], clamp)}}>
								certification named: none
							</div>
							<div style={{position: 'absolute', left: 20 + scan * (CW - 140), top: 34, opacity: scan > 0 && scan < 1 ? 1 : 0.0}}>
								<Icon name="magnifier" size={84} color={C.crema} accent={C.gold} />
							</div>
						</div>
						<div
							style={{
								position: 'absolute',
								left: P,
								top: 322,
								width: CW,
								padding: '14px 22px',
								boxSizing: 'border-box',
								borderRadius: 14,
								background: 'rgba(51,32,26,0.7)',
								border: '1px solid rgba(246,231,208,0.1)',
								...ee(green + 22),
							}}
						>
							<div style={{...body(26, 600), color: C.crema}}>‘THE ENERGY COFFEE THAT CHANGES LIFE’</div>
							<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.robusta, marginTop: 4}}>evidence: none</div>
						</div>
						<Stamp at={stampAt} text="No proof, no claim" color={C.robusta} style={{left: P + 30, top: 474}} rotate={-4} size={36} />
						<Footnote style={{position: 'absolute', left: P, top: 590, width: CW, ...ee(stampAt + 8)}}>Clorox penalised {clorox} for misleading green claims</Footnote>
						<SourceTag>
							{SRC.appF}; {SRC.accc}; {SRC.clorox}
						</SourceTag>
					</div>
				</div>
			</BeatContent>
			{/* hand-off: chips gather into one gold arrow, which wipes the panel */}
			{frame >= h0 - 2 ? (
				<div style={{position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, overflow: 'hidden'}}>
					{EVIDENCE_CHIPS.map((c, i) => {
						const fromX = [80, 300, 520][i];
						const fromY = [150, 640, 200][i];
						const toX = 300;
						const toY = 360;
						const x = fromX + (toX - fromX) * gather;
						const y = fromY + (toY - fromY) * gather;
						const o = interpolate(frame, [h0 - 2, h0 + 2, h0 + 10, h0 + 14], [0, 1, 1, 0], clamp);
						return (
							<div key={i} style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${1 - gather * 0.4})`}}>
								<div style={{width: 64, height: 64, borderRadius: 32, background: C.espresso2, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Icon name={c.icon} size={40} />
								</div>
							</div>
						);
					})}
					<div
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: wipeOut * PANEL.w,
							width: PANEL.w * wipeIn * (1 - wipeOut) + 0.001,
							background: C.gold,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					>
						<div style={{...display(52), color: C.roast, whiteSpace: 'nowrap', transform: `translateX(${(1 - wipeIn) * -80 + wipeOut * 80}px)`}}>→ THE STRATEGY</div>
					</div>
					{/* arrow head leading the wipe */}
					{wipeIn > 0 && wipeIn < 1 ? (
						<svg width={80} height={PANEL.h} style={{position: 'absolute', left: PANEL.w * wipeIn - 1, top: 0}}>
							<path d={`M0 0 L70 ${PANEL.h / 2} L0 ${PANEL.h} Z`} fill={C.gold} />
						</svg>
					) : null}
				</div>
			) : null}
		</>
	);
};
