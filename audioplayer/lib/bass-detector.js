// Analyze bass only. Adaptive levels reset for each song and follow changes in its mix.
module.exports = function createBassDetector(sampleRate, fftSize) {
  const ranges = [[35, 85], [85, 180]];
  const bands = ranges.map(([lo, hi]) => ({
    lo: Math.ceil(lo * fftSize / sampleRate),
    hi: Math.floor(hi * fftSize / sampleRate),
    average: 0, previous: 0, peak: 0.008, cooldown: 0,
  }));
  let age = 0;
  let level = 0;
  return {
    reset() {
      age = 0; level = 0;
      bands.forEach(b => { b.average = 0; b.previous = 0; b.peak = 0.008; b.cooldown = 0; });
    },
    update(spectrum, milliseconds) {
      const dt = Math.max(0.001, Math.min(milliseconds / 1000, 0.1));
      age += dt;
      const levels = [];
      const beats = bands.map(b => {
        let power = 0;
        for (let i = b.lo; i <= b.hi; i++) {
          const db = spectrum[i];
          if (Number.isFinite(db)) power += Math.pow(10, db / 10);
        }
        const energy = Math.sqrt(power / Math.max(1, b.hi - b.lo + 1));
        b.cooldown = Math.max(0, b.cooldown - dt);
        const beat = age > 0.15 && b.cooldown === 0 && energy > 0.0015 &&
          energy > b.average * 1.3 && energy > b.previous * 1.06;
        if (beat) b.cooldown = 0.24;
        b.average += (energy - b.average) * (1 - Math.exp(-dt / 1.2));
        b.previous = energy;
        b.peak = Math.max(0.008, energy, b.peak * Math.exp(-dt / 3));
        levels.push(energy < 0.0015 ? 0 : Math.min(1, energy / b.peak));
        return beat;
      });
      const target = Math.max(...levels);
      level += (target - level) * (1 - Math.exp(-dt / (target > level ? 0.035 : 0.18)));
      return { beats, level };
    },
  };
};
