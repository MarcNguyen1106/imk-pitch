// Shared scene wrappers.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../data/beats';
import {PANEL} from '../theme';
import {clamp, durLocal} from '../lib';

export interface SceneProps {
	beat: Beat;
}

// Panel content for one beat: fades in at the beat start and out over the last 10 frames.
export const BeatContent: React.FC<{beat: Beat; children: React.ReactNode; tailOut?: number; inDelay?: number; shake?: {x: number; y: number}; noFadeIn?: boolean}> = ({
	beat,
	children,
	tailOut = 0,
	inDelay = 4,
	shake = {x: 0, y: 0},
	noFadeIn,
}) => {
	const frame = useCurrentFrame();
	const end = durLocal(beat) + tailOut;
	const i = noFadeIn ? 1 : interpolate(frame, [inDelay, inDelay + 10], [0, 1], clamp);
	const o = interpolate(frame, [end - 10, end], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				width: PANEL.w,
				height: PANEL.h,
				opacity: i * (1 - o),
				transform: `translate(${shake.x}px, ${(1 - i) * 12 - o * 18 + shake.y}px)`,
			}}
		>
			{children}
		</div>
	);
};

export const P = PANEL.pad; // inner padding
export const CW = PANEL.w - 2 * PANEL.pad; // content width (672)
