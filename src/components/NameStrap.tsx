// Lower-left name strap on an espresso plate with a gold edge line.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp} from '../lib';

export const NameStrap: React.FC<{at: number; out: number; sub?: string}> = ({at, out, sub = 'Proposal · 12-month pilot · Sydney & Melbourne'}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > out + 12) return null;
	const wipe = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const line = interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const t1 = interpolate(frame, [at + 6, at + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const t2 = interpolate(frame, [at + 10, at + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const exit = interpolate(frame, [out, out + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return (
		<div style={{position: 'absolute', left: 96, top: 744, opacity: 1 - exit, transform: `translateX(${-exit * 18}px)`}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 6, height: 126 * line, background: C.gold, borderRadius: 3}} />
			<div
				style={{
					marginLeft: 6,
					padding: '16px 34px 18px 26px',
					background: 'rgba(36,21,15,0.92)',
					borderRadius: '0 14px 14px 0',
					clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
					boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
				}}
			>
				<div
					style={{
						fontFamily: F.display,
						fontWeight: 800,
						fontStretch: '112%',
						fontSize: 52,
						color: C.crema,
						lineHeight: 1.1,
						opacity: t1,
						transform: `translateY(${(1 - t1) * 14}px)`,
						whiteSpace: 'nowrap',
					}}
				>
					Nguyễn Lê Văn Đức
				</div>
				<div
					style={{
						fontFamily: F.mono,
						fontWeight: 500,
						fontSize: 24,
						letterSpacing: '0.06em',
						color: C.gold,
						marginTop: 6,
						opacity: t2,
						transform: `translateY(${(1 - t2) * 10}px)`,
						whiteSpace: 'nowrap',
					}}
				>
					{sub}
				</div>
			</div>
		</div>
	);
};
