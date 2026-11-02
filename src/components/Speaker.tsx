// Speaker layer: clean backdrop (animatic), real footage (final), and the PIP spring move.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, PIP} from '../theme';

// Region of the 16:9 source shown inside the PIP window (keeps the face large).
export const PIP_CROP = {x: 0, y: 60, w: 1040, h: 585};

export const StudioBackdrop: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = Math.sin(frame / 300) * 6;
	return (
		<AbsoluteFill style={{background: `radial-gradient(120% 90% at 30% 40%, #3a241a 0%, ${C.espresso} 45%, ${C.roast} 100%)`}}>
			{/* soft window light on the back wall */}
			<div
				style={{
					position: 'absolute',
					left: 1180 + drift,
					top: -120,
					width: 900,
					height: 1300,
					background: `linear-gradient(100deg, rgba(255,201,101,0) 0%, rgba(255,201,101,0.06) 40%, rgba(255,201,101,0) 70%)`,
					transform: 'skewX(-14deg)',
				}}
			/>
			{/* bokeh shelf lights */}
			{[
				[1300, 300, 70, 0.08],
				[1520, 220, 46, 0.07],
				[1700, 420, 90, 0.05],
				[1420, 620, 54, 0.05],
				[1780, 160, 40, 0.06],
				[160, 160, 60, 0.04],
			].map(([x, y, r, o], i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: x - r + drift * (i % 2 ? 1 : -1),
						top: y - r,
						width: r * 2,
						height: r * 2,
						borderRadius: '50%',
						background: `radial-gradient(circle, rgba(242,169,59,${o * 2}) 0%, rgba(242,169,59,${o}) 50%, rgba(242,169,59,0) 70%)`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};

// Animatic stand-in for the camera: a clean studio backdrop only (no silhouette, no labels),
// so the left side stays clear for the real recording.
export const SpeakerPlaceholder: React.FC = () => (
	<AbsoluteFill>
		<StudioBackdrop />
	</AbsoluteFill>
);

export const SpeakerVideo: React.FC<{src: string}> = ({src}) => (
	<AbsoluteFill>
		<OffthreadVideo
			src={src.startsWith('http') ? src : staticFile(src)}
			style={{width: 1920, height: 1080, objectFit: 'cover', filter: 'sepia(0.06) saturate(1.04) contrast(1.05) brightness(1.01)'}}
		/>
	</AbsoluteFill>
);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// p = 0 full frame, p = 1 PIP window (512 x 288 at 64, 120).
export const SpeakerFrame: React.FC<{p: number; children?: React.ReactNode; ringOnly?: boolean}> = ({p, children, ringOnly}) => {
	const full = {x: 0, y: 0, w: 1920, h: 1080};
	const src = {
		x: lerp(full.x, PIP_CROP.x, p),
		y: lerp(full.y, PIP_CROP.y, p),
		w: lerp(full.w, PIP_CROP.w, p),
		h: lerp(full.h, PIP_CROP.h, p),
	};
	const dst = {x: lerp(0, PIP.x, p), y: lerp(0, PIP.y, p), w: lerp(1920, PIP.w, p), h: lerp(1080, PIP.h, p)};
	const s = dst.w / src.w;
	const radius = PIP.r * Math.min(1, p * 1.5);
	return (
		<>
			{!ringOnly ? (
				<div
					style={{
						position: 'absolute',
						left: dst.x,
						top: dst.y,
						width: dst.w,
						height: dst.h,
						borderRadius: radius,
						overflow: 'hidden',
						boxShadow: p > 0.01 ? `0 ${24 * p}px ${60 * p}px rgba(0,0,0,${0.55 * p})` : undefined,
					}}
				>
					<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${-src.x * s}px, ${-src.y * s}px) scale(${s})`}}>
						{children}
					</div>
				</div>
			) : null}
			{p > 0.02 ? (
				<div
					style={{
						position: 'absolute',
						left: dst.x - 1.5,
						top: dst.y - 1.5,
						width: dst.w + 3,
						height: dst.h + 3,
						borderRadius: radius + 1.5,
						border: `3px solid ${C.gold}`,
						opacity: Math.min(1, p * 1.2),
						boxSizing: 'border-box',
					}}
				/>
			) : null}
		</>
	);
};
