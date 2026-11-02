// B09 Promotion (FULL): strike the unproven slogan; A/B claim test with 200 buyers; blind-vs-branded; demos.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {study} from '../data/facts';
import {C, F, body, display, hero} from '../theme';
import {clamp, cue, durLocal, stateStyle, useEnterExit} from '../lib';
import {Chip, Counter, Eyebrow, Gold, SourceTag, Stamp, StrikeRevise, stampShake} from '../components/Panel';
import {Icon} from '../components/Icon';
import {BeatContent, CW, P, SceneProps} from './common';

export const B09Promotion: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const slogans = cue(beat, 'slogans');
	const weTest = cue(beat, 'We test');
	const heritage = cue(beat, 'heritage claim');
	const taste = cue(beat, 'taste claim');
	const two = cue(beat, 'two hundred buyers');
	const blind = cue(beat, 'blind-versus-branded');
	const demos = cue(beat, 'demonstrations');
	const stampAt = blind + 16;
	const shake = stampShake(frame, stampAt);
	// slider: centre -> A -> B -> centre
	const slider = interpolate(frame, [heritage, heritage + 14, taste, taste + 16, two, two + 14], [0.5, 0, 0, 1, 1, 0.5], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const reveal = interpolate(frame, [blind + 8, blind + 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const stampFade = interpolate(frame, [demos - 2, demos + 8], [1, 0], clamp);
	const cardW = CW;
	return (
		<BeatContent beat={beat} shake={shake}>
			{/* State A: no unproven slogans */}
			<div style={stateStyle(frame, 0, heritage, true)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>Promotion · claims audit</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 200, width: CW, padding: '26px 28px', boxSizing: 'border-box', borderRadius: 18, background: C.espresso2, border: '1px solid rgba(246,231,208,0.12)'}}>
					<div style={{fontFamily: F.mono, fontSize: 22, color: C.cremaDim, marginBottom: 12}}>current slogan</div>
					<StrikeRevise
						at={2}
						old="‘The energy coffee that changes life’"
						strikeAt={slogans}
						reviseAt={weTest - 4}
						oldSize={32}
						size={46}
						width={CW - 56}
						revised={
							<>
								Replaced <Gold>unless substantiated</Gold>
							</>
						}
					/>
				</div>
				<SourceTag>Part 2, Appendix L</SourceTag>
			</div>
			{/* State B: A/B claim test */}
			<div style={stateStyle(frame, heritage, blind)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>Phase 0 · claim test</Eyebrow>
				{[
					{k: 'A · HERITAGE', t: '‘Thirty years of Vietnamese coffee craft’', c: C.gold, on: 1 - slider},
					{k: 'B · TASTE', t: 'tasting notes confirmed by the firm', c: C.highland, on: slider},
				].map((card, i) => (
					<div
						key={card.k}
						style={{
							position: 'absolute',
							left: P + i * (cardW / 2 + 8),
							top: 150,
							width: cardW / 2 - 8,
							height: 230,
							boxSizing: 'border-box',
							padding: '20px 22px',
							borderRadius: 18,
							background: i === 0 ? '#3a2419' : '#1c2a2a',
							border: `3px solid ${card.c}`,
							borderColor: `rgba(${i === 0 ? '242,169,59' : '63,162,122'},${0.25 + 0.75 * card.on})`,
							opacity: 0.55 + 0.45 * card.on,
							transform: `scale(${0.96 + 0.04 * card.on})`,
							...ee(heritage - 2 + i * 6),
						}}
					>
						<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: card.c, letterSpacing: '0.1em'}}>{card.k}</div>
						<div style={{...body(28, 600), marginTop: 12}}>{card.t}</div>
					</div>
				))}
				<div
					style={{
						position: 'absolute',
						left: P + cardW / 2 - 30,
						top: 236,
						width: 60,
						height: 60,
						borderRadius: 30,
						background: C.crema,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: F.mono,
						fontWeight: 700,
						fontSize: 22,
						color: C.roast,
						transform: `translateX(${(slider - 0.5) * 60}px)`,
						...ee(heritage + 4),
					}}
				>
					A/B
				</div>
				<div style={{position: 'absolute', left: P, top: 410, display: 'flex', alignItems: 'baseline', gap: 16, ...ee(two - 6)}}>
					<div style={{...hero(120), color: C.gold}}>{frame >= two ? <Counter to={study.survey} at={two} len={30} /> : '0'}</div>
					<div style={{...display(44)}}>buyers</div>
				</div>
				<div style={{position: 'absolute', left: P, top: 540, width: CW, fontFamily: F.mono, fontSize: 24, color: C.crema, ...ee(two + 10)}}>
					{study.perCity} Sydney · {study.perCity} Melbourne · ≥ {study.nonHeritage} without Vietnamese heritage
				</div>
				<SourceTag>Part 2, Appendix M; Table M1</SourceTag>
			</div>
			{/* State C/D: blind vs branded, decision rule, demos */}
			<div style={stateStyle(frame, blind, end + 30)}>
				<Eyebrow style={{position: 'absolute', left: P, top: 96}}>Blind, then branded</Eyebrow>
				<div style={{position: 'absolute', left: P, top: 150, width: CW, height: 220, opacity: interpolate(frame, [demos - 4, demos + 6], [1, 0], clamp)}}>
					{[0, 1].map((i) => (
						<div key={i} style={{position: 'absolute', left: 30 + i * 220, top: 0, textAlign: 'center', width: 180, ...ee(blind + i * 4)}}>
							<svg width={140} height={150} viewBox="0 0 140 150">
								<path d="M30 40 L40 140 H100 L110 40 Z" fill="rgba(246,231,208,0.06)" stroke={C.crema} strokeOpacity={0.7} strokeWidth={3} />
								<rect x={38} y={80} width={64} height={58} fill="#5a3218" />
								{i === 1 ? <rect x={42} y={64 + (1 - reveal) * 30} width={56} height={34} rx={4} fill={C.gold} opacity={reveal} /> : null}
							</svg>
							<div style={{marginTop: -6, display: 'flex', justifyContent: 'center'}}>
								<Icon name={i === 0 ? 'blindfold' : 'tag'} size={44} />
							</div>
						</div>
					))}
					<div style={{position: 'absolute', left: 470, top: 40, width: 200, ...ee(blind + 8)}}>
						<div style={{...hero(84), color: C.gold}}>{study.tasting}</div>
						<div style={{...body(26, 600)}}>tasters · blind, then branded</div>
					</div>
				</div>
				<div
					style={{
						position: 'absolute',
						left: P,
						top: 392 - interpolate(frame, [demos, demos + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) * 230,
						width: CW,
						padding: '18px 22px',
						boxSizing: 'border-box',
						borderRadius: 16,
						border: `2px solid ${C.gold}`,
						background: 'rgba(242,169,59,0.08)',
						...ee(blind + 12),
					}}
				>
					<div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: C.gold}}>DECISION RULE</div>
					<div style={{...body(30, 600), marginTop: 6}}>
						Launch at <Gold>A$15.99</Gold> only if ≥ half of target buyers would pay A$15+
					</div>
				</div>
				<div style={{opacity: stampFade}}>
					<Stamp at={stampAt} text="Test before we talk" color={C.gold} style={{left: P + 30, top: 566}} rotate={-4} size={34} />
				</div>
				<div style={{position: 'absolute', left: P, top: 330, width: CW, display: 'flex', flexWrap: 'wrap', gap: 14}}>
					{[
						{t: 'In-store phin demos', i: 'phinCup' as const},
						{t: 'QR recipes', i: 'qr' as const},
						{t: 'Tết & Mid-Autumn events', i: 'calendar' as const},
					].map((c, k) => (
						<div key={c.t} style={ee(demos + k * 4)}>
							<Chip icon={<Icon name={c.i} size={34} />} style={{fontSize: 24, fontFamily: F.text, fontWeight: 600, letterSpacing: 0}}>
								{c.t}
							</Chip>
						</div>
					))}
				</div>
				<SourceTag>Part 2, Appendices L & M; Lee 1966</SourceTag>
			</div>
		</BeatContent>
	);
};
