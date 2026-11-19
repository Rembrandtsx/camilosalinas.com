const assert = require('node:assert/strict');
const createDetector = require('../audioplayer/lib/bass-detector');
const rate = 48000, fft = 4096;
function spectrum(hz, db) {
  const data = new Float32Array(fft / 2).fill(-Infinity);
  data[Math.round(hz * fft / rate)] = db;
  return data;
}
function count(hz, db, dt = 16) {
  const detector = createDetector(rate, fft);
  let hits = 0, maxLevel = 0;
  for (let time=0; time<6000; time+=dt) {
    const on = time % 500 < 100;
    const result = detector.update(spectrum(hz,on?db:-Infinity),dt);
    hits += result.beats.filter(Boolean).length;
    maxLevel = Math.max(maxLevel,result.level);
  }
  return {hits,maxLevel};
}
for(const dt of [16,33,50]) {
 const bass=count(60,-18,dt);
 const quieter=count(60,-30,dt);
 assert.ok(bass.hits>=9 && bass.hits<=12,JSON.stringify({dt,bass}));
 assert.ok(quieter.hits>=9 && quieter.hits<=12,JSON.stringify({dt,quieter}));
 assert.equal(count(4000,-5,dt).hits,0,'Treble must not trigger bass geometry');
 assert.equal(count(4000,-5,dt).maxLevel,0,'Treble must not drive bass pulses');
}
const detector=createDetector(rate,fft);
for(let i=0;i<200;i++)assert.equal(detector.update(spectrum(60,-Infinity),16).level,0);
let hits=0;for(let i=0;i<200;i++)hits+=detector.update(spectrum(60,-18),16).beats.filter(Boolean).length;
assert.ok(hits<=1,'A sustained bass tone should not retrigger continuously');
detector.reset();
assert.equal(detector.update(spectrum(60,-Infinity),16).level,0,'Each song resets the adaptive history');
console.log('Bass detector: kicks at multiple frame rates/volumes, treble rejection, silence, sustain, and reset passed.');
