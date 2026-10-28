/**
 * SoundService handles interactive dynamic audio cues
 * using Web Audio API synthesis for zero-latency Duolingo and Clash Royale style sound design.
 */
class SoundService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrect(): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
    osc2.frequency.setValueAtTime(659.25, now);
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.16);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  }

  playIncorrect(): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.28);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playStreakFanfare(): void {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.23);
    });
  }

  playClick(): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playChestRumble(): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.5);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playChestBurst(): void {
    const ctx = this.getContext();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.46);
    });
  }

  playCardReveal(rarity: 'common' | 'rare' | 'epic' | 'legendary'): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const freqs = rarity === 'legendary'
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51]
      : rarity === 'epic'
      ? [440, 554.37, 659.25, 880]
      : rarity === 'rare'
      ? [392, 493.88, 587.33]
      : [329.63, 392];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
    });
  }
}

export const soundService = new SoundService();
