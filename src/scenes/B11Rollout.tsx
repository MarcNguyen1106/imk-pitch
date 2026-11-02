// B11 Roll-out (PIP), the showpiece: a dusk road from JAN 2027 to MAR 2028 with three go/no-go gates.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F, body, display, footnote} from '../theme';
import {clamp, cue, durLocal, useEnterExit} from '../lib';
import {DROP_PATH} from '../components/Emblem';
import {BoomGate, GateSign, Padlock, Tick, TrafficLight} from '../components/Signage';
import {Icon, IconName} from '../components/Icon';
import {SceneProps} from './common';

const M0 = 760; // world x of 1 Jan 2027
const MW = 150; // px per month
const mx = (i: number) => M0 + i * MW; // start of month i (0 = Jan 2027)
const mc = (i: number) => mx(i) + MW / 2;
const roadY = (x: number) => 700 + 24 * Math.sin(x / 380);
const G0 = mc(2);
const LAUNCH = mc(3);
const G1 = mc(8);
const G2 = mc(14);
const FORK = G2 + 90;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];

const roadPath = (x0: number, x1: number) => {
	const pts: string[] = [];
	for (let x = x0; x <= x1; x += 20) pts.push(`${x},${roadY(x).toFixed(1)}`);
	return 'M' + pts.join(' L');
};

const forkPath = (dy: number) => {
	const y0 = roadY(FORK);
	return `M${FORK} ${y0} C${FORK + 160} ${y0} ${FORK + 200} ${y0 + dy} ${FORK + 420} ${y0 + dy}`;
};

const Hills: React.FC<{camX: number; k: number; base: number; amp: number; color: string; seed: number}> = ({camX, k, base, amp, color, seed}) => {
	const pts: string[] = [];
	for (let i = -2; i < 26; i++) {
		const x = i * 180 - camX * k;
		const y = base - amp * (0.5 + 0.5 * Math.sin(i * 1.7 + seed)) - amp * 0.4 * Math.sin(i * 0.6 + seed * 2);
		pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
	}
	return <polygon points={`-400,1080 ${pts.join(' ')} 4600,1080`} fill={color} />;
};

const Check: React.FC<{at: number; children: React.ReactNode; color?: string}> = ({at, children, color = C.highland}) => {
	const frame = useCurrentFrame();
	const done = frame >= at;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: done ? 1 : 0.55}}>
			{done ? <Tick at={at} size={28} color={color} /> : <div style={{width: 28, height: 28, borderRadius: 14, border: '2px solid rgba(154,163,168,0.6)', flexShrink: 0}} />}
			<div style={{...body(24, 600), color: done ? C.crema : C.cremaDim, lineHeight: 1.2}}>{children}</div>
		</div>
	);
};

export const B11Rollout: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const three = cue(beat, 'Three');
	const mar27 = cue(beat, 'March 2027');
	const accept = cue(beat, 'accept our price');
	const consents = cue(beat, 'consents');
	const certified = cue(beat, 'certified stock');
	const ready = cue(beat, 'ready.');
	const sep = cue(beat, 'September');
	const sell = cue(beat, 'sell-through');
	const repeat = cue(beat, 'repeat buying');
	const unlock = cue(beat, 'unlock');
	const mar28 = cue(beat, 'March 2028');
	const margin = cue(beat, 'margin');
	const scale = cue(beat, 'scale,');
	const adjust = cue(beat, 'adjust');
	const exit = cue(beat, 'exit.');
	const green = ready + 4;
	const lift = green + 6;

	// camera pans in world x
	const camX =
		interpolate(frame, [sep - 6, sep + 26], [0, 935], {...clamp, easing: Easing.inOut(Easing.cubic)}) +
		interpolate(frame, [mar28 - 6, mar28 + 26], [0, 1000], {...clamp, easing: Easing.inOut(Easing.cubic)});
	// token along the road
	const tokenX =
		interpolate(frame, [6, mar27 + 4], [mx(0) - 40, G0 - 70], {...clamp, easing: Easing.inOut(Easing.cubic)}) +
		interpolate(frame, [lift + 4, lift + 20], [0, LAUNCH - (G0 - 70)], {...clamp, easing: Easing.inOut(Easing.cubic)}) +
		interpolate(frame, [sep, sep + 26], [0, G1 - 70 - LAUNCH], {...clamp, easing: Easing.inOut(Easing.cubic)}) +
		interpolate(frame, [mar28, mar28 + 26], [0, FORK - (G1 - 70)], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const tokenY = roadY(tokenX) - 34 + Math.sin(frame / 6) * 3;

	const bg = interpolate(frame, [0, 10, end - 8, end + 4], [0, 1, 1, 0], clamp);
	const boardCollapse = interpolate(frame, [mar27, mar27 + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const released = interpolate(frame, [lift + 10, lift + 18], [0, 1], clamp);
	const forkLit = (at: number) => interpolate(frame, [at, at + 8], [0, 1], clamp);
	const w = (x: number) => x - camX; // world -> screen x
	const fadeG0 = interpolate(frame, [sep - 4, sep + 10], [1, 0], clamp);
	const fadeG1 = interpolate(frame, [mar28 - 4, mar28 + 10], [1, 0], clamp);

	const phase0: {i: IconName; t: string; s: string}[] = [
		{i: 'people', t: 'Buyer study: 200 survey + 60 tasting', s: 'Buyer study'},
		{i: 'handshake', t: 'Cooee: talks → MoU → written consent', s: 'Cooee consent'},
		{i: 'tag', t: 'Marks filed', s: 'Marks filed'},
		{i: 'clipboard', t: 'Distributor signed', s: 'Distributor'},
		{i: 'chain', t: 'Lot-level certificates', s: 'Certificates'},
		{i: 'people', t: 'Bicultural Sydney team', s: 'Sydney team'},
	];

	return (
		<div style={{position: 'absolute', inset: 0, opacity: bg, overflow: 'hidden'}}>
			{/* sky and land */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#0f2632" />
						<stop offset="45%" stopColor={C.harbour} />
						<stop offset="72%" stopColor="#5b3a2c" />
						<stop offset="100%" stopColor="#c27a38" />
					</linearGradient>
				</defs>
				<rect width={1920} height={1080} fill="url(#dusk)" />
				<circle cx={1500 - camX * 0.05} cy={560} r={70} fill={C.goldHot} opacity={0.35} />
				<Hills camX={camX} k={0.25} base={600} amp={120} color="#2b2a2f" seed={1} />
				<Hills camX={camX} k={0.5} base={660} amp={90} color="#2a1c17" seed={3} />
				<g transform={`translate(${-camX} 0)`}>
					<rect x={-400} y={700} width={5000} height={400} fill="#1e130e" />
					{/* road */}
					<path d={roadPath(0, FORK)} fill="none" stroke="#3a2a22" strokeWidth={84} strokeLinecap="round" />
					<path d={roadPath(0, FORK)} fill="none" stroke="#120B08" strokeWidth={70} strokeLinecap="round" />
					<path d={roadPath(0, FORK)} fill="none" stroke={C.gold} strokeOpacity={0.55} strokeWidth={4} strokeDasharray="24 22" />
					{/* fork */}
					{[
						{dy: -150, at: scale},
						{dy: 0, at: adjust},
						{dy: 120, at: exit},
					].map((f, i) => (
						<g key={i} opacity={interpolate(frame, [mar28 + 10, mar28 + 26], [0, 1], clamp)}>
							<path d={forkPath(f.dy)} fill="none" stroke="#120B08" strokeWidth={56} strokeLinecap="round" />
							<path d={forkPath(f.dy)} fill="none" stroke={i === 2 ? C.robusta : i === 0 ? C.highland : C.gold} strokeOpacity={0.25 + 0.75 * forkLit(f.at)} strokeWidth={5} strokeDasharray="18 16" />
						</g>
					))}
					{/* faded extension to 2029 */}
					<path d={`M${FORK + 420} ${roadY(FORK) - 150} C${FORK + 600} ${roadY(FORK) - 160} ${FORK + 700} ${roadY(FORK) - 300} ${FORK + 1200} ${roadY(FORK) - 420}`} stroke={C.gold} strokeOpacity={0.25} strokeWidth={4} strokeDasharray="6 14" />
					{/* phase 0 band on the ruler */}
					<rect x={mx(0)} y={792} width={3 * MW} height={8} fill={C.gold} opacity={0.8} />
					{/* month ruler */}
					<line x1={mx(0)} y1={800} x2={mx(15)} y2={800} stroke={C.steel} strokeWidth={2} />
					<line x1={mx(15)} y1={800} x2={mx(15) + 900} y2={800} stroke={C.steel} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="4 10" />
					{MONTHS.map((m, i) => (
						<g key={i}>
							<line x1={mx(i)} y1={792} x2={mx(i)} y2={810} stroke={C.steel} strokeWidth={2} />
							<text x={mc(i)} y={836} textAnchor="middle" fill={i === 2 || i === 8 || i === 14 ? C.gold : C.cremaDim} fontFamily={F.mono} fontWeight={i === 2 || i === 8 || i === 14 ? 700 : 500} fontSize={22}>
								{m}
							</text>
							{i === 0 || i === 12 ? (
								<text x={mx(i) + 6} y={782} fill={C.crema} fontFamily={F.mono} fontWeight={700} fontSize={22}>
									{i === 0 ? '2027' : '2028'}
								</text>
							) : null}
						</g>
					))}
					{/* gate posts on the road */}
					{[G0, G1, G2].map((g, i) => (
						<g key={i}>
							<line x1={g} y1={roadY(g) - 50} x2={g} y2={roadY(g) + 40} stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" />
						</g>
					))}
				</g>
			</svg>

			{/* PHASE 0 board */}
			<div style={{position: 'absolute', left: w(620), top: 150, width: 560, ...ee(4), opacity: Number(ee(4).opacity ?? 1) * fadeG0}}>
				<div style={{background: 'rgba(18,11,8,0.86)', border: `2px solid ${C.gold}`, borderRadius: 18, padding: '16px 20px 18px', boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', color: C.gold}}>PHASE 0 · PREP & PROOF</div>
					<div style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>JAN – MAR 2027</div>
					<div style={{marginTop: 10, height: 6 * 40 * (1 - boardCollapse) + 96 * boardCollapse, position: 'relative'}}>
						<div style={{position: 'absolute', inset: 0, opacity: 1 - boardCollapse}}>
							{phase0.map((p, i) => (
								<div key={p.t} style={{display: 'flex', alignItems: 'center', gap: 10, height: 40, ...ee(10 + i * 4)}}>
									<Icon name={p.i} size={28} />
									<div style={{...body(23, 600), whiteSpace: 'nowrap'}}>{p.t}</div>
								</div>
							))}
						</div>
						<div style={{position: 'absolute', inset: 0, opacity: boardCollapse, display: 'flex', flexWrap: 'wrap', gap: '8px 14px', alignContent: 'flex-start'}}>
							{phase0.map((p) => (
								<div key={p.s} style={{display: 'flex', alignItems: 'center', gap: 6}}>
									<Icon name={p.i} size={26} />
									<span style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>{p.s}</span>
								</div>
							))}
						</div>
					</div>
				</div>
				<div style={{display: 'flex', justifyContent: 'space-around'}}>
					<div style={{width: 6, height: 40, background: C.steel, opacity: 0.6}} />
					<div style={{width: 6, height: 40, background: C.steel, opacity: 0.6}} />
				</div>
			</div>

			{/* GATE 0 */}
			<div style={{position: 'absolute', inset: 0, opacity: fadeG0}}>
			<div style={{position: 'absolute', left: w(G0) - 26, top: roadY(G0) - 196, ...ee(mar27 - 2)}}>
				<TrafficLight amberAt={mar27} greenAt={green} />
			</div>
			<div style={{position: 'absolute', left: w(G0) - 18, top: roadY(G0) - 70, ...ee(mar27)}}>
				<BoomGate liftAt={lift} width={100} />
			</div>
			<div style={{position: 'absolute', left: w(G0) + 60, top: 196, ...ee(mar27)}}>
				<GateSign title="GATE 0 · MAR 2027" w={430} postH={120}>
					<Check at={accept}>Price rule met</Check>
					<Check at={consents}>Cooee’s written consent</Check>
					<Check at={certified}>Certified stock</Check>
					<Check at={ready - 6}>Distributor signed</Check>
				</GateSign>
			</div>
			<div style={{position: 'absolute', left: w(G0) + 64, top: 470, opacity: released, transform: `scale(${0.8 + 0.2 * released})`, transformOrigin: '0 100%'}}>
				<div style={{padding: '8px 18px', borderRadius: 10, background: C.highland, color: C.roast, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em'}}>✓ CAPITAL RELEASED</div>
			</div>
			<div style={{position: 'absolute', left: w(LAUNCH) - 10, top: roadY(LAUNCH) + 44, ...ee(lift + 14)}}>
				<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.gold, whiteSpace: 'nowrap', textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>▲ APR 2027 · PILOT LAUNCH · grocers, IGA, Amazon</div>
			</div>
			<div style={{position: 'absolute', left: w(G0) + 330, top: 470, width: 380, ...footnote, ...ee(lift + 16)}}>If Phase 0 fails: re-test A$14.99 or a 200 g pack, or stay online only</div>

			</div>
			{/* GATE 1 */}
			<div style={{position: 'absolute', inset: 0, opacity: fadeG1}}>
			<div style={{position: 'absolute', left: w(G1) + 60, top: 196, ...ee(sep + 8)}}>
				<GateSign title="GATE 1 · SEP 2027" w={450} postH={120}>
					<Check at={sell}>≥ 2 packs per store per week</Check>
					<Check at={repeat}>Repeat purchase (90-day window)</Check>
					<Check at={repeat + 12}>Credibility ≥ 3.5/5, non-Vietnamese buyers</Check>
					<Check at={unlock - 6}>Supplier emissions data</Check>
					<div style={{...footnote, marginTop: 8, opacity: interpolate(frame, [repeat + 16, repeat + 24], [0, 1], clamp)}}>targets proposed, to be set with the distributor</div>
				</GateSign>
			</div>
			<div style={{position: 'absolute', left: w(G1) + 530, top: 240, width: 190, textAlign: 'center', ...ee(sep + 14)}}>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Padlock unlockAt={unlock} size={96} />
				</div>
				<div style={{...body(26, 700), color: frame >= unlock + 8 ? C.highland : C.crema, marginTop: 6}}>Woolworths & Coles</div>
			</div>
			

			</div>
			{/* GATE 2 */}
			<div style={{position: 'absolute', left: w(G2) - 420, top: 230, ...ee(mar28 + 8)}}>
				<GateSign title="GATE 2 · MAR 2028" w={400} postH={110}>
					<div style={{...body(24, 600), marginTop: 8, opacity: interpolate(frame, [margin, margin + 8], [0.45, 1], clamp)}}>
						Positive contribution margin, <span style={{color: C.gold}}>2 quarters running</span>
					</div>
					<div style={{fontFamily: F.mono, fontSize: 22, color: C.highland, marginTop: 6}}>Cooee-led review</div>
				</GateSign>
			</div>
			{[
				{t: 'SCALE', dy: -150, at: scale, c: C.highland},
				{t: 'ADJUST', dy: 0, at: adjust, c: C.gold},
				{t: 'EXIT', dy: 120, at: exit, c: C.robusta},
			].map((f) => {
				const lit = forkLit(f.at);
				return (
					<div key={f.t} style={{position: 'absolute', left: w(FORK + 300), top: roadY(FORK) + f.dy - 92, ...ee(mar28 + 14)}}>
						<div
							style={{
								padding: '8px 18px',
								borderRadius: 12,
								background: lit > 0.5 ? f.c : 'rgba(18,11,8,0.9)',
								border: `3px solid ${f.c}`,
								fontFamily: F.mono,
								fontWeight: 700,
								fontSize: 26,
								letterSpacing: '0.1em',
								color: lit > 0.5 ? C.roast : f.c,
								transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, lit) * Math.PI)})`,
								boxShadow: lit > 0.5 ? `0 0 30px ${f.c}88` : undefined,
							}}
						>
							{f.t} ▸
						</div>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: w(FORK + 330), top: 236, width: 420, ...footnote, opacity: 0.75 * interpolate(frame, [mar28 + 20, mar28 + 32], [0, 1], clamp)}}>
				<span style={{fontStyle: 'normal', fontFamily: F.mono, color: C.gold}}>2029 · STAGE 3 OPTION</span>
				<br />
				buy out the distributor after 4 quarters of positive margin
			</div>

			{/* token */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
				<ellipse cx={w(tokenX)} cy={roadY(tokenX) - 4} rx={18} ry={5} fill="#000" opacity={0.5} />
				<circle cx={w(tokenX)} cy={tokenY} r={26} fill={C.gold} opacity={0.18} />
				<g transform={`translate(${w(tokenX)} ${tokenY}) scale(1.9)`}>
					<path d={DROP_PATH} fill={C.gold} />
				</g>
			</svg>

			{/* mini-map: three gates */}
			<div style={{position: 'absolute', left: 1240, top: 112, width: 584, ...ee(three - 2)}}>
				<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: C.crema, marginBottom: 6, opacity: interpolate(frame, [three, three + 8, sep - 10, sep], [0, 1, 1, 0], clamp)}}>
					THREE GO/NO-GO GATES
				</div>
				<svg width={584} height={46} style={{overflow: 'visible'}}>
					<line x1={10} y1={22} x2={574} y2={22} stroke={C.steel} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
					{[
						{x: G0, l: 'G0'},
						{x: G1, l: 'G1'},
						{x: G2, l: 'G2'},
					].map((g, i) => {
						const sx = 10 + ((g.x - mx(0)) / (mx(15) - mx(0))) * 564;
						const passed = tokenX >= g.x - 80;
						return (
							<g key={g.l}>
								<circle cx={sx} cy={22} r={20} fill={passed ? C.gold : C.roast} stroke={C.gold} strokeWidth={3} />
								<text x={sx} y={30} textAnchor="middle" fill={passed ? C.roast : C.gold} fontFamily={F.mono} fontWeight={700} fontSize={22} opacity={interpolate(frame, [three + i * 4, three + 8 + i * 4], [0, 1], clamp)}>
									{g.l}
								</text>
							</g>
						);
					})}
					<circle cx={10 + ((Math.min(tokenX, mx(15)) - mx(0)) / (mx(15) - mx(0))) * 564} cy={22} r={6} fill={C.goldHot} />
				</svg>
			</div>
			<div style={{position: 'absolute', left: 620, top: 862, fontFamily: F.mono, fontSize: 22, color: C.cremaDim}}>SOURCE · Part 2, Appendix N; Market Entry Report, Appendix C</div>
		</div>
	);
};
