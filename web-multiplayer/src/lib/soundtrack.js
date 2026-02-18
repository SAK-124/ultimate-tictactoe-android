export function createCalmFunSoundtrack() {
  let ctx = null;
  let master = null;
  let timer = null;
  let nextNoteTime = 0;
  let step = 0;
  let running = false;

  const lookAheadMs = 75;
  const scheduleAheadSec = 0.2;
  const bpm = 92;
  const sixteenth = 60 / bpm / 4;

  const progression = [
    [261.63, 329.63, 392.0],
    [220.0, 277.18, 329.63],
    [196.0, 246.94, 392.0],
    [233.08, 293.66, 349.23],
  ];

  const melody = [
    523.25, 587.33, 659.25, 587.33,
    523.25, 659.25, 783.99, 659.25,
  ];

  function ensureAudioGraph() {
    if (ctx) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();

    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }

  function scheduleStep(time) {
    const bar = Math.floor(step / 16) % progression.length;
    const chord = progression[bar];

    if (step % 4 === 0) {
      for (const freq of chord) {
        playVoice(freq, time, sixteenth * 3.2, "triangle", 0.05, 0.03);
      }
    }

    if (step % 2 === 0) {
      const note = melody[(step / 2) % melody.length];
      playVoice(note, time, sixteenth * 1.2, "sine", 0.03, 0.01);
    }

    if (step % 4 === 0) {
      playVoice(chord[0] / 2, time, sixteenth * 0.9, "sine", 0.04, 0.01);
    }

    step = (step + 1) % 64;
  }

  function playVoice(freq, startTime, duration, type, peak, attack) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(master);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + scheduleAheadSec) {
      scheduleStep(nextNoteTime);
      nextNoteTime += sixteenth;
    }
  }

  async function start() {
    ensureAudioGraph();
    if (running) return true;

    try {
      await ctx.resume();
    } catch {
      return false;
    }

    nextNoteTime = ctx.currentTime + 0.05;
    timer = window.setInterval(scheduler, lookAheadMs);
    running = true;
    return true;
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    running = false;
  }

  async function setEnabled(enabled) {
    if (enabled) {
      return start();
    }
    stop();
    return true;
  }

  return {
    isRunning: () => running,
    start,
    stop,
    setEnabled,
  };
}
