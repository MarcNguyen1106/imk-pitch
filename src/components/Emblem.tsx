// Original project emblem: a geometric phin filter in line art; a gold drop falls and becomes a map pin.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {C} from '../theme';
import {clamp} from '../lib';

export const DROP_PATH = 'M0 -15 C5 -6 10 0 10 6 A10 10 0 0 1 -10 6 C-10 0 -5 -6 0 -15 Z';
export const PIN_PATH = 'M0 20 C-8 9 -13 2 -13 -5 A13 13 0 0 1 13 -5 C13 2 8 9 0 20 Z';

// t: frames since the emblem started. Draw 0-24, drop 24-46, pin 40-56.
export const Emblem: React.FC<{size?: number; t?: number; static?: boolean; showDrop?: boolean; style?: React.CSSProperties}> = ({
	size = 220,
	t = 999,
	static: isStatic = false,
	showDrop = true,
	style,
}) => {
	const draw = isStatic ? 1 : interpolate(t, [0, 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const fall = isStatic ? 1 : interpolate(t, [22, 44], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const morph = isStatic ? 1 : interpolate(t, [42, 54], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const dropOpacity = isStatic ? 0 : interpolate(t, [20, 24, 44, 48], [0, 1, 1, 0], clamp);
	const stroke = {
		fill: 'none',
		stroke: C.steel,
		strokeWidth: 5,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
		pathLength: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1 - draw,
	};
	const dropY = interpolate(fall, [0, 1], [142, 214]);
	const glow = interpolate(t, [44, 60, 90], [0, 0.9, 0.35], clamp);
	return (
		<svg width={size} height={(size * 280) / 200} viewBox="0 0 200 280" style={{overflow: 'visible', ...style}}>
			<defs>
				<radialGradient id="emb-glow">
					<stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
					<stop offset="100%" stopColor={C.gold} stopOpacity={0} />
				</radialGradient>
			</defs>
			{/* lid: flat disc with a small knob */}
			<path d="M93 44 V38 Q93 34 97 34 H103 Q107 34 107 38 V44" {...stroke} />
			<path d="M60 50 Q60 44 66 44 H134 Q140 44 140 50 V52 H60 Z" {...stroke} />
			{/* chamber: short cylinder, slightly narrower at the base */}
			<path d="M66 58 L70 116 M134 58 L130 116" {...stroke} />
			{/* coffee bed inside */}
			<path d="M72 100 H128" {...stroke} stroke={C.gold} />
			<path d="M73 108 H127" {...stroke} stroke={C.gold} strokeOpacity={0.55} />
			{/* wide saucer plate with drooping ears */}
			<path d="M22 120 H178" {...stroke} strokeWidth={7} />
			<path d="M22 120 L12 132 M178 120 L188 132" {...stroke} />
			{/* drip spout under the plate */}
			<path d="M86 126 L90 136 H110 L114 126" {...stroke} />
			{/* falling drop */}
			{showDrop ? (
				<g transform={`translate(100 ${dropY})`} opacity={dropOpacity}>
					<path d={DROP_PATH} fill={C.gold} />
				</g>
			) : null}
			{/* pin */}
			{showDrop ? (
				<g transform={`translate(100 228) scale(${0.4 + morph * 0.6})`} opacity={isStatic ? 1 : morph}>
					<ellipse cx={0} cy={26} rx={30} ry={8} fill="url(#emb-glow)" opacity={isStatic ? 0.5 : glow} />
					<path d={PIN_PATH} fill={C.gold} />
					<circle cx={0} cy={-5} r={5} fill={C.roast} />
				</g>
			) : null}
		</svg>
	);
};
