// The film: speaker layer, full-frame PIP scenes, persistent panel, overlays, HUD, captions, grain.
import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, beatById, wordIndex} from './data/beats';
import {C} from './theme';
import {MotionCtx, PitchProps, TimelineCtx, clamp, useTimeline} from './lib';
import {SpeakerFrame, SpeakerPlaceholder, SpeakerVideo} from './components/Speaker';
import {PanelShell} from './components/Panel';
import {Hud} from './components/Hud';
import {Captions} from './components/Captions';
import {Grain} from './components/Grain';
import {B01_DROP} from './scenes/B01Hook';
import {FULLFRAME_SCENES, OVERLAY_SCENES, PANEL_SCENES} from './scenes';
import {EndSlate} from './scenes/EndSlate';
import {B12Ask} from './scenes/B12Ask';
import {TabBar} from './components/TabBar';
import {TIMELINE} from './data/beats';

export const clearFrame = (b12: Beat) => Math.round(b12.words[wordIndex(b12, 'Can')].frame - 7);

const PitchInner: React.FC<PitchProps> = ({mode, showCaptions, showHud, speakerSrc}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tl = useTimeline();
	const b = (id: string) => beatById(tl, id);
	const clearAt = clearFrame(b('B12'));

	// PIP progress (24-frame spring in, same spring out at the end of the beat)
	const pipBeats = tl.beats.filter((x) => x.mode === 'PIP');
	let pip = 0;
	pipBeats.forEach((pb) => {
		const back = pb.end - 18;
		const i = spring({frame: frame - pb.start, fps, config: {damping: 16, mass: 0.7, stiffness: 140}, durationInFrames: 24});
		const o = spring({frame: frame - back, fps, config: {damping: 16, mass: 0.7, stiffness: 140}, durationInFrames: 24});
		if (frame >= pb.start - 1 && frame < back + 30) pip = Math.max(pip, i - o);
	});

	// Panel intervals
	const intervals: [number, number][] = [
		[b('B02').start, b('B07').start + 4],
		[b('B08').start, b('B11').start + 4],
		[b('B12').start, clearAt],
	];
	let panelP = 0;
	let panelExit = 0;
	intervals.forEach(([a, z]) => {
		if (frame >= a && frame < z + 12) {
			panelP = spring({frame: frame - a, fps, config: {damping: 15, mass: 0.7, stiffness: 120}});
			panelExit = interpolate(frame, [z, z + 12], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
		}
	});
	const b10 = b('B10');
	const accent = frame >= b10.start && frame < b10.end ? C.highland : C.gold;

	// HUD: slides in when the drop lands; hides at CLEAR and on the end slate.
	const hudIn = interpolate(frame, [B01_DROP.land - 16, B01_DROP.land + 4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const hudOut = interpolate(frame, [clearAt, clearAt + 12], [0, 1], clamp);
	const emblemPop = interpolate(frame, [B01_DROP.land - 2, B01_DROP.land + 4, B01_DROP.land + 10], [0, 1.25, 1], clamp);

	const speaker =
		mode === 'final' && speakerSrc ? <SpeakerVideo src={speakerSrc} /> : mode === 'overlay' ? null : <SpeakerPlaceholder />;

	return (
		<AbsoluteFill style={{background: mode === 'overlay' ? 'transparent' : C.roast}}>
			{/* full-frame PIP scenes sit behind the speaker window */}
			{FULLFRAME_SCENES.map(({id, C: Scene}) => {
				const bt = b(id);
				return (
					<Sequence key={id} from={bt.start} durationInFrames={bt.end - bt.start + 8} layout="none">
						<Scene beat={bt} />
					</Sequence>
				);
			})}
			{frame < tl.slateStart ? (
				<SpeakerFrame p={pip} ringOnly={mode === 'overlay'}>
					{speaker}
				</SpeakerFrame>
			) : null}
			{/* persistent right-hand panel */}
			<PanelShell p={panelP} exit={panelExit} accent={accent}>
				{PANEL_SCENES.map(({id, C: Scene, tail}) => {
					const bt = b(id);
					return (
						<Sequence key={id} from={bt.start} durationInFrames={bt.end - bt.start + (tail ?? 0)} layout="none">
							<Scene beat={bt} />
						</Sequence>
					);
				})}
				<Sequence from={b('B12').start} durationInFrames={clearAt + 14 - b('B12').start} layout="none">
					<B12Ask beat={b('B12')} />
				</Sequence>
			</PanelShell>
			<TabBar />
			{OVERLAY_SCENES.map(({id, C: Scene, tail}) => {
				const bt = b(id);
				return (
					<Sequence key={id} from={bt.start} durationInFrames={bt.end - bt.start + (tail ?? 0)} layout="none">
						<Scene beat={bt} />
					</Sequence>
				);
			})}
			{showHud && frame < tl.slateStart ? <Hud opacity={hudIn * (1 - hudOut)} slide={hudIn} emblemPop={emblemPop} /> : null}
			{showCaptions ? <Captions /> : null}
			<Sequence from={tl.slateStart} durationInFrames={tl.total - tl.slateStart}>
				<EndSlate />
			</Sequence>
			{mode !== 'overlay' ? <Grain /> : null}
		</AbsoluteFill>
	);
};

export const Pitch: React.FC<PitchProps> = (props) => (
	<TimelineCtx.Provider value={TIMELINE}>
		<MotionCtx.Provider value={{reduced: props.reducedMotion, mode: props.mode}}>
			<PitchInner {...props} />
		</MotionCtx.Provider>
	</TimelineCtx.Provider>
);
