// B07 Place (PIP): map flight from Buôn Ma Thuột to NSW + VIC; channel ladder; ® stamp; Lavazza vs Starbucks.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {GEO, distributorCost, shares} from '../data/facts';
import {C, F, PANEL, body, display} from '../theme';
import {clamp, cue, durLocal, stateStyle, useEnterExit} from '../lib';
import {Camera, MapView, lerpCam, project} from '../components/MapView';
import {PIN_PATH} from '../components/Emblem';
import {Footnote, Gold, SourceTag, Stamp} from '../components/Panel';
import {Padlock, Tick} from '../components/Signage';
import {Icon} from '../components/Icon';
import {SceneProps} from './common';

const BMT = project(GEO.buonMaThuot);
const SYD = project(GEO.sydney);
const MEL = project(GEO.melbourne);

const WIDE: Camera = {focus: BMT, anchor: [700, 210], zoom: 0.92};
const CLOSE: Camera = {focus: project([147.2, -33.4]), anchor: [640, 560], zoom: 5.4};

const toScreen = (cam: Camera, p: [number, number]) => [cam.anchor[0] + (p[0] - cam.focus[0]) * cam.zoom, cam.anchor[1] + (p[1] - cam.focus[1]) * cam.zoom] as [number, number];

const Pin: React.FC<{x: number; y: number; at: number; label: string; labelSide?: 'left' | 'right'; color?: string}> = ({x, y, at, label, labelSide = 'right', color = C.gold}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0) return null;
	const drop = interpolate(t, [0, 14], [0, 1], {...clamp, easing: Easing.bounce});
	const yy = y - 26 - (1 - drop) * 120;
	const lo = interpolate(t, [10, 18], [0, 1], clamp);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
				<ellipse cx={x} cy={y} rx={16 * drop} ry={5 * drop} fill="#000" opacity={0.45} />
				<circle cx={x} cy={y} r={20 + (t % 40)} fill="none" stroke={color} strokeOpacity={Math.max(0, 0.6 - (t % 40) / 60)} strokeWidth={2} />
				<g transform={`translate(${x} ${yy}) scale(1.6)`}>
					<path d={PIN_PATH} fill={color} />
					<circle cx={0} cy={-5} r={5} fill={C.roast} />
				</g>
			</svg>
			<div
				style={{
					position: 'absolute',
					top: y - 64,
					...(labelSide === 'right' ? {left: x + 28} : {right: 1920 - x + 28}),
					opacity: lo,
					fontFamily: F.display,
					fontWeight: 800,
					fontStretch: '112%',
					fontSize: 36,
					color: C.crema,
					textShadow: '0 2px 10px rgba(0,0,0,0.7)',
					whiteSpace: 'nowrap',
				}}
			>
				{label}
			</div>
		</>
	);
};

const Rung: React.FC<{style: React.CSSProperties; icon: React.ReactNode; title: string; sub?: string; compact: number; short: string}> = ({style, icon, title, sub, compact, short}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 16, ...style}}>
		<div style={{width: 58, height: 58, borderRadius: 29, background: C.espresso2, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
		<div style={{position: 'relative', flex: 1, height: 74 - compact * 22}}>
			<div style={{position: 'absolute', inset: 0, opacity: 1 - compact}}>
				<div style={{...body(28, 700), lineHeight: 1.15}}>{title}</div>
				{sub ? <div style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim, marginTop: 4}}>{sub}</div> : null}
			</div>
			<div style={{position: 'absolute', left: 0, top: 10, opacity: compact, ...body(28, 600), color: C.cremaDim}}>{short}</div>
		</div>
	</div>
);

export const B07Place: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const excl = cue(beat, 'exclusive distributor');
	const nsw = cue(beat, 'New South Wales');
	const vic = cue(beat, 'Victoria');
	const amazon = cue(beat, 'Amazon store');
	const marks = cue(beat, 'trademarks');
	const sup = cue(beat, 'Supermarkets');
	const lav = cue(beat, 'Lavazza');
	const later = cue(beat, 'ownership later');

	const fly = interpolate(frame, [30, 78], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const cam = lerpCam(WIDE, CLOSE, fly);
	const arcT = interpolate(frame, [4, 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const hi = interpolate(frame, [nsw, nsw + 14], [0, 1], clamp);
	const bg = interpolate(frame, [0, 10, end - 8, end + 4], [0, 1, 1, 0], clamp);

	// shipping arc (projected quadratic curve, drawn in screen space)
	const a = toScreen(cam, BMT);
	const b = toScreen(cam, SYD);
	const ctrl: [number, number] = [(a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.62, (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.62];
	const pts: string[] = [];
	const N = 60;
	for (let i = 0; i <= N * arcT; i++) {
		const t = i / N;
		const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
		const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
		pts.push(`${x},${y}`);
	}
	const sydS = toScreen(cam, SYD);
	const melS = toScreen(cam, MEL);
	const bmtS = toScreen(cam, BMT);
	const compact = interpolate(frame, [sup, sup + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const lockUp = interpolate(frame, [sup, sup + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const bmtLabel = interpolate(frame, [8, 16, 56, 66], [0, 1, 1, 0], clamp);
	const cardP = interpolate(frame, [excl - 8, excl + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const cardExit = interpolate(frame, [end - 10, end], [0, 1], clamp);

	return (
		<div style={{position: 'absolute', inset: 0, opacity: bg}}>
			<MapView cam={cam} highlight={hi} />
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 10" strokeLinecap="round" />
				<circle cx={bmtS[0]} cy={bmtS[1]} r={8} fill={C.gold} opacity={interpolate(frame, [2, 8, 60, 70], [0, 1, 1, 0], clamp)} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: bmtS[0] + 18,
					top: bmtS[1] - 18,
					opacity: bmtLabel,
					fontFamily: F.mono,
					fontWeight: 700,
					fontSize: 24,
					color: C.crema,
					textShadow: '0 2px 8px rgba(0,0,0,0.8)',
					whiteSpace: 'nowrap',
				}}
			>
				Buôn Ma Thuột, Vietnam
			</div>
			<Pin x={sydS[0]} y={sydS[1]} at={Math.max(70, nsw - 4)} label="Sydney" />
			<Pin x={melS[0]} y={melS[1]} at={vic} label="Melbourne" />
			{/* state labels */}
			<div style={{position: 'absolute', left: toScreen(cam, project([146.4, -31.6]))[0] - 40, top: toScreen(cam, project([146.4, -31.6]))[1] - 20, opacity: hi, ...display(34), color: C.goldHot, textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>NSW</div>
			<div style={{position: 'absolute', left: toScreen(cam, project([142.6, -36.3]))[0] - 30, top: toScreen(cam, project([142.6, -36.3]))[1] - 20, opacity: hi, ...display(30), color: C.goldHot, textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>VIC</div>
			{/* ® stamp over the map */}
			<Stamp
				at={marks}
				text="® Marks filed with"
				sub="IP AUSTRALIA · BEFORE SIGNING"
				color={C.gold}
				style={{left: 120, top: 460}}
				rotate={-6}
				size={34}
			/>
			{/* right card: channel ladder, then the precedent */}
			<div
				style={{
					position: 'absolute',
					left: PANEL.x,
					top: PANEL.y,
					width: PANEL.w,
					height: PANEL.h,
					borderRadius: PANEL.r,
					background: 'rgba(36,21,15,0.92)',
					border: '1px solid rgba(246,231,208,0.08)',
					boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
					opacity: cardP * (1 - cardExit),
					transform: `translateX(${(1 - cardP) * 60}px)`,
					overflow: 'hidden',
				}}
			>
				<div style={{position: 'absolute', left: 40, right: 40, top: 0, height: 3, background: C.gold}} />
				{/* State A: ladder */}
				<div style={stateStyle(frame, 0, lav, true)}>
					<div style={{position: 'absolute', left: 44, top: 96, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: C.gold}}>MONTHS 0–6</div>
					<div style={{position: 'absolute', left: 72, top: 160, width: 3, height: 300, background: `linear-gradient(${C.gold}, rgba(242,169,59,0.2))`}} />
					<Rung
						style={{position: 'absolute', left: 44, top: 140, width: 672, ...ee(excl)}}
						icon={<Icon name="handshake" size={36} />}
						title="Exclusive importer-distributor"
						sub="NSW + VIC · 2-yr contract, 6-month trial"
						compact={compact}
						short="Distributor · NSW + VIC"
					/>
					<Rung
						style={{position: 'absolute', left: 44, top: 260 - compact * 46, width: 672, ...ee(nsw + 10)}}
						icon={<Icon name="store" size={36} />}
						title="Asian & specialist grocers · IGA"
						compact={compact}
						short="Grocers · IGA"
					/>
					<Rung
						style={{position: 'absolute', left: 44, top: 370 - compact * 92, width: 672, ...ee(amazon)}}
						icon={<Icon name="cart" size={36} />}
						title="Own Amazon.com.au store"
						compact={compact}
						short="Amazon.com.au"
					/>
					{/* locked rung */}
					<div style={{position: 'absolute', left: 44, top: 520 - lockUp * 110, width: 672, ...ee(sup - 4)}}>
						<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: C.steel}}>AFTER GATE 1</div>
						<div
							style={{
								marginTop: 12,
								padding: '18px 22px',
								borderRadius: 16,
								border: `2px dashed ${C.steel}`,
								background: 'rgba(18,11,8,0.5)',
								display: 'flex',
								alignItems: 'center',
								gap: 20,
							}}
						>
							<Padlock size={64} />
							<div>
								<div style={{...body(28, 700), color: C.crema}}>
									Woolworths {shares.woolworths}% + Coles {shares.coles}%
								</div>
								<div style={{...body(22, 500), color: C.cremaDim}}>of supermarket grocery sales · unlocks at Gate 1</div>
							</div>
						</div>
					</div>
					<SourceTag>Part 2, Table J2; Singsit 2025</SourceTag>
				</div>
				{/* State B: precedent */}
				<div style={stateStyle(frame, lav, end + 20)}>
					<div style={{position: 'absolute', left: 44, top: 100, ...display(38), color: C.crema, whiteSpace: 'nowrap'}}>
						CONTRACT FIRST, <Gold>EQUITY LATER</Gold>
					</div>
					{[
						{ok: true, name: 'Lavazza', a: 'Blue Pod distributor 10+ yrs', b: 'bought it in 2018', color: C.gold},
						{ok: false, name: 'Starbucks', a: 'owned stores first', b: 'closed 61 of 84 (2008)', color: C.steel},
					].map((l, i) => {
						const at = lav + 6 + i * 10;
						const g = interpolate(frame, [at, at + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
						return (
							<div key={l.name} style={{position: 'absolute', left: 44, top: 196 + i * 180, width: 672, ...ee(at)}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
									{l.ok ? <Tick at={at + 10} size={34} /> : <Icon name="cross" size={34} accent={C.robusta} />}
									<div style={{...display(34), color: l.ok ? C.gold : C.crema}}>{l.name}</div>
								</div>
								<svg width={672} height={60} style={{marginTop: 10, overflow: 'visible'}}>
									<line x1={14} y1={30} x2={14 + 600 * g} y2={30} stroke={l.color} strokeWidth={6} strokeLinecap="round" />
									<circle cx={14} cy={30} r={11} fill={l.color} />
									<circle cx={614} cy={30} r={13} fill={l.ok ? C.highland : C.robusta} opacity={g > 0.95 ? 1 : 0} />
								</svg>
								<div style={{display: 'flex', justifyContent: 'space-between', ...body(26, 600)}}>
									<span>{l.a}</span>
									<span style={{color: l.ok ? C.highland : C.robusta, opacity: g}}>→ {l.b}</span>
								</div>
							</div>
						);
					})}
					<Footnote style={{position: 'absolute', left: 44, top: 590, width: 672, ...ee(later)}}>Distributor cost ≈ A${distributorCost.toFixed(2)} a pack (assumed margins)</Footnote>
					<SourceTag>Baker 2018; Patterson 2012; Larimer 2003; Report, Table A2</SourceTag>
				</div>
			</div>
		</div>
	);
};
