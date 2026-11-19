const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const filename = path.resolve(__dirname, '../audioplayer/lib/audio.js');
const elements = [];
let context;
class FakeAudio {
  constructor() { this.events = {}; this.dataset = {}; this.currentTime = 0; this.readyState = 0; this.paused = true; this.seeking = false; this.duration = 215; }
  addEventListener(name, callback) { this.events[name] = callback; }
  setAttribute() {}
  load() {}
  play() { this.paused = false; return Promise.resolve(); }
}
class FakeContext {
  constructor() { context = this; this.state = 'running'; this.currentTime = 1; this.sampleRate = 48000; this.gains = []; }
  createAnalyser() { return { frequencyBinCount: 2048, connect() {}, getFloatFrequencyData(values) { values.fill(-20); } }; }
  createGain() { const gain = { value: 1, setTargetAtTime(value) { this.value = value; } }; this.gains.push(gain); return { gain, connect() {} }; }
  createMediaElementSource() { return { connect() {} }; }
}
const sandbox = { module: { exports: {} }, require: createRequire(filename), window: { AudioContext: FakeContext }, Audio: FakeAudio,
  document: { body: { appendChild(audio) { elements.push(audio); } } }, setTimeout };
vm.runInNewContext(fs.readFileSync(filename, 'utf8'), sandbox, { filename });
const player = sandbox.module.exports();
let starts = 0;
player.on('playing', () => starts++);
player.queue();
const audio = elements[0];
player.playQueued();
// Reproduce canplay arriving before the cue seek completes, with no later seeked event.
audio.readyState = 4;
audio.seeking = true;
audio.events.canplay();
player.update(16);
assert.equal(player.playing, false);
assert.equal(context.gains[1].value, 0);
audio.seeking = false;
audio.currentTime = 1;
player.update(16);
assert.equal(player.playing, true, 'Readiness must recover without another canplay/seeked event');
assert.ok(context.gains[1].value > 0, 'Advancing media must actually unmute its audio graph');
assert.ok(player.bassLevel > 0, 'The real signal reaches bass analysis after recovery');
player.update(16);
assert.equal(starts, 1);
context.state = 'suspended';
player.update(16);
assert.equal(player.playing, false, 'A suspended audio graph is not playing');
context.state = 'running';
audio.currentTime = 213.3;
player.update(16);
assert.equal(audio.currentTime, 0.8, 'Loop seeks back to the trimmed cue');
assert.equal(context.gains[1].value, 0, 'Loop boundary is muted during seeking');
console.log('Audio readiness race, audible gain, bass output, suspended context, and cue boundary passed.');
