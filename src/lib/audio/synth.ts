import { colFreq, DEFAULT_CUTOFF, HAT, KICK, LEAD, mtof, SNARE, STEP, STEPS } from './patch';

// Web Audio rendition of the patch. The AudioContext is created lazily on the
// first start(), which must come from a user gesture — audio is always opt-in.

const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;

type Ctor = typeof AudioContext;

export class Synth {
  private ac: AudioContext | null = null;
  private bus: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | undefined;
  private t0 = 0;
  private nextStep = 0;
  private cutoff = DEFAULT_CUTOFF;
  playing = false;

  async start() {
    if (this.playing) return;
    // Claim the flag before awaiting so a second click can't start a second scheduler.
    this.playing = true;
    try {
      // build() + resume() run synchronously inside the click, which iOS requires.
      const ac = this.ac ?? this.build();
      await ac.resume();
      if (!this.playing) return; // stopped while resuming
      this.t0 = ac.currentTime + 0.05;
      this.nextStep = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => this.schedule(), TICK_MS);
      this.schedule();
    } catch (err) {
      this.playing = false;
      throw err;
    }
  }

  async stop() {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    await this.ac?.suspend();
  }

  setCutoff(hz: number) {
    this.cutoff = hz;
    if (this.ac && this.filter) this.filter.frequency.setTargetAtTime(hz, this.ac.currentTime, 0.03);
  }

  /** Current 16th-note step (0..15) of the playing clock, or -1 if stopped. */
  currentStep() {
    if (!this.playing || !this.ac) return -1;
    return Math.floor((this.ac.currentTime - this.t0) / STEP) % STEPS;
  }

  /** Analyser magnitudes resampled onto the shared `cols`-wide log axis, 0..1. */
  readSpectrum(cols: number) {
    const out = new Float32Array(cols);
    const { ac, analyser, freqData } = this;
    if (!ac || !analyser || !freqData) return out;
    analyser.getByteFrequencyData(freqData);
    const hz = ac.sampleRate / 2 / freqData.length;
    for (let c = 0; c < cols; c++) {
      const lo = Math.floor(colFreq(Math.max(0, c - 0.5), cols) / hz);
      const hi = Math.max(lo, Math.floor(colFreq(c + 0.5, cols) / hz));
      let m = 0;
      for (let i = lo; i <= hi && i < freqData.length; i++) m = Math.max(m, freqData[i]);
      out[c] = Math.pow(m / 255, 2.2);
    }
    return out;
  }

  dispose() {
    clearInterval(this.timer);
    this.playing = false;
    this.ac?.close().catch(() => {});
    this.ac = this.bus = this.filter = this.analyser = null;
    this.freqData = null;
    this.noiseBuf = null;
  }

  private build() {
    const AC: Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: Ctor }).webkitAudioContext;
    const ac = new AC();
    const comp = ac.createDynamicsCompressor();
    const master = ac.createGain();
    master.gain.value = 0.55;
    const analyser = ac.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.55;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 9;
    filter.frequency.value = this.cutoff;
    filter.connect(master);
    master.connect(comp);
    comp.connect(analyser);
    analyser.connect(ac.destination);

    const len = ac.sampleRate * 0.5;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    this.ac = ac;
    this.bus = master;
    this.filter = filter;
    this.analyser = analyser;
    this.freqData = new Uint8Array(analyser.frequencyBinCount);
    this.noiseBuf = buf;
    return ac;
  }

  private schedule() {
    const ac = this.ac;
    if (!ac) return;
    while (this.nextStep * STEP + this.t0 < ac.currentTime + LOOKAHEAD_S) {
      const t = this.nextStep * STEP + this.t0;
      const s = this.nextStep % STEPS;
      const bar = Math.floor(this.nextStep / STEPS) % LEAD.length;
      if (KICK[s]) this.kick(t);
      if (SNARE[s]) this.snare(t);
      if (HAT[s]) this.noise(t, 'highpass', 7500, s % 2 ? 0.14 : 0.08, 0.05);
      const note = LEAD[bar][s];
      if (note != null) this.lead(t, note);
      this.nextStep++;
    }
  }

  private env(g: GainNode, t: number, peak: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  }

  private kick(t: number) {
    const ac = this.ac!;
    const o = ac.createOscillator();
    const v = ac.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    this.env(v, t, 1, 0.38);
    o.connect(v).connect(this.bus!);
    o.start(t);
    o.stop(t + 0.4);
  }

  private noise(t: number, type: BiquadFilterType, f: number, peak: number, decay: number) {
    const ac = this.ac!;
    const s = ac.createBufferSource();
    const fl = ac.createBiquadFilter();
    const v = ac.createGain();
    s.buffer = this.noiseBuf;
    fl.type = type;
    fl.frequency.value = f;
    this.env(v, t, peak, decay);
    s.connect(fl).connect(v).connect(this.bus!);
    s.start(t);
    s.stop(t + decay + 0.02);
  }

  private snare(t: number) {
    const ac = this.ac!;
    this.noise(t, 'bandpass', 1800, 0.5, 0.18);
    const o = ac.createOscillator();
    const v = ac.createGain();
    o.type = 'triangle';
    o.frequency.value = 190;
    this.env(v, t, 0.3, 0.08);
    o.connect(v).connect(this.bus!);
    o.start(t);
    o.stop(t + 0.1);
  }

  private lead(t: number, m: number) {
    const ac = this.ac!;
    const v = ac.createGain();
    this.env(v, t, 0.16, STEP * 2.2);
    for (const det of [-12, 12]) {
      const o = ac.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = mtof(m);
      o.detune.value = det;
      o.connect(v);
      o.start(t);
      o.stop(t + STEP * 2.3);
    }
    v.connect(this.filter!);
  }
}
