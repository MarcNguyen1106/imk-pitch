// Code-driven SVG charts, drawn to scale from data/facts.ts. One scale per chart.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Factor} from '../data/facts';
import {C, F} from '../theme';
import {clamp} from '../lib';

const grow = (frame: number, at: number, i = 0, len = 18) =>
	interpolate(frame, [at + i * 2, at + i * 2 + len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

// ---------- Gauge (0-5, ticks every 0.5, threshold 3.50) ----------
export const Gauge: React.FC<{at: number; value: number; threshold: number; max?: number; r?: number; labelOpacity?: number}> = ({at, value, threshold, max = 5, r = 220, labelOpacity = 1}) => {
	const frame = useCurrentFrame();
	const cx = r + 40;
	const cy = r + 30;
	const ang = (v: number) => Math.PI - (v / max) * Math.PI;
	const pt = (v: number, rr: number) => [cx + Math.cos(ang(v)) * rr, cy - Math.sin(ang(v)) * rr];
	const arc = (a: number, b: number, rr: number) => {
		const [x1, y1] = pt(a, rr);
		const [x2, y2] = pt(b, rr);
		return `M${x1} ${y1} A${rr} ${rr} 0 0 1 ${x2} ${y2}`;
	};
	const draw = interpolate(frame, [at, at + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const th = interpolate(frame, [at + 12, at + 24], [0, 1], clamp);
	const sweep = interpolate(frame, [at + 18, at + 52], [0, value], {...clamp, easing: Easing.out(Easing.cubic)});
	const [nx, ny] = pt(sweep, r - 46);
	const [tx1, ty1] = pt(threshold, r - 64);
	const [tx2, ty2] = pt(threshold, r + 26);
	const [lx, ly] = pt(threshold, r + 48);
	return (
		<svg width={2 * r + 80} height={r + 70} style={{overflow: 'visible'}}>
			<path d={arc(0, max, r)} fill="none" stroke="rgba(154,163,168,0.25)" strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
			<path d={arc(0, threshold, r)} fill="none" stroke={C.robusta} strokeOpacity={0.55} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
			<path d={arc(threshold, max, r)} fill="none" stroke={C.highland} strokeOpacity={0.7} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, draw * 2 - 1)} />
			{Array.from({length: max * 2 + 1}, (_, i) => i / 2).map((v) => {
				const [a1, b1] = pt(v, r - 26);
				const [a2, b2] = pt(v, r - (v % 1 === 0 ? 46 : 38));
				const [la, lb] = pt(v, r - 72);
				const o = interpolate(frame, [at + v * 3, at + v * 3 + 8], [0, 1], clamp);
				return (
					<g key={v} opacity={o}>
						<line x1={a1} y1={b1} x2={a2} y2={b2} stroke={C.steel} strokeWidth={v % 1 === 0 ? 4 : 2} strokeLinecap="round" />
						{v % 1 === 0 ? (
							<text opacity={labelOpacity} x={la} y={lb + 8} textAnchor="middle" fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>
								{v}
							</text>
						) : null}
					</g>
				);
			})}
			<line x1={tx1} y1={ty1} x2={tx1 + (tx2 - tx1) * th} y2={ty1 + (ty2 - ty1) * th} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
			<text x={lx + 4} y={ly - 2} fill={C.gold} fontFamily={F.mono} fontWeight={700} fontSize={22} letterSpacing="0.06em" opacity={th * labelOpacity}>
				THRESHOLD 3.50
			</text>
			<line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.crema} strokeWidth={6} strokeLinecap="round" opacity={frame >= at + 18 ? 1 : 0} />
			<circle cx={cx} cy={cy} r={16} fill={C.espresso2} stroke={C.gold} strokeWidth={4} />
		</svg>
	);
};

// ---------- Tornado (one-point sensitivity around 3.50) ----------
export const Tornado: React.FC<{at: number; rows: Factor[]; width?: number; rowH?: number; labelW?: number}> = ({at, rows, width = 672, rowH = 44, labelW = 268}) => {
	const frame = useCurrentFrame();
	const d0 = 3.15;
	const d1 = 3.85;
	const cw = width - labelW;
	const x = (v: number) => labelW + ((v - d0) / (d1 - d0)) * cw;
	const line = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const h = rows.length * rowH + 40;
	return (
		<svg width={width} height={h} style={{overflow: 'visible'}}>
			{/* axis labels */}
			<text x={x(3.2)} y={14} textAnchor="middle" fill={C.cremaDim} fontFamily={F.mono} fontSize={22} opacity={line}>−1</text>
			<text x={x(3.8)} y={14} textAnchor="middle" fill={C.cremaDim} fontFamily={F.mono} fontSize={22} opacity={line}>+1</text>
			{rows.map((r, i) => {
				const y = 34 + i * rowH;
				const g = grow(frame, at + 10, i);
				const lw = (x(3.5) - x(r.minus)) * g;
				const rw = r.plus ? (x(r.plus) - x(3.5)) * g : 0;
				const lo = interpolate(frame, [at + 10 + i * 2 + 12, at + 10 + i * 2 + 20], [0, 1], clamp);
				return (
					<g key={r.name}>
						<text x={0} y={y + rowH / 2 + 2} fill={C.crema} fontFamily={F.text} fontWeight={500} fontSize={23} dominantBaseline="middle" opacity={grow(frame, at, i, 10)}>
							{r.name}
							<tspan fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>{`  ${r.weight}%`}</tspan>
						</text>
						<rect x={x(3.5) - lw} y={y + 8} width={lw} height={rowH - 16} rx={4} fill={C.robusta} />
						<rect x={x(3.5)} y={y + 8} width={rw} height={rowH - 16} rx={4} fill={C.highland} />
						<text x={x(r.minus) - 8} y={y + rowH / 2 + 2} textAnchor="end" dominantBaseline="middle" fill={C.robusta} fontFamily={F.mono} fontSize={22} opacity={lo}>
							{r.minus.toFixed(2)}
						</text>
						<text x={r.plus ? x(r.plus) + 8 : x(3.5) + 10} y={y + rowH / 2 + 2} dominantBaseline="middle" fill={r.plus ? C.highland : C.cremaDim} fontFamily={F.mono} fontSize={22} opacity={lo}>
							{r.plus ? r.plus.toFixed(2) : 'n/a'}
						</text>
					</g>
				);
			})}
			<line x1={x(3.5)} y1={24} x2={x(3.5)} y2={24 + (rows.length * rowH + 20) * line} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
			<text x={x(3.5)} y={14} textAnchor="middle" fill={C.gold} fontFamily={F.mono} fontSize={22} opacity={line}>3.50</text>
		</svg>
	);
};

// ---------- Horizontal bar pair (import unit value) ----------
export const BarPair: React.FC<{at: number; rows: {label: string; v: number; color: string; valueLabel: string}[]; max: number; width?: number; rowH?: number}> = ({
	at,
	rows,
	max,
	width = 672,
	rowH = 84,
}) => {
	const frame = useCurrentFrame();
	const {labelW, bw} = barPairGeometry(width);
	return (
		<svg width={width} height={rows.length * rowH} style={{overflow: 'visible'}}>
			{rows.map((r, i) => {
				const g = grow(frame, at, i, 18);
				const w = (r.v / max) * bw * g;
				return (
					<g key={r.label} transform={`translate(0 ${i * rowH})`}>
						<text x={0} y={34} dominantBaseline="middle" fill={C.crema} fontFamily={F.text} fontWeight={600} fontSize={28}>
							{r.label}
						</text>
						<rect x={labelW} y={8} width={w} height={52} rx={6} fill={r.color} />
						<text x={labelW + w + 12} y={35} dominantBaseline="middle" fill={C.crema} fontFamily={F.mono} fontWeight={700} fontSize={26} opacity={g}>
							{r.valueLabel}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
export function barPairGeometry(width = 672) {
	return {labelW: 170, bw: width - 170 - 150};
}

// ---------- Theme bars (n = 44) ----------
export const ThemeBars: React.FC<{at: number; rows: {label: string; n: number; pct: number; color: string}[]; max: number; width?: number; cueAts?: number[]}> = ({
	at,
	rows,
	max,
	width = 672,
	cueAts,
}) => {
	const frame = useCurrentFrame();
	const bw = width - 150;
	return (
		<div style={{width}}>
			{rows.map((r, i) => {
				const start = cueAts ? cueAts[i] : at + i * 2;
				const g = interpolate(frame, [start, start + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
				const w = Math.max(6, (r.n / max) * bw) * g;
				return (
					<div key={r.label} style={{marginBottom: 22, opacity: interpolate(frame, [at + i * 3, at + i * 3 + 8], [0, 1], clamp)}}>
						<div style={{fontFamily: F.text, fontWeight: 600, fontSize: 28, color: C.crema, marginBottom: 6}}>{r.label}</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<div style={{position: 'relative', height: 34, width: bw, flexShrink: 0, marginRight: -bw + w}}>
								<div style={{position: 'absolute', inset: 0, background: 'rgba(154,163,168,0.12)', borderRadius: 6, width: bw}} />
								<div style={{position: 'absolute', left: 0, top: 0, height: 34, width: w, background: r.color, borderRadius: 6}} />
							</div>
							<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: r.color === C.gold ? C.gold : C.crema, whiteSpace: 'nowrap', opacity: g > 0.02 ? 1 : 0}}>
								{Math.round(r.n * g)}
								<span style={{fontWeight: 500, fontSize: 22, color: C.cremaDim}}>{`  ${r.pct}%`}</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Price ladder (A$ per 100 g, 0-10) ----------
export const PriceLadder: React.FC<{
	at: number;
	dots: {v: number; label: string}[];
	band: [number, number];
	glowAt: number;
	width?: number;
}> = ({at, dots, band, glowAt, width = 672}) => {
	const frame = useCurrentFrame();
	const pad = 20;
	const x = (v: number) => pad + (v / 10) * (width - 2 * pad);
	const axisY = 168;
	const axis = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const bandP = interpolate(frame, [at + 8, at + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	// dodge close dots vertically
	const placed: {x: number; y: number}[] = [];
	const pos = dots.map((d) => {
		const px = x(d.v);
		let level = 0;
		while (placed.some((p) => Math.abs(p.x - px) < 17 && p.y === level)) level++;
		placed.push({x: px, y: level});
		return {px, level};
	});
	const glow = interpolate(frame, [glowAt, glowAt + 8, glowAt + 40, glowAt + 60], [0, 1, 1, 0.35], clamp);
	return (
		<svg width={width} height={230} style={{overflow: 'visible'}}>
			<rect x={x(band[0])} y={axisY - 112} width={(x(band[1]) - x(band[0])) * bandP} height={132} rx={6} fill={C.gold} opacity={0.28} />
			<rect x={x(band[0])} y={axisY - 112} width={(x(band[1]) - x(band[0])) * bandP} height={132} rx={6} fill="none" stroke={C.gold} strokeWidth={2} />
			<text x={x(band[0]) + (x(band[1]) - x(band[0])) / 2} y={axisY - 124} textAnchor="middle" fill={C.gold} fontFamily={F.mono} fontSize={22} opacity={bandP}>
				Legend phin pack
			</text>
			<line x1={x(0)} y1={axisY} x2={x(0) + (x(10) - x(0)) * axis} y2={axisY} stroke={C.steel} strokeWidth={3} strokeLinecap="round" />
			{[0, 2, 4, 6, 8, 10].map((v) => (
				<g key={v} opacity={axis}>
					<line x1={x(v)} y1={axisY} x2={x(v)} y2={axisY + 10} stroke={C.steel} strokeWidth={2} />
					<text x={x(v)} y={axisY + 38} textAnchor="middle" fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>
						{v}
					</text>
				</g>
			))}
			{dots.map((d, i) => {
				const t0 = at + 16 + i * 3;
				const drop = interpolate(frame, [t0, t0 + 14], [0, 1], {...clamp, easing: Easing.bounce});
				const below = d.v < band[0];
				const py = axisY - 16 - pos[i].level * 22;
				const cy = interpolate(drop, [0, 1], [py - 120, py]);
				return (
					<g key={i} opacity={interpolate(frame, [t0, t0 + 4], [0, 1], clamp)}>
						{below ? <circle cx={pos[i].px} cy={cy} r={16} fill={C.goldHot} opacity={glow * 0.35} /> : null}
						<circle cx={pos[i].px} cy={cy} r={8.5} fill={C.steel} stroke={C.roast} strokeWidth={2} />
					</g>
				);
			})}
		</svg>
	);
};
export const ladderX = (v: number, width = 672) => 20 + (v / 10) * (width - 40);

// ---------- Per-serve chips (bars to one scale) ----------
export const ServeChips: React.FC<{at: number; items: {label: string; v: number; ours: boolean}[]; width?: number; compact?: boolean}> = ({at, items, width = 672, compact}) => {
	const frame = useCurrentFrame();
	const max = 1.4;
	const gap = 12;
	const cw = (width - gap * (items.length - 1)) / items.length;
	return (
		<div style={{display: 'flex', gap, width}}>
			{items.map((it, i) => {
				const p = interpolate(frame, [at + i * 3, at + i * 3 + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
				const g = interpolate(frame, [at + i * 3 + 6, at + i * 3 + 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
				const barH = compact ? 0 : (it.v / max) * 70 * g;
				return (
					<div
						key={it.label}
						style={{
							width: cw,
							padding: compact ? '8px 10px' : '12px 12px 10px',
							borderRadius: 14,
							background: it.ours ? 'rgba(242,169,59,0.14)' : C.espresso2,
							border: `2px solid ${it.ours ? C.gold : 'rgba(154,163,168,0.25)'}`,
							opacity: p,
							transform: `translateY(${(1 - p) * 30}px)`,
							boxSizing: 'border-box',
							textAlign: 'center',
						}}
					>
						{!compact ? (
							<div style={{height: 72, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
								<div style={{width: 26, height: barH, borderRadius: 4, background: it.ours ? C.gold : C.steel}} />
							</div>
						) : null}
						<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: compact ? 24 : 28, color: it.ours ? C.gold : C.crema, marginTop: compact ? 0 : 6}}>
							A${it.v.toFixed(2)}
						</div>
						<div style={{fontFamily: F.text, fontWeight: 600, fontSize: 22, color: it.ours ? C.gold : C.cremaDim}}>{it.label}</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Shelf tag (original design in the style of Australian unit pricing) ----------
export const ShelfTag: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const ribbon = interpolate(frame, [at + 14, at + 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'relative', width: 460, height: 260, background: '#FBF8F2', borderRadius: 12, boxShadow: '0 22px 50px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					height: 46,
					width: 230 * ribbon,
					background: C.gold,
					borderBottomRightRadius: 12,
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 20,
					boxSizing: 'border-box',
					fontFamily: F.mono,
					fontWeight: 700,
					fontSize: 24,
					letterSpacing: '0.08em',
					color: C.roast,
					whiteSpace: 'nowrap',
				}}
			>
				VALUE-BASED
			</div>
			<div style={{position: 'absolute', left: 22, top: 58, fontFamily: F.display, fontWeight: 900, fontStretch: '125%', fontSize: 104, color: C.roast, letterSpacing: '-0.03em', lineHeight: 1}}>
				<span style={{fontSize: 54, verticalAlign: 'top', lineHeight: 1.6}}>$</span>15.99
			</div>
			<div style={{position: 'absolute', right: 22, top: 16, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: '#2a1b14'}}>250 g</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, background: '#E9E2D6', borderTop: '2px solid #cfc5b5'}}>
				<div style={{position: 'absolute', left: 22, top: 13, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: '#2a1b14'}}>$6.40 per 100 g</div>
			</div>
		</div>
	);
};
