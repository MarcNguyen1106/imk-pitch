// Flat-vector morning kitchen: kettle, phin on a glass cup with gold drops, steam and window light.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp} from '../lib';
import {Steam} from './Grain';

export const KitchenVignette: React.FC<{at: number; width?: number; height?: number}> = ({at, width = 672, height = 430}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const fill = interpolate(t, [0, 260], [0, 1], clamp);
	const rays = 0.5 + 0.5 * Math.sin(frame / 40);
	const par = Math.min(t, 300) * 0.04; // very slow parallax (< 2 px/s)
	const cupX = 418;
	const cupTop = 236;
	const cupBot = 352;
	const level = cupBot - 8 - fill * 70;
	const drops = [0, 1, 2, 3].map((i) => {
		const period = 22;
		const tt = (((t + i * (period / 2)) % (period * 2)) + period * 2) % (period * 2);
		const y = interpolate(tt, [0, period], [cupTop - 6, level - 4], clamp);
		const o = tt < period ? interpolate(tt, [0, 3, period - 2, period], [0, 1, 1, 0], clamp) : 0;
		return {y, o};
	});
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{borderRadius: 20, overflow: 'hidden', display: 'block'}}>
			<defs>
				<linearGradient id="kw-wall" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#3d271e" />
					<stop offset="100%" stopColor="#2b1a13" />
				</linearGradient>
				<linearGradient id="kw-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#3b6a80" />
					<stop offset="60%" stopColor="#e9a35a" />
					<stop offset="100%" stopColor="#ffd38a" />
				</linearGradient>
				<linearGradient id="kw-ray" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={C.goldHot} stopOpacity={0.32} />
					<stop offset="100%" stopColor={C.goldHot} stopOpacity={0} />
				</linearGradient>
				<linearGradient id="kw-steel" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#6f787d" />
					<stop offset="45%" stopColor="#c9d0d3" />
					<stop offset="100%" stopColor="#7b8489" />
				</linearGradient>
				<linearGradient id="kw-coffee" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#7a4321" />
					<stop offset="100%" stopColor="#2a140a" />
				</linearGradient>
				<clipPath id="kw-cup">
					<path d={`M${cupX - 46} ${cupTop} L${cupX - 40} ${cupBot} H${cupX + 40} L${cupX + 46} ${cupTop} Z`} />
				</clipPath>
			</defs>
			<rect width={width} height={height} fill="url(#kw-wall)" />
			{/* window */}
			<g transform={`translate(${-par} 0)`}>
				<rect x={48} y={34} width={230} height={196} rx={8} fill="url(#kw-sky)" />
				<circle cx={210} cy={176} r={28} fill="#FFE2A6" opacity={0.9} />
				<path d="M48 190 Q110 168 170 186 T278 180 V230 H48 Z" fill="#2c4d5c" opacity={0.65} />
				<rect x={48} y={34} width={230} height={196} rx={8} fill="none" stroke={C.steel} strokeWidth={6} />
				<line x1={163} y1={34} x2={163} y2={230} stroke={C.steel} strokeWidth={5} />
				<line x1={48} y1={128} x2={278} y2={128} stroke={C.steel} strokeWidth={5} />
			</g>
			{/* light rays */}
			<path d={`M60 230 L278 230 L${520 + par * 2} ${height} L${160} ${height} Z`} fill="url(#kw-ray)" opacity={0.6 + rays * 0.3} />
			{/* tiles */}
			{Array.from({length: 7}, (_, i) => (
				<line key={i} x1={300 + i * 56} y1={40} x2={300 + i * 56} y2={300} stroke="#ffffff" strokeOpacity={0.03} />
			))}
			{/* counter */}
			<rect x={0} y={352} width={width} height={height - 352} fill="#4a2f22" />
			<rect x={0} y={352} width={width} height={6} fill="#6a4532" />
			<rect x={0} y={358} width={width} height={height} fill="#000" opacity={0.15} />
			{/* kettle */}
			<g transform="translate(110 0)">
				<path d="M-58 352 C-62 300 -50 262 0 258 C50 262 62 300 58 352 Z" fill="url(#kw-steel)" />
				<path d="M-36 262 C-30 236 30 236 36 262" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
				<path d="M54 300 C80 292 92 276 104 262" fill="none" stroke="url(#kw-steel)" strokeWidth={14} strokeLinecap="round" />
				<rect x={-60} y={346} width={120} height={8} rx={4} fill="#2a1b14" />
				<ellipse cx={-20} cy={300} rx={10} ry={30} fill="#fff" opacity={0.25} />
			</g>
			<Steam x={214} y={258} scale={0.7} opacity={0.35} />
			{/* glass cup */}
			<g clipPath="url(#kw-cup)">
				<rect x={cupX - 50} y={level} width={100} height={cupBot - level + 4} fill="url(#kw-coffee)" />
				<rect x={cupX - 50} y={level} width={100} height={4} fill="#c98a4b" opacity={0.7} />
			</g>
			<path d={`M${cupX - 46} ${cupTop} L${cupX - 40} ${cupBot} H${cupX + 40} L${cupX + 46} ${cupTop}`} fill="rgba(255,255,255,0.06)" stroke="rgba(246,231,208,0.65)" strokeWidth={3} />
			<line x1={cupX - 34} y1={cupTop + 14} x2={cupX - 30} y2={cupBot - 14} stroke="#fff" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" />
			{/* phin on top of cup */}
			<g>
				<rect x={cupX - 64} y={cupTop - 8} width={128} height={8} rx={4} fill="url(#kw-steel)" />
				<path d={`M${cupX - 36} ${cupTop - 8} L${cupX - 40} ${cupTop - 74} H${cupX + 40} L${cupX + 36} ${cupTop - 8} Z`} fill="url(#kw-steel)" />
				<rect x={cupX - 44} y={cupTop - 84} width={88} height={12} rx={5} fill="url(#kw-steel)" />
				<rect x={cupX - 12} y={cupTop - 96} width={24} height={14} rx={4} fill="url(#kw-steel)" />
			</g>
			{drops.map((d, i) => (
				<path key={i} d="M0 -7 C2.5 -3 5 0 5 3 A5 5 0 0 1 -5 3 C-5 0 -2.5 -3 0 -7 Z" transform={`translate(${cupX} ${d.y})`} fill={C.gold} opacity={d.o} />
			))}
			<Steam x={cupX} y={cupTop - 100} scale={0.6} opacity={0.3} />
			{/* plant */}
			<g transform="translate(590 352)">
				<path d="M-24 0 L-20 -44 H20 L24 0 Z" fill="#5b3b2c" />
				{[-50, -20, 10, 40].map((a, i) => (
					<path
						key={i}
						d="M0 -44 C-10 -80 -4 -110 0 -124 C4 -110 10 -80 0 -44 Z"
						fill={C.highland}
						opacity={0.85}
						transform={`rotate(${a + Math.sin((frame + i * 20) / 50) * 2})`}
					/>
				))}
			</g>
			{/* tag */}
			<g transform={`translate(${width - 24} 30)`}>
				<rect x={-318} y={-4} width={318} height={42} rx={21} fill="rgba(18,11,8,0.82)" stroke={C.gold} strokeWidth={2} />
				<text x={-159} y={24} textAnchor="middle" fill={C.gold} fontFamily={F.mono} fontWeight={700} fontSize={22} letterSpacing="0.1em">
					MELBOURNE · 7:00 AM
				</text>
			</g>
		</svg>
	);
};

// Takeaway cup (steel) that flips (3D Y-rotation) into a phin cup (gold).
export const CupFlip: React.FC<{flipAt?: number; size?: number}> = ({flipAt, size = 54}) => {
	const frame = useCurrentFrame();
	const p = flipAt === undefined ? 0 : interpolate(frame, [flipAt, flipAt + 14], [0, 1], clamp);
	const rot = p * 180;
	const showBack = rot > 90;
	const s = {fill: 'none', strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<div style={{width: size, height: size * 1.3, perspective: 400}}>
			<div style={{width: '100%', height: '100%', transform: `rotateY(${showBack ? rot - 180 : rot}deg)`}}>
				{!showBack ? (
					<svg width={size} height={size * 1.3} viewBox="0 0 48 62">
						<path d="M8 14 H40 L36 58 H12 Z" {...s} stroke={C.steel} />
						<path d="M6 8 H42 V14 H6 Z" {...s} stroke={C.steel} />
						<path d="M11 30 H37" {...s} stroke={C.steel} strokeOpacity={0.6} />
					</svg>
				) : (
					<svg width={size} height={size * 1.3} viewBox="0 0 48 62">
						<path d="M12 6 H36 M14 6 V20 H34 V6" {...s} stroke={C.gold} />
						<path d="M6 22 H42" {...s} stroke={C.gold} />
						<path d="M12 26 L15 58 H33 L36 26" {...s} stroke={C.gold} />
						<path d="M15 44 H33 L33 58 H15 Z" fill={C.gold} opacity={0.35} />
						<path d="M24 28 V34" {...s} stroke={C.goldHot} />
					</svg>
				)}
			</div>
		</div>
	);
};
