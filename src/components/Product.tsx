// Original generic product mock-ups: pouch, starter-kit box, QR tag, wattleseed pod, cookie, mini phin steps.
import React, {useMemo} from 'react';
import QRCode from 'qrcode';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp} from '../lib';

export const QR: React.FC<{text: string; size?: number; fg?: string; bg?: string}> = ({text, size = 120, fg = C.roast, bg = '#FBF8F2'}) => {
	const qr = useMemo(() => QRCode.create(text, {errorCorrectionLevel: 'M'}), [text]);
	const n = qr.modules.size;
	const cells: React.ReactNode[] = [];
	for (let y = 0; y < n; y++)
		for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) cells.push(<rect key={`${x}-${y}`} x={x + 2} y={y + 2} width={1.02} height={1.02} fill={fg} />);
	return (
		<svg width={size} height={size} viewBox={`0 0 ${n + 4} ${n + 4}`} shapeRendering="crispEdges">
			<rect width={n + 4} height={n + 4} fill={bg} />
			{cells}
		</svg>
	);
};

// Generic stand-up pouch (no brand marks): roast body, gold band, crema type.
export const Pouch: React.FC<{w?: number; title?: string; sub?: string; small?: string; tilt?: number}> = ({
	w = 250,
	title = 'LEGEND PHIN',
	sub = '250 g GROUND',
	small = 'Product of Vietnam',
	tilt = 0,
}) => {
	const h = w * 1.42;
	return (
		<div style={{position: 'relative', width: w, height: h, transform: `rotate(${tilt}deg)`}}>
			<svg width={w} height={h} viewBox="0 0 250 355" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<linearGradient id="pouch-g" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#1b100b" />
						<stop offset="45%" stopColor="#3a241a" />
						<stop offset="100%" stopColor="#170d09" />
					</linearGradient>
				</defs>
				<ellipse cx={125} cy={352} rx={110} ry={10} fill="#000" opacity={0.4} />
				<path d="M18 22 Q18 10 30 10 H220 Q232 10 232 22 L238 330 Q238 346 222 346 H28 Q12 346 12 330 Z" fill="url(#pouch-g)" stroke="rgba(246,231,208,0.25)" strokeWidth={2} />
				<rect x={18} y={12} width={214} height={22} fill="rgba(246,231,208,0.08)" />
				{Array.from({length: 26}, (_, i) => (
					<line key={i} x1={22 + i * 8.2} y1={14} x2={22 + i * 8.2} y2={32} stroke="rgba(246,231,208,0.12)" strokeWidth={1} />
				))}
				<rect x={14} y={150} width={222} height={64} fill={C.gold} />
				<path d="M60 102 h22 v-8 h-22z M56 104 h30 v4 h-30z M62 110 l4 26 h12 l4 -26" fill="none" stroke={C.gold} strokeWidth={3} strokeLinejoin="round" />
				<path d="M200 40 L226 40" stroke={C.gold} strokeWidth={2} />
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: (150 / 355) * h, height: (64 / 355) * h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 900, fontStretch: '112%', fontSize: Math.max(22, w * 0.086), color: C.roast, letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>
				{title}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: (226 / 355) * h, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: Math.max(22, w * 0.088), color: C.crema, letterSpacing: '0.06em'}}>{sub}</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: (300 / 355) * h, textAlign: 'center', fontFamily: F.text, fontWeight: 500, fontSize: 22, color: C.cremaDim}}>{small}</div>
		</div>
	);
};

// Starter kit: box with a window showing a stainless phin, plus a live QR tag.
export const StarterKit: React.FC<{w?: number; qrText: string}> = ({w = 300, qrText}) => {
	const h = w * 0.86;
	return (
		<div style={{position: 'relative', width: w, height: h + 70}}>
			<svg width={w} height={h} viewBox="0 0 300 258" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<path d="M20 60 L150 20 L280 60 L150 100 Z" fill="#4a2f22" stroke="rgba(246,231,208,0.2)" strokeWidth={2} />
				<path d="M20 60 V210 L150 252 V100 Z" fill="#33201A" stroke="rgba(246,231,208,0.2)" strokeWidth={2} />
				<path d="M280 60 V210 L150 252 V100 Z" fill="#24150F" stroke="rgba(246,231,208,0.2)" strokeWidth={2} />
				{/* window */}
				<path d="M40 92 L130 120 V220 L40 192 Z" fill="#120B08" stroke={C.gold} strokeWidth={2} />
				{/* phin inside window */}
				<g transform="translate(85 160) skewY(17)">
					<rect x={-30} y={-34} width={60} height={8} rx={3} fill={C.steel} />
					<path d="M-22 -26 L-19 14 H19 L22 -26 Z" fill="#aab3b7" />
					<rect x={-38} y={14} width={76} height={6} rx={3} fill={C.steel} />
					<rect x={-7} y={-44} width={14} height={10} rx={3} fill={C.steel} />
				</g>
				<path d="M175 120 L255 95" stroke={C.gold} strokeWidth={6} />
				<text x={0} y={0} transform="translate(178 160) skewY(-17)" fill={C.crema} fontFamily={F.mono} fontWeight={700} fontSize={22}>
					PHIN
				</text>
				<text x={0} y={0} transform="translate(178 188) skewY(-17)" fill={C.cremaDim} fontFamily={F.mono} fontSize={22}>
					KIT
				</text>
			</svg>
			<div
				style={{
					position: 'absolute',
					right: -10,
					top: h - 110,
					padding: 8,
					background: '#FBF8F2',
					borderRadius: 10,
					transform: 'rotate(6deg)',
					boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
					textAlign: 'center',
				}}
			>
				<QR text={qrText} size={104} />
				<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.roast, marginTop: 2}}>Scan · brewing video</div>
			</div>
		</div>
	);
};

// Plain botanical sketch of wattleseed pods (line drawing only).
export const WattlePod: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.highland}) => (
	<svg width={size} height={size} viewBox="0 0 120 120" style={{overflow: 'visible'}}>
		<path d="M10 110 C40 80 70 50 112 12" fill="none" stroke={C.steel} strokeWidth={3} strokeLinecap="round" />
		{[
			[34, 86, -40],
			[58, 62, -48],
			[82, 38, -42],
		].map(([x, y, r], i) => (
			<g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
				<path d="M0 0 C10 -10 40 -12 54 -4 C40 4 10 6 0 0 Z" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
				{[12, 24, 36].map((cx) => (
					<ellipse key={cx} cx={cx} cy={-3} rx={4} ry={3} fill="none" stroke={color} strokeWidth={2} />
				))}
			</g>
		))}
	</svg>
);

export const Cookie: React.FC<{size?: number}> = ({size = 150}) => (
	<svg width={size} height={size} viewBox="0 0 150 150">
		<defs>
			<radialGradient id="ck" cx="0.4" cy="0.35" r="0.75">
				<stop offset="0%" stopColor="#d9a466" />
				<stop offset="100%" stopColor="#8a5a30" />
			</radialGradient>
		</defs>
		<ellipse cx={75} cy={138} rx={58} ry={8} fill="#000" opacity={0.35} />
		<path d="M75 10 C112 10 140 38 138 76 C136 112 108 134 74 134 C38 134 12 108 12 72 C12 36 40 10 75 10 Z" fill="url(#ck)" />
		{[
			[48, 50],
			[92, 44],
			[70, 82],
			[104, 92],
			[42, 98],
			[80, 112],
		].map(([x, y], i) => (
			<ellipse key={i} cx={x} cy={y} rx={5} ry={3.5} fill="#4b2c16" transform={`rotate(${i * 37} ${x} ${y})`} />
		))}
	</svg>
);

// Three-step micro-animation: add coffee, bloom with a little water, fill/cover/drip. No doses or times.
export const PhinSteps: React.FC<{at: number; width?: number}> = ({at, width = 672}) => {
	const frame = useCurrentFrame();
	const colW = width / 3;
	const steps = ['Add coffee', 'Bloom with a little water', 'Fill, cover, drip'];
	return (
		<div style={{display: 'flex', width}}>
			{steps.map((label, i) => {
				const t = frame - at - i * 9;
				const o = interpolate(t, [0, 8], [0, 1], clamp);
				const loop = Math.max(0, t) % 48;
				return (
					<div key={label} style={{width: colW, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
						<svg width={190} height={190} viewBox="0 0 150 150" style={{overflow: 'visible'}}>
							<circle cx={75} cy={75} r={70} fill={C.espresso2} />
							{/* phin */}
							<path d="M48 54 L52 100 H98 L102 54" fill="none" stroke={C.steel} strokeWidth={4} strokeLinejoin="round" />
							<path d="M34 104 H116" stroke={C.steel} strokeWidth={5} strokeLinecap="round" />
							{i === 0 ? (
								<>
									<rect x={54} y={100 - 14 * interpolate(loop, [0, 30], [0, 1], clamp)} width={42} height={14 * interpolate(loop, [0, 30], [0, 1], clamp)} fill="#6b3d1f" />
									{[0, 1, 2, 3].map((k) => {
										const yy = interpolate((loop + k * 6) % 24, [0, 24], [30, 90]);
										return <circle key={k} cx={70 + (k % 2) * 8} cy={yy} r={3} fill="#8a5530" />;
									})}
								</>
							) : null}
							{i === 1 ? (
								<>
									<rect x={54} y={86 - 6 * Math.sin(loop / 8)} width={42} height={14 + 6 * Math.sin(loop / 8)} fill="#7a4524" />
									<path d={`M75 ${20 + (loop % 24)} v10`} stroke="#8fc4dd" strokeWidth={4} strokeLinecap="round" opacity={loop < 24 ? 1 : 0} />
									<circle cx={64} cy={84} r={3} fill="#d9a466" opacity={0.6} />
									<circle cx={86} cy={82} r={2.5} fill="#d9a466" opacity={0.6} />
								</>
							) : null}
							{i === 2 ? (
								<>
									<rect x={54} y={60} width={42} height={40} fill="#4a2a17" />
									<rect x={46} y={42 + interpolate(loop, [0, 12], [-14, 0], clamp)} width={58} height={8} rx={3} fill={C.steel} />
									<path d="M0 -6 C2 -3 4 0 4 2 A4 4 0 0 1 -4 2 C-4 0 -2 -3 0 -6 Z" transform={`translate(75 ${108 + (loop % 16) * 2})`} fill={C.gold} />
								</>
							) : null}
							<text x={18} y={30} fill={C.gold} fontFamily={F.display} fontWeight={900} fontSize={30}>
								{i + 1}
							</text>
						</svg>
						<div style={{fontFamily: F.text, fontWeight: 600, fontSize: 28, color: C.crema, lineHeight: 1.2, marginTop: 10, padding: '0 8px'}}>{label}</div>
					</div>
				);
			})}
		</div>
	);
};
