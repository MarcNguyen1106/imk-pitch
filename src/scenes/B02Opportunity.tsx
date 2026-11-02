// B02 Opportunity (FULL): 29 % hero counter + cups flip, then the Melbourne kitchen vignette.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {homeBrew, SRC} from '../data/facts';
import {C, body, display, hero} from '../theme';
import {cue, durLocal, stateStyle, useEnterExit} from '../lib';
import {Counter, Eyebrow, KeywordPop, SourceTag} from '../components/Panel';
import {CupFlip, KitchenVignette} from '../components/PhinDrip';
import {BeatContent, CW, P, SceneProps} from './common';

export const B02Opportunity: React.FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const ee = useEnterExit();
	const end = durLocal(beat);
	const nearly = cue(beat, 'Nearly');
	const three = cue(beat, 'three in ten');
	const picture = cue(beat, 'Picture');
	const win = cue(beat, 'win');
	return (
		<BeatContent beat={beat}>
			<Eyebrow style={{position: 'absolute', left: P, top: 44}}>The opportunity</Eyebrow>
			{/* State A */}
			<div style={stateStyle(frame, 0, picture, true)}>
				<div style={{position: 'absolute', left: P - 6, top: 104, ...hero(210), color: C.gold, ...ee(nearly - 4)}}>
					<Counter to={homeBrew.pct} at={nearly} len={34} />
					<span style={{fontSize: 120}}>%</span>
				</div>
				<div style={{position: 'absolute', left: P, top: 340, width: CW, ...body(36, 600), ...ee(nearly + 6)}}>
					of surveyed Australians now <span style={{color: C.gold}}>brew at home</span> instead of buying café coffee
				</div>
				<div style={{position: 'absolute', left: P, top: 500, width: CW, display: 'flex', justifyContent: 'space-between', ...ee(nearly + 12)}}>
					{Array.from({length: 10}, (_, i) => (
						<CupFlip key={i} flipAt={i < 3 ? three + 4 + i * 3 : undefined} size={58} />
					))}
				</div>
				<SourceTag>{SRC.canstar} · over 2,100 respondents</SourceTag>
			</div>
			{/* State B: the kitchen */}
			<div style={stateStyle(frame, picture, end + 20)}>
				<div style={{position: 'absolute', left: P, top: 94}}>
					<KitchenVignette at={picture} />
				</div>
				<div style={{position: 'absolute', left: P, top: 580, width: CW, textAlign: 'center', ...display(46), color: C.gold, whiteSpace: 'nowrap'}}>
					{frame >= win ? <KeywordPop at={win}>THE HOME-BREW MOMENT</KeywordPop> : null}
				</div>
			</div>
		</BeatContent>
	);
};
