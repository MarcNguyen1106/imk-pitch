// B13 Close (STRAP): the name strap returns briefly under "Thank you".
import React from 'react';
import {durLocal} from '../lib';
import {NameStrap} from '../components/NameStrap';
import {SceneProps} from './common';

export const B13Close: React.FC<SceneProps> = ({beat}) => <NameStrap at={2} out={durLocal(beat) - 8} sub="Thank you · MKTG3007 · SID 22274040" />;
