// B01 Hook (STRAP): emblem draws top right, the drop lands as the HUD emblem; name strap; route tag.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp, cue, durLocal, useEnterExit} from '../lib';
import {DROP_PATH, Emblem} from '../components/Emblem';
import {NameStrap} from '../components/NameStrap';
import {SceneProps} from './common';

export const B01_DROP = {launch: 58, land: 84};
const EMB = {x: 1390, y: 136, size: 220};

export const B01Hook: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const exit = interpolate(frame, [end - 12, end], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	// drop flies from the pin to the HUD emblem slot
	const fp = interpolate(frame, [B01_DROP.launch, B01_DROP.land], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const sx = EMB.x + 110;
	const sy = EMB.y + (228 / 280) * 308;
	const tx = 96 + 18 + 16;
	const ty = 40 + 26;
	const dx = sx + (tx - sx) * fp;
	const dy = sy + (ty - sy) * fp - Math.sin(fp * Math.PI) * 140;
	const dropScale = 1.6 - fp * 0.8;
	const tagAt = cue(beat, 'twelve-month');
	const routeAt = cue(beat, 'Sydney');
	return (
		<div style={{position: 'absolute', inset: 0}}>
			<div style={{position: 'absolute', left: EMB.x, top: EMB.y, opacity: 1 - exit, transform: `translateY(${-exit * 18}px)`}}>
				<div style={{position: 'absolute', left: -200, top: -120, width: 620, height: 620, background: 'radial-gradient(closest-side, rgba(242,169,59,0.12), rgba(242,169,59,0))'}} />
				<Emblem size={EMB.size} t={frame} />
			</div>
			{frame >= B01_DROP.launch && frame <= B01_DROP.land + 2 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<g transform={`translate(${dx} ${dy}) scale(${dropScale}) rotate(${fp * 20})`}>
						<path d={DROP_PATH} fill={C.gold} />
					</g>
					{[0.06, 0.12, 0.18].map((lag, i) => {
						const q = Math.max(0, fp - lag);
						const x = sx + (tx - sx) * q;
						const y = sy + (ty - sy) * q - Math.sin(q * Math.PI) * 140;
						return <circle key={i} cx={x} cy={y} r={5 - i * 1.3} fill={C.goldHot} opacity={0.5 - i * 0.14} />;
					})}
				</svg>
			) : null}
			{/* route tag under the emblem */}
			<div style={{position: 'absolute', left: 1180, width: 640, top: 486, textAlign: 'center', ...ee(routeAt, end - 2)}}>
				<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em', color: C.crema, whiteSpace: 'nowrap'}}>
					TRUNG NGUYÊN LEGEND <span style={{color: C.gold}}>→</span> SYDNEY · MELBOURNE
				</div>
			</div>
			<div style={{position: 'absolute', left: 1180, width: 640, top: 540, display: 'flex', justifyContent: 'center', ...ee(Math.max(tagAt, routeAt + 6), end - 2)}}>
				<div
					style={{
						padding: '8px 18px',
						borderRadius: 999,
						border: `2px solid ${C.gold}`,
						background: 'rgba(18,11,8,0.7)',
						fontFamily: F.mono,
						fontWeight: 500,
						fontSize: 22,
						letterSpacing: '0.1em',
						color: C.gold,
					}}
				>
					APR 2027 – MAR 2028
				</div>
			</div>
			<NameStrap at={cue(beat, 'Nguyễn')} out={end + 24} />
		</div>
	);
};
