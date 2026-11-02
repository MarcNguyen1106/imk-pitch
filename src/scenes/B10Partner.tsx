// B10 Partner (FULL, highland accent): proposed partner Cooee Foods Australia; start small; Cooee's terms; listening.
// No Indigenous art or motifs: typography, a plain wattleseed-pod sketch and neutral icons only.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {partnerScreen} from '../data/facts';
import {C, F, body, display, footnote} from '../theme';
import {clamp, cue, durLocal, stateStyle, useEnterExit} from '../lib';
import {Eyebrow, Footnote, SourceTag} from '../components/Panel';
import {Icon} from '../components/Icon';
import {Tick} from '../components/Signage';
import {Cookie, Pouch, WattlePod} from '../components/Product';
import {BeatContent, CW, P, SceneProps} from './common';

const H = C.highland;

export const B10Partner: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const cooee = cue(beat, 'Cooee Foods Australia');
	const wir = cue(beat, 'Wiradjuri');
	const small = cue(beat, 'start small');
	const wattle = cue(beat, 'wattleseed cookie');
	const sets = cue(beat, 'sets its price');
	const paid = cue(beat, 'paid within');
	const withdraw = cue(beat, 'withdraw anytime');
	const listen = cue(beat, 'We begin by listening.');
	const dim = interpolate(frame, [listen, listen + 12], [1, 0.06], clamp);
	const ladderCompact = interpolate(frame, [wattle, wattle + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const steps = [
		{n: 1, t: 'CURATED PAIRING · start here', c: ''},
		{n: 2, t: 'Gift pack', c: 'if Cooee agrees'},
		{n: 3, t: 'Co-developed product', c: 'only if Cooee proposes'},
		{n: 4, t: 'Trial in Vietnam', c: 'only if Cooee sees value'},
	];
	const terms = [
		{t: 'Cooee sets its own price', at: sets},
		{t: 'Paid within 14 days', at: paid},
		{t: 'Right to withdraw', at: withdraw},
		{t: 'Independent legal advice, paid by us', at: withdraw + 12},
	];
	const pills = ['CONSULT', 'CONSENT', 'CULTURAL AUTHORITY', 'BENEFIT', 'CONTROL'];
	return (
		<BeatContent beat={beat}>
			<div style={{opacity: dim}}>
				{/* State A: who */}
				<div style={stateStyle(frame, 0, small, true)}>
					<Eyebrow color={H} style={{position: 'absolute', left: P, top: 96, letterSpacing: '0.05em', whiteSpace: 'nowrap'}}>
						Proposed Indigenous partner · no contact yet
					</Eyebrow>
					<div style={{position: 'absolute', left: P, top: 148, width: CW, ...display(46), whiteSpace: 'nowrap', ...ee(cooee - 4)}}>Cooee Foods Australia</div>
					<div style={{position: 'absolute', left: P, top: 216, width: CW, ...body(28, 600), ...ee(wir - 2)}}>
						Founder Terri-Anne Daniel · <span style={{color: H}}>Wiradjuri</span> · Supply Nation certified
					</div>
					<div style={{position: 'absolute', left: P, top: 300, width: CW, ...footnote, ...ee(wir + 6)}}>
						Supply Nation: ≥ 51% Indigenous owned, managed & controlled
					</div>
					<div style={{position: 'absolute', left: P, top: 396, width: CW, ...ee(wir + 14)}}>
						<div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: '0.1em', color: C.cremaDim, marginBottom: 10}}>PARTNER SCREEN (WEIGHTED, OUT OF 5)</div>
						{partnerScreen.map((p, i) => {
							const g = interpolate(frame, [wir + 18 + i * 3, wir + 36 + i * 3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
							return (
								<div key={p.label} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50}}>
									<div style={{width: 210, ...body(26, p.ours ? 700 : 500), color: p.ours ? C.crema : C.cremaDim, whiteSpace: 'nowrap'}}>{p.label}</div>
									<div style={{height: 30, width: (p.v / 5) * 360 * g, background: p.ours ? H : C.steel, borderRadius: 5}} />
									<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: p.ours ? H : C.crema, opacity: g}}>{p.v.toFixed(2)}</div>
								</div>
							);
						})}
					</div>
					<SourceTag>Ampol n.d.; Supply Nation n.d.; Bortoletto 2026; Part 2, Table G1</SourceTag>
				</div>
				{/* State B: start small */}
				<div style={stateStyle(frame, small, sets)}>
					<Eyebrow color={H} style={{position: 'absolute', left: P, top: 96}}>
						Collaboration depth · Cooee decides
					</Eyebrow>
					{steps.map((s, i) => {
						const lit = i === 0;
						const y = 146 + i * (74 - ladderCompact * 30);
						return (
							<div key={s.n} style={{position: 'absolute', left: P + i * 18, top: y, width: CW - i * 18, display: 'flex', alignItems: 'center', gap: 14, ...ee(small + i * 3)}}>
								<div style={{width: 40, height: 40, borderRadius: 20, flexShrink: 0, background: lit ? H : 'transparent', border: `2px solid ${lit ? H : 'rgba(154,163,168,0.5)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: lit ? C.roast : C.steel}}>{s.n}</div>
								<div style={{...body(lit ? 28 : 26, lit ? 700 : 500), color: lit ? C.crema : C.cremaDim, opacity: lit ? 1 : 1 - ladderCompact * 0.25}}>
									{s.t}
									{s.c ? <span style={{...footnote, marginLeft: 12, opacity: 1 - ladderCompact}}>{s.c}</span> : null}
								</div>
							</div>
						);
					})}
					{/* pairing: two separate products, each under its own label */}
					<div style={{position: 'absolute', left: P, top: 330, width: CW, height: 330, opacity: ladderCompact, transform: `translateY(${(1 - ladderCompact) * 24}px)`}}>
						<div style={{position: 'absolute', left: 10, top: 20, width: 280, textAlign: 'center'}}>
							<div style={{position: 'relative', height: 180}}>
								<div style={{position: 'absolute', left: 60, top: 26}}>
									<Cookie size={150} />
								</div>
								<div style={{position: 'absolute', left: 170, top: -6}}>
									<WattlePod size={110} />
								</div>
							</div>
							<div style={{...body(24, 700), marginTop: 8}}>Cooee’s own wattleseed cookie</div>
						</div>
						<div style={{position: 'absolute', left: 300, top: 80, ...display(64), color: H}}>+</div>
						<div style={{position: 'absolute', left: 400, top: 0, width: 260, textAlign: 'center'}}>
							<div style={{display: 'flex', justifyContent: 'center'}}>
								<Pouch w={150} small="" sub="250 g" title="LEGEND" />
							</div>
							<div style={{...body(24, 700), marginTop: 12}}>Legend phin pack</div>
						</div>
						<Footnote style={{position: 'absolute', left: 0, top: 270, width: CW}}>wattleseed: roasted-coffee aroma · two products, side by side</Footnote>
					</div>
					<SourceTag>Part 2, Table G2</SourceTag>
				</div>
				{/* State C: Cooee's terms */}
				<div style={stateStyle(frame, sets, end + 30)}>
					<Eyebrow color={H} style={{position: 'absolute', left: P, top: 96}}>
						Cooee’s terms
					</Eyebrow>
					{terms.map((t, i) => (
						<div key={t.t} style={{position: 'absolute', left: P, top: 148 + i * 66, display: 'flex', alignItems: 'center', gap: 16, ...ee(t.at - 2)}}>
							<Tick at={t.at + 2} size={40} color={H} />
							<div style={{...body(30, 600)}}>{t.t}</div>
						</div>
					))}
					<div style={{position: 'absolute', left: P, top: 432, width: CW, display: 'flex', flexWrap: 'wrap', gap: 10}}>
						{pills.map((p, i) => (
							<div
								key={p}
								style={{
									padding: '8px 16px',
									borderRadius: 999,
									border: `2px solid ${H}`,
									fontFamily: F.mono,
									fontWeight: 700,
									fontSize: 22,
									letterSpacing: '0.06em',
									color: H,
									...ee(paid + 30 + i * 3),
								}}
							>
								{p}
							</div>
						))}
					</div>
					<Footnote style={{position: 'absolute', left: P, top: 560, width: CW, ...ee(paid + 44)}}>&lt; 2% of shelf products with native ingredients are Indigenous owned</Footnote>
					<SourceTag>Part 2, Table H2; Janke 2021; Bortoletto 2025; Vercoe 2019</SourceTag>
				</div>
			</div>
			{/* We begin by listening */}
			{frame >= listen ? (
				<div style={{position: 'absolute', left: P, top: 230, width: CW, textAlign: 'center', ...ee(listen)}}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<div style={{width: 150, height: 150, borderRadius: 75, background: 'rgba(63,162,122,0.14)', border: `3px solid ${H}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Icon name="ear" size={96} color={C.crema} accent={H} />
						</div>
					</div>
					<div style={{...display(54), marginTop: 36, color: C.crema}}>
						WE BEGIN BY <span style={{color: H}}>LISTENING</span>
					</div>
				</div>
			) : null}
		</BeatContent>
	);
};
