// Panel shell and in-panel primitives: Eyebrow, SourceTag, Footnote, KeywordPop, Counter, Stamp, StrikeRevise.
import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C, F, PANEL, body, display, eyebrow, footnote, sourceTag} from '../theme';
import {clamp, useMotion} from '../lib';

export const PanelShell: React.FC<{p: number; exit?: number; accent?: string; children?: React.ReactNode; shake?: {x: number; y: number}}> = ({
	p,
	exit = 0,
	accent = C.gold,
	children,
	shake = {x: 0, y: 0},
}) => {
	const {mode} = useMotion();
	if (p <= 0.001 && exit === 0) return null;
	const op = Math.min(1, p * 1.3) * (1 - exit);
	return (
		<div
			style={{
				position: 'absolute',
				left: PANEL.x,
				top: PANEL.y,
				width: PANEL.w,
				height: PANEL.h,
				opacity: op,
				transform: `translate(${(1 - p) * 60 + shake.x}px, ${exit * 18 + shake.y}px) scale(${0.97 + 0.03 * p})`,
				transformOrigin: '100% 50%',
			}}
		>
			{/* crema glow behind the panel */}
			<div
				style={{
					position: 'absolute',
					inset: -160,
					background: `radial-gradient(closest-side, rgba(242,169,59,0.08), rgba(242,169,59,0))`,
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: PANEL.r,
					background: 'rgba(36,21,15,0.92)',
					backdropFilter: mode === 'overlay' ? 'blur(18px)' : 'blur(18px)',
					boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(246,231,208,0.07)',
					border: '1px solid rgba(246,231,208,0.08)',
					overflow: 'hidden',
				}}
			>
				<div style={{position: 'absolute', left: 40, right: 40, top: 0, height: 3, background: accent, borderRadius: 2, opacity: 0.9}} />
				{children}
			</div>
		</div>
	);
};

export const Eyebrow: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.gold, style}) => (
	<div style={{...eyebrow, color, display: 'flex', alignItems: 'center', gap: 12, ...style}}>
		<span style={{width: 10, height: 10, borderRadius: 5, background: color, display: 'inline-block'}} />
		{children}
	</div>
);

export const SourceTag: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div style={{...sourceTag, position: 'absolute', left: PANEL.pad, bottom: 30, right: PANEL.pad, ...style}}>
		SOURCE · {children}
	</div>
);

export const Footnote: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div style={{...footnote, ...style}}>{children}</div>
);

// Keyword pop: scale 0.85 -> 1.06 -> 1.0 over 12 frames; gold-hot highlighter swipe settles at 25 %.
export const KeywordPop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; swipe?: boolean; color?: string}> = ({
	at,
	children,
	style,
	swipe = true,
	color = C.goldHot,
}) => {
	const frame = useCurrentFrame();
	const {reduced} = useMotion();
	const t = frame - at;
	const scale = reduced ? 1 : interpolate(t, [0, 7, 12], [0.85, 1.06, 1], clamp);
	const op = interpolate(t, [0, 4], [0, 1], clamp);
	const sw = interpolate(t, [2, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const swOp = interpolate(t, [12, 24], [0.55, 0.25], clamp);
	return (
		<span style={{position: 'relative', display: 'inline-block', transform: `scale(${scale})`, opacity: op, transformOrigin: '0% 60%', ...style}}>
			{swipe ? (
				<span
					style={{
						position: 'absolute',
						left: -6,
						right: -6,
						top: '18%',
						bottom: '8%',
						background: color,
						opacity: swOp,
						borderRadius: 6,
						transformOrigin: '0 50%',
						transform: `scaleX(${sw})`,
						zIndex: 0,
					}}
				/>
			) : null}
			<span style={{position: 'relative', zIndex: 1}}>{children}</span>
		</span>
	);
};

export const Counter: React.FC<{from?: number; to: number; at: number; len?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties}> = ({
	from = 0,
	to,
	at,
	len = 30,
	decimals = 0,
	prefix = '',
	suffix = '',
	style,
}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [at, at + len], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
	const shown = frame >= at + len ? to : v;
	return (
		<span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
			{prefix}
			{shown.toLocaleString('en-AU', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}
			{suffix}
		</span>
	);
};

// Camera shake applied to the panel when a stamp lands: 4 frames, 6 px.
export const stampShake = (frame: number, at: number) => {
	const t = frame - at - 6;
	if (t < 0 || t >= 4) return {x: 0, y: 0};
	const amp = 6 * (1 - t / 4);
	return {x: (random(`sx${at}${t}`) - 0.5) * 2 * amp, y: (random(`sy${at}${t}`) - 0.5) * 2 * amp};
};

export const Stamp: React.FC<{at: number; text: string; sub?: string; color?: string; rotate?: number; size?: number; style?: React.CSSProperties; icon?: React.ReactNode}> = ({
	at,
	text,
	sub,
	color = C.gold,
	rotate = -6,
	size = 34,
	style,
	icon,
}) => {
	const frame = useCurrentFrame();
	const {reduced} = useMotion();
	const t = frame - at;
	if (t < 0) return null;
	const scale = reduced ? 1 : interpolate(t, [0, 6, 9], [1.4, 0.97, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const rot = reduced ? rotate : rotate + interpolate(t, [0, 6], [2, 0], clamp);
	const op = interpolate(t, [0, 3], [0, 1], clamp);
	const id = `ink${at}`;
	return (
		<div style={{position: 'absolute', transform: `rotate(${rot}deg) scale(${scale})`, opacity: op, ...style}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={id}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={at % 50} result="n" />
					<feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} />
				</filter>
			</svg>
			<div
				style={{
					border: `4px solid ${color}`,
					borderRadius: 10,
					padding: '10px 22px 8px',
					color,
					fontFamily: F.display,
					fontWeight: 900,
					fontStretch: '125%',
					fontSize: size,
					letterSpacing: '0.02em',
					textTransform: 'uppercase',
					lineHeight: 1.05,
					whiteSpace: 'nowrap',
					filter: `url(#${id})`,
					background: 'rgba(18,11,8,0.82)',
					boxShadow: `inset 0 0 0 3px rgba(18,11,8,0.82), inset 0 0 0 5px ${color}55`,
					display: 'flex',
					alignItems: 'center',
					gap: 14,
				}}
			>
				{icon}
				<div>
					{text}
					{sub ? <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 22, letterSpacing: '0.08em', fontStretch: '100%', marginTop: 4}}>{sub}</div> : null}
				</div>
			</div>
		</div>
	);
};

// Strike and revise: old claim types on (crema-dim), robusta strike L->R over 8 frames, revision slides up.
export const StrikeRevise: React.FC<{
	at: number;
	old: string;
	revised: React.ReactNode;
	strikeAt: number;
	reviseAt: number;
	oldSize?: number;
	size?: number;
	width?: number;
}> = ({at, old, revised, strikeAt, reviseAt, oldSize = 30, size = 44, width = 672}) => {
	const frame = useCurrentFrame();
	const chars = Math.floor(interpolate(frame, [at, at + Math.max(10, old.length * 0.9)], [0, old.length], clamp));
	const strike = interpolate(frame, [strikeAt, strikeAt + 8], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const rv = interpolate(frame, [reviseAt, reviseAt + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const caret = frame < at + old.length * 0.9 + 6 && Math.floor(frame / 8) % 2 === 0;
	return (
		<div style={{width}}>
			<div style={{position: 'relative', display: 'inline-block', ...body(oldSize, 500), color: C.cremaDim, opacity: frame >= at ? 1 : 0}}>
				{old.slice(0, chars)}
				<span style={{opacity: caret ? 1 : 0, color: C.gold}}>▍</span>
				<div
					style={{
						position: 'absolute',
						left: -4,
						top: '52%',
						height: 4,
						width: `calc(${strike * 100}% + 8px)`,
						background: C.robusta,
						borderRadius: 2,
					}}
				/>
			</div>
			<div style={{...display(size), marginTop: 14, opacity: rv, transform: `translateY(${(1 - rv) * 22}px)`}}>{revised}</div>
		</div>
	);
};

export const Gold: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.gold}) => <span style={{color}}>{children}</span>;

export const Chip: React.FC<{children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties; icon?: React.ReactNode}> = ({
	children,
	color = C.crema,
	bg = C.espresso2,
	style,
	icon,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			padding: '10px 18px',
			borderRadius: 999,
			background: bg,
			border: '1px solid rgba(246,231,208,0.12)',
			fontFamily: F.mono,
			fontWeight: 500,
			fontSize: 22,
			letterSpacing: '0.06em',
			color,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{icon}
		{children}
	</div>
);
