const EventEmitter = require('events').EventEmitter;
const createBassDetector = require('./bass-detector');
const tracks = require('./tracks.json');

module.exports = function createAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.15;
  const spectrum = new Float32Array(analyser.frequencyBinCount);
  const detector = createBassDetector(context.sampleRate, analyser.fftSize);
  const master = context.createGain();
  master.connect(analyser);
  analyser.connect(context.destination);
  const player = new EventEmitter();
  let next = 0;
  let queued = null;
  let current = null;
  let effect = 0;
  player.beats = [false, false];
  player.bassLevel = 0;
  player.binCount = 2;
  player.playing = false;

  function resume() {
    if (context.state === 'suspended') context.resume().catch(reportError);
  }
  function reportError(error) {
    player.emit('playbackerror', error);
  }
  Object.defineProperty(player, 'effect', {
    get: () => effect,
    set(value) {
      effect = value;
      // Duck the previous track while selecting, without adding a noisy reverb tail.
      master.gain.setTargetAtTime(value ? 0.3 : 1, context.currentTime, 0.03);
    },
  });
  function dispose(record) {
    if (!record) return;
    record.disposed = true;
    record.audio.pause();
    record.audio.removeAttribute('src');
    record.audio.load();
    record.source.disconnect();
    record.gain.disconnect();
    record.audio.remove();
  }
  player.queue = () => {
    resume();
    if (queued && !queued.ready && !queued.failed) return queued.name;
    if (queued && queued !== current) dispose(queued);
    const track = tracks[next++ % tracks.length];
    const audio = new Audio();
    audio.preload = 'auto';
    audio.hidden = true;
    audio.setAttribute('playsinline', '');
    audio.dataset.track = track.file;
    document.body.appendChild(audio);
    const gain = context.createGain();
    gain.gain.value = 0;
    const source = context.createMediaElementSource(audio);
    source.connect(gain);
    gain.connect(master);
    const record = { audio, source, gain, track, ready: false, failed: false,
      name: track.file.replace(/_/g, ' ').trim() };
    queued = record;
    const ready = () => {
      if (record.disposed || record.failed || audio.seeking || audio.readyState < 3 || audio.currentTime < track.start - 0.05) return;
      if (!record.ready) { record.ready = true; player.emit('ready'); }
      updateBoundary(record);
    };
    audio.addEventListener('loadedmetadata', () => { audio.currentTime = track.start; });
    audio.addEventListener('seeked', ready);
    audio.addEventListener('canplay', ready);
    // Some browsers finish a seek before canplay, or ignore it until playback begins.
    // Recheck readiness as playback advances instead of leaving the gain muted forever.
    record.refreshReady = ready;
    audio.addEventListener('playing', ready);
    audio.addEventListener('timeupdate', ready);
    audio.addEventListener('ended', () => {
      if (current !== record) return;
      audio.currentTime = track.start;
      audio.play().catch(reportError);
    });
    audio.addEventListener('error', () => {
      if (record.disposed) return;
      record.failed = true;
      gain.gain.value = 0;
      if (current === record) player.playing = false;
      reportError(new Error('Unable to load ' + record.name));
    });
    audio.src = 'assets/audio/music/' + track.file + '.mp3';
    audio.load();
    return record.name;
  };
  player.playQueued = () => {
    resume();
    if (!queued) return;
    if (queued.failed) { reportError(new Error('Unable to load ' + queued.name)); return; }
    if (current && current !== queued) {
      const previous = current;
      previous.gain.gain.setTargetAtTime(0, context.currentTime, 0.008);
      setTimeout(() => dispose(previous), 40);
    }
    current = queued;
    queued = null;
    detector.reset();
    player.beats = [false, false];
    player.bassLevel = 0;
    // Call play inside the gesture, even when the file is still loading (Safari/iOS).
    const active = current;
    player.emit('loading');
    active.audio.play().catch(error => {
      // Switching quickly aborts the previous play promise; that is not a playback error.
      if (current === active && !active.disposed) reportError(error);
    });
  };
  function updateBoundary(record) {
    if (record !== current || record.failed || !record.ready) return;
    const audio = record.audio;
    const start = record.track.start;
    const end = Math.min(record.track.end, Number.isFinite(audio.duration) ? audio.duration : record.track.end);
    if (audio.seeking) { record.gain.gain.value = 0; return; }
    if (audio.currentTime >= end || audio.currentTime < start - 0.05) {
      record.gain.gain.value = 0;
      audio.currentTime = start;
      detector.reset();
      return;
    }
    const volume = Math.max(0, Math.min(1, (audio.currentTime - start) / 0.06, (end - audio.currentTime) / 0.15));
    record.gain.gain.setTargetAtTime(volume, context.currentTime, 0.008);
  }
  // timeupdate also enforces the cues when the browser pauses animation frames.
  player.update = dt => {
    if (current && !current.ready) current.refreshReady();
    player.playing = !!(context.state === 'running' && current && current.ready && !current.failed && !current.audio.paused && !current.audio.seeking);
    if (!player.playing) { player.beats = [false, false]; player.bassLevel *= 0.9; return; }
    if (!current.announced) { current.announced = true; player.emit('playing'); }
    updateBoundary(current);
    analyser.getFloatFrequencyData(spectrum);
    const result = detector.update(spectrum, dt);
    player.beats = result.beats;
    player.bassLevel = result.level;
  };
  return player;
};
