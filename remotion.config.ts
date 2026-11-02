import {Config} from '@remotion/cli/config';
import os from 'node:os';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Concurrency follows the machine: 2 on an 8 GB / 4-thread laptop, 4 on a 16 GB desktop.
const memGb = os.totalmem() / 1024 ** 3;
const cpus = os.cpus().length;
Config.setConcurrency(memGb < 10 ? 2 : Math.max(2, Math.min(4, cpus)));
Config.setChromiumOpenGlRenderer('angle');
Config.setEntryPoint('src/index.ts');
