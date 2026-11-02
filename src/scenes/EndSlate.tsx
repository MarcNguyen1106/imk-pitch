// End slate (2 s, roast): emblem with the drop landing, title, evidence line, credits.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F, display} from '../theme';
import {clamp, useEnterExit} from '../lib';
import {Emblem} from '../components/Emblem';

export const EndSlate: React.FC = () => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const bg = interpolate(frame, [0, 8], [0, 1], clamp);
	return (
		<AbsoluteFill style={{background: C.roast, opacity: bg}}>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(50% 60% at 50% 38%, rgba(242,169,59,0.10), rgba(242,169,59,0))'}} />
			<div style={{position: 'absolute', left: 960 - 85, top: 70}}>
				<Emblem size={170} t={frame + 20} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', ...ee(4)}}>
				<div style={{...display(78)}}>
					Trung Nguyên Legend <span style={{color: C.gold}}>in Australia</span>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 432, textAlign: 'center', fontFamily: F.text, fontWeight: 600, fontSize: 34, color: C.crema, ...ee(7)}}>
				A 12-month pilot · Sydney & Melbourne · Apr 2027 – Mar 2028
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 506, textAlign: 'center', fontFamily: F.mono, fontSize: 24, color: C.gold, letterSpacing: '0.04em', ...ee(10)}}>
				Primary data: shelf audit (21 listings) · 44 reviews coded · claims audit
			</div>
			<div style={{position: 'absolute', left: 660, right: 660, top: 586, height: 2, background: 'rgba(246,231,208,0.15)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 618, textAlign: 'center', fontFamily: F.text, fontWeight: 700, fontSize: 34, color: C.crema, ...ee(12)}}>
				Nguyễn Lê Văn Đức · SID 22274040
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 672, textAlign: 'center', fontFamily: F.text, fontWeight: 500, fontSize: 28, color: C.cremaDim, ...ee(14)}}>
				MKTG3007 International Marketing · Applied Project Part 3 · Western Sydney University Vietnam
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', fontFamily: F.mono, fontSize: 22, color: C.cremaDim, opacity: 0.9 * bg}}>
				Map data: Natural Earth (public domain) · Fonts: Archivo, Be Vietnam Pro, JetBrains Mono (SIL OFL)
			</div>
		</AbsoluteFill>
	);
};
