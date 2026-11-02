// Scene registry: which layer each beat renders into.
import React from 'react';
import {SceneProps} from './common';
import {B01Hook} from './B01Hook';
import {B02Opportunity} from './B02Opportunity';
import {B03Score} from './B03Score';
import {B04Evidence} from './B04Evidence';
import {B05Warnings, B05_TAIL} from './B05Warnings';
import {B06Product} from './B06Product';
import {B07Place} from './B07Place';
import {B08Price} from './B08Price';
import {B09Promotion} from './B09Promotion';
import {B10Partner} from './B10Partner';
import {B11Rollout} from './B11Rollout';
import {B13Close} from './B13Close';

type Entry = {id: string; C: React.FC<SceneProps>; tail?: number};

// B12 is rendered by Pitch.tsx because it needs the CLEAR frame.
export const PANEL_SCENES: Entry[] = [
	{id: 'B02', C: B02Opportunity},
	{id: 'B03', C: B03Score},
	{id: 'B04', C: B04Evidence},
	{id: 'B05', C: B05Warnings, tail: B05_TAIL},
	{id: 'B06', C: B06Product},
	{id: 'B08', C: B08Price},
	{id: 'B09', C: B09Promotion},
	{id: 'B10', C: B10Partner},
];

export const FULLFRAME_SCENES: Entry[] = [
	{id: 'B07', C: B07Place},
	{id: 'B11', C: B11Rollout},
];

export const OVERLAY_SCENES: Entry[] = [
	{id: 'B01', C: B01Hook, tail: 40},
	{id: 'B13', C: B13Close},
];
