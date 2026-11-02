// Ambient layers: animated film grain and slow steam curls.
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.03}) => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2) % 12; // grain drifts every other frame
	const dx = Math.round(random(`gx${seed}`) * 120);
	const dy = Math.round(random(`gy${seed}`) * 120);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'screen'}}>
			<filter id="grain-f" x="0" y="0" width="100%" height="100%">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
				<feComponentTransfer>
					<feFuncA type="linear" slope={3} />
				</feComponentTransfer>
			</filter>
			<rect x={-dx} y={-dy} width={2100} height={1260} filter="url(#grain-f)" />
		</svg>
	);
};

// Steam: three soft curls rising and fading on a loop. (x, y) is the base.
export const Steam: React.FC<{x: number; y: number; scale?: number; opacity?: number; color?: string}> = ({
	x,
	y,
	scale = 1,
	opacity = 0.5,
	color = C.crema,
}) => {
	const frame = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y}) scale(${scale})`} style={{pointerEvents: 'none'}}>
			{[0, 1, 2].map((i) => {
				const period = 90;
				const t = ((frame + i * 30) % period) / period;
				const rise = t * 70;
				const op = interpolate(t, [0, 0.25, 0.75, 1], [0, 1, 0.6, 0]) * opacity;
				const sway = Math.sin((frame + i * 40) / 22) * 6;
				const ox = (i - 1) * 16;
				return (
					<path
						key={i}
						d={`M${ox} 0 C${ox - 12 + sway} -18 ${ox + 12 + sway} -30 ${ox + sway} -48 C${ox - 10 + sway} -60 ${ox + 8} -70 ${ox + sway / 2} -84`}
						transform={`translate(0 ${-rise})`}
						fill="none"
						stroke={color}
						strokeWidth={4}
						strokeLinecap="round"
						opacity={op}
						style={{filter: 'blur(1.5px)'}}
					/>
				);
			})}
		</g>
	);
};
