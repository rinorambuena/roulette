let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTick(intensity) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "triangle";
  osc.frequency.value = 300 + intensity * 200;

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

function playDing() {
  const ctx = getCtx();

  [[520, 0], [660, 0.12], [780, 0.22]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.value = freq;

    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.start(t);
    osc.stop(t + 0.6);
  });
}
