import React from 'react';
import {Composition} from 'remotion';
import {Pitch} from './Pitch';
import {Prompter} from './Prompter';
import {TIMELINE, buildTimeline} from './data/beats';
import {PitchProps} from './lib';

const base: PitchProps = {mode: 'animatic', showCaptions: true, showHud: true, reducedMotion: false};
const slow = buildTimeline(130, 30, false);
const COUNTDOWN = 90;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Animatic" component={Pitch} durationInFrames={TIMELINE.total} fps={30} width={1920} height={1080} defaultProps={base} />
		<Composition id="Overlays" component={Pitch} durationInFrames={TIMELINE.total} fps={30} width={1920} height={1080} defaultProps={{...base, mode: 'overlay' as const}} />
		<Composition
			id="Final"
			component={Pitch}
			durationInFrames={TIMELINE.total}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{...base, mode: 'final' as const, speakerSrc: 'speaker.mp4'}}
		/>
		<Composition id="Stills" component={Pitch} durationInFrames={TIMELINE.total} fps={30} width={1920} height={1080} defaultProps={base} />
		<Composition id="Prompter" component={Prompter} durationInFrames={TIMELINE.total + COUNTDOWN} fps={30} width={1920} height={1080} defaultProps={{wpm: 140}} />
		<Composition id="PrompterSlow" component={Prompter} durationInFrames={slow.total + COUNTDOWN} fps={30} width={1920} height={1080} defaultProps={{wpm: 130}} />
	</>
);
