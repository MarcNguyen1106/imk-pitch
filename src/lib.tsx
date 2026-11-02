// Motion helpers, contexts and small layout primitives shared by every scene.
import React, {createContext, useContext} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Timeline, TIMELINE, wordIndex} from './data/beats';
import {LEAD, SPRING} from './theme';

export type RenderMode = 'animatic' | 'overlay' | 'final';

export interface PitchProps {
	mode: RenderMode;
	showCaptions: boolean;
	showHud: boolean;
	speakerSrc?: string;
	reducedMotion: boolean;
	[key: string]: unknown;
}

export const TimelineCtx = createContext<Timeline>(TIMELINE);
export const useTimeline = () => useContext(TimelineCtx);

export const MotionCtx = createContext<{reduced: boolean; mode: RenderMode}>({reduced: false, mode: 'animatic'});
export const useMotion = () => useContext(MotionCtx);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Local frame (relative to the beat start) at which a cue on `phrase` fires.
export const cue = (beat: Beat, phrase: string, nth = 0, lead = LEAD) =>
	Math.round(beat.words[wordIndex(beat, phrase, nth)].frame - beat.start - lead);

export const wordAt = (beat: Beat, i: number, lead = LEAD) => Math.round(beat.words[i].frame - beat.start - lead);
export const speakEndLocal = (beat: Beat) => beat.speakEnd - beat.start;
export const durLocal = (beat: Beat) => beat.end - beat.start;

// Spring progress from `start` (local frames). Reduced motion swaps it for a 10-frame fade.
export const useSpr = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {reduced} = useMotion();
	return (start: number, config: Partial<typeof SPRING> = {}, durationInFrames?: number) => {
		if (reduced) return interpolate(frame, [start, start + 10], [0, 1], clamp);
		return spring({frame: frame - start, fps, config: {...SPRING, ...config}, durationInFrames});
	};
};

// Exit: 10-frame ease-in fade plus an 18 px slide.
export const exitProgress = (frame: number, end: number, len = 10) =>
	interpolate(frame, [end - len, end], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});

// Standard entrance (spring, 24 px rise) and exit (fade + 18 px slide) for an element.
export const useEnterExit = () => {
	const frame = useCurrentFrame();
	const spr = useSpr();
	return (start: number, end = Infinity, rise = 24, axis: 'y' | 'x' = 'y'): React.CSSProperties => {
		if (frame < start) return {opacity: 0};
		const p = spr(start);
		const e = end === Infinity ? 0 : exitProgress(frame, end);
		const off = (1 - p) * rise - e * 18;
		return {
			opacity: Math.min(1, p * 1.4) * (1 - e),
			transform: axis === 'y' ? `translateY(${off}px)` : `translateX(${-off}px)`,
		};
	};
};

// Panel states (A -> B -> C): 10-frame cross-fade with 12 px vertical drift.
export const stateStyle = (frame: number, start: number, end: number, first = false): React.CSSProperties => {
	const inP = first ? 1 : interpolate(frame, [start, start + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const outP = interpolate(frame, [end, end + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const visible = frame >= start - 1 && frame <= end + 10;
	return {
		position: 'absolute',
		inset: 0,
		opacity: visible ? inP * (1 - outP) : 0,
		transform: `translateY(${(1 - inP) * 12 - outP * 12}px)`,
		display: visible ? 'block' : 'none',
	};
};

export const easeOut = (frame: number, start: number, len: number) =>
	interpolate(frame, [start, start + len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
export const easeInOut = (frame: number, start: number, len: number) =>
	interpolate(frame, [start, start + len], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
export const lin = (frame: number, start: number, len: number) => interpolate(frame, [start, start + len], [0, 1], clamp);

export const Abs: React.FC<{x?: number; y?: number; w?: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
	x = 0,
	y = 0,
	w,
	h,
	style,
	children,
}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>{children}</div>;
