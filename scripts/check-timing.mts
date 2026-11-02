import {TIMELINE, fmtTime} from '../src/data/beats.ts';
const expected = [0,275,711,1114,1615,1986,2435,2871,3256,3603,4141,4679,5157];
let words = 0; let ok = true;
for (const b of TIMELINE.beats) {
  words += b.words.length;
  const e = expected[b.index];
  if (e !== b.start) ok = false;
  console.log(b.id, b.words.length, 'w', b.start, fmtTime(b.start), e === b.start ? 'OK' : `EXPECTED ${e}`, 'kw:', b.words.filter(w=>w.keyword).map(w=>w.text).join(' '));
}
console.log('words', words, 'slate', TIMELINE.slateStart, 'total', TIMELINE.total, fmtTime(TIMELINE.total), ok && TIMELINE.slateStart===5198 && TIMELINE.total===5258 && words===387 ? 'ALL OK':'MISMATCH');
