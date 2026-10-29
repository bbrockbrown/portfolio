import { colFreq, DEFAULT_CUTOFF, HAT, KICK, LEAD, mtof, SNARE, STEP, STEPS } from './patch';

// Web Audio rendition of the patch. The AudioContext is created lazily on the
// first start(), which must come from a user gesture — audio is always opt-in.

const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;
const OUTPUT_GAIN = 1.6;

/** tanh curve scaled to ±0.95; ~unity small-signal gain after the 0.5 drive. */
function softClipCurve(n = 2048, k = 2.2) {
  const curve = new Float32Array(n);
  const norm = 0.95 / Math.tanh(k);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(k * x) * norm;
  }
  return curve;
}

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
      // iOS mutes Web Audio under the ring/silent switch unless the page's audio
      // session is 'playback' (Safari 16.4+; a no-op elsewhere).
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
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
    // Gentle bus compression + makeup gain: the defaults (-24 dB, 12:1) squashed
    // the mix to ~-26 dBFS RMS, near-silent on laptop/phone speakers.
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 6;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    const makeup = ac.createGain();
    makeup.gain.value = OUTPUT_GAIN;
    // Kick transients still overshoot (and the compressor adds its own auto
    // makeup), so finish with a tanh soft clipper: output never exceeds 0.95.
    const drive = ac.createGain();
    drive.gain.value = 0.5; // inputs up to ±2 land inside the curve's ±1 domain
    const clipper = ac.createWaveShaper();
    clipper.curve = softClipCurve();
    clipper.oversample = '2x';
    const master = ac.createGain();
    master.gain.value = 0.8;
    const analyser = ac.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.55;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 9;
    filter.frequency.value = this.cutoff;
    filter.connect(master);
    master.connect(comp);
    comp.connect(makeup);
    makeup.connect(drive);
    drive.connect(clipper);
    clipper.connect(analyser);
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

    // Small speakers can't reproduce the 42-150 Hz body, so add a short
    // mid-range knock that carries the beat on a laptop or phone.
    const k = ac.createOscillator();
    const kv = ac.createGain();
    k.type = 'triangle';
    k.frequency.setValueAtTime(420, t);
    k.frequency.exponentialRampToValueAtTime(110, t + 0.04);
    this.env(kv, t, 0.45, 0.06);
    k.connect(kv).connect(this.bus!);
    k.start(t);
    k.stop(t + 0.08);
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
    this.env(v, t, 0.26, STEP * 2.2);
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
