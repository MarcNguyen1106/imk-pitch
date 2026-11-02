// Original signage set: warning triangle, gate sign, traffic light, boom gate, padlock, flask badge.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp} from '../lib';

export const WarningTriangle: React.FC<{size?: number; at?: number; color?: string}> = ({size = 64, at = -999, color = C.robusta}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const s = interpolate(t, [0, 8, 12], [0.6, 1.12, 1], clamp);
	const pulse = 0.5 + 0.5 * Math.sin(t / 6);
	return (
		<svg width={size} height={size} viewBox="0 0 64 64" style={{overflow: 'visible', transform: `scale(${s})`}}>
			<path d="M32 6 L60 56 H4 Z" fill={color} fillOpacity={0.16 + 0.08 * pulse} stroke={color} strokeWidth={4} strokeLinejoin="round" />
			<path d="M32 24 V40" stroke={C.crema} strokeWidth={5} strokeLinecap="round" />
			<circle cx={32} cy={48} r={3} fill={C.crema} />
		</svg>
	);
};

// Roadside gate sign: rounded rectangle on two posts; roast face, gold border, mono labels.
export const GateSign: React.FC<{title: string; sub?: string; w?: number; postH?: number; children?: React.ReactNode; accent?: string}> = ({
	title,
	sub,
	w = 300,
	postH = 70,
	children,
	accent = C.gold,
}) => (
	<div style={{position: 'relative', width: w}}>
		<div style={{background: C.roast, border: `3px solid ${accent}`, borderRadius: 16, padding: '12px 16px 14px', boxShadow: '0 14px 30px rgba(0,0,0,0.45)'}}>
			<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', color: accent, whiteSpace: 'nowrap'}}>{title}</div>
			{sub ? <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 22, color: C.cremaDim, marginTop: 2}}>{sub}</div> : null}
			{children}
		</div>
		<div style={{display: 'flex', justifyContent: 'space-between', padding: '0 40px'}}>
			<div style={{width: 8, height: postH, background: C.steel, opacity: 0.8}} />
			<div style={{width: 8, height: postH, background: C.steel, opacity: 0.8}} />
		</div>
	</div>
);

// Go/no-go traffic light: amber -> green at `greenAt`.
export const TrafficLight: React.FC<{amberAt: number; greenAt: number; scale?: number}> = ({amberAt, greenAt, scale = 1}) => {
	const frame = useCurrentFrame();
	const amber = interpolate(frame, [amberAt, amberAt + 4, greenAt, greenAt + 4], [0, 1, 1, 0], clamp);
	const green = interpolate(frame, [greenAt, greenAt + 4], [0, 1], clamp);
	const lamp = (cy: number, color: string, on: number) => (
		<g>
			<circle cx={30} cy={cy} r={16} fill={C.roast} stroke="rgba(154,163,168,0.4)" strokeWidth={2} />
			<circle cx={30} cy={cy} r={13} fill={color} opacity={0.12 + on * 0.88} />
			{on > 0.05 ? <circle cx={30} cy={cy} r={26} fill={color} opacity={on * 0.25} /> : null}
		</g>
	);
	return (
		<svg width={60 * scale} height={160 * scale} viewBox="0 0 60 160" style={{overflow: 'visible'}}>
			<rect x={22} y={110} width={16} height={50} fill={C.steel} opacity={0.8} />
			<rect x={4} y={4} width={52} height={112} rx={14} fill="#1b110c" stroke={C.steel} strokeWidth={3} />
			{lamp(26, C.robusta, 0)}
			{lamp(60, C.gold, amber)}
			{lamp(94, C.highland, green)}
		</svg>
	);
};

// Boom barrier that lifts at `liftAt`.
export const BoomGate: React.FC<{liftAt: number; width?: number}> = ({liftAt, width = 220}) => {
	const frame = useCurrentFrame();
	const lift = interpolate(frame, [liftAt, liftAt + 18], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const ang = -78 * lift;
	return (
		<svg width={width + 40} height={110} style={{overflow: 'visible'}}>
			<rect x={4} y={40} width={30} height={70} rx={6} fill={C.espresso2} stroke={C.steel} strokeWidth={3} />
			<g transform={`rotate(${ang} 19 52)`}>
				<rect x={19} y={46} width={width} height={14} rx={7} fill={C.crema} />
				{Array.from({length: Math.floor(width / 40)}, (_, i) => (
					<rect key={i} x={39 + i * 40} y={46} width={20} height={14} fill={C.robusta} />
				))}
			</g>
			<circle cx={19} cy={52} r={8} fill={C.gold} />
		</svg>
	);
};

// Padlock that unlocks at `unlockAt` (shackle lifts and swings).
export const Padlock: React.FC<{unlockAt?: number; size?: number; color?: string}> = ({unlockAt = 1e9, size = 64, color = C.steel}) => {
	const frame = useCurrentFrame();
	const u = interpolate(frame, [unlockAt, unlockAt + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
	const col = u > 0.5 ? C.highland : color;
	return (
		<svg width={size} height={size} viewBox="0 0 64 64" style={{overflow: 'visible'}}>
			<g transform={`translate(0 ${-8 * u}) rotate(${-25 * u} 44 28)`}>
				<path d="M20 30 V20 a12 12 0 0 1 24 0 V30" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" />
			</g>
			<rect x={12} y={28} width={40} height={30} rx={7} fill={C.espresso2} stroke={col} strokeWidth={4} />
			<circle cx={32} cy={41} r={4} fill={col} />
			<path d="M32 44 V50" stroke={col} strokeWidth={4} strokeLinecap="round" />
		</svg>
	);
};

export const FlaskBadge: React.FC<{text?: string; color?: string}> = ({text = 'TO BE TESTED', color = C.gold}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 10,
			padding: '6px 14px 6px 10px',
			borderRadius: 999,
			border: `2px dashed ${color}`,
			color,
			fontFamily: F.mono,
			fontWeight: 700,
			fontSize: 22,
			letterSpacing: '0.08em',
			whiteSpace: 'nowrap',
		}}
	>
		<svg width={26} height={26} viewBox="0 0 48 48">
			<path d="M18 6 H30 M20 6 V18 L8 40 H40 L28 18 V6" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M13 32 H35" stroke={color} strokeWidth={4} strokeLinecap="round" />
		</svg>
		{text}
	</div>
);

// Check tick that draws on.
export const Tick: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 30, color = C.highland}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<svg width={size} height={size} viewBox="0 0 30 30" style={{flexShrink: 0}}>
			<circle cx={15} cy={15} r={14} fill={color} opacity={0.18 * p} stroke={color} strokeOpacity={p} strokeWidth={2} />
			<path d="M8 15.5 L13 20.5 L22 10" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
		</svg>
	);
};
