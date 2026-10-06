/**
 * Rain on glass and a low electrical hum, synthesized with Web Audio so there are
 * no files to load. Only ever started from a user gesture.
 */
export class Ambience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  get running(): boolean {
    return this.ctx?.state === 'running' && (this.master?.gain.value ?? 0) > 0
  }

  async start(): Promise<void> {
    if (!this.ctx) this.build()
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    await ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.6)
  }

  stop(): void {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.35)
    window.setTimeout(() => {
      if (master.gain.value < 0.01) void ctx.suspend()
    }, 2000)
  }

  private build(): void {
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // Rain: pink-ish noise, band-limited, with a slow swell.
    const rain = ctx.createBufferSource()
    rain.buffer = noiseBuffer(ctx, 4, 'pink')
    rain.loop = true
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 500
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 7000
    const rainGain = ctx.createGain()
    rainGain.gain.value = 0.16
    const swell = ctx.createOscillator()
    swell.frequency.value = 0.07
    const swellDepth = ctx.createGain()
    swellDepth.gain.value = 0.05
    swell.connect(swellDepth).connect(rainGain.gain)
    rain.connect(hp).connect(lp).connect(rainGain).connect(master)

    // Distant city: brown noise, very low.
    const city = ctx.createBufferSource()
    city.buffer = noiseBuffer(ctx, 5, 'brown')
    city.loop = true
    const cityLp = ctx.createBiquadFilter()
    cityLp.type = 'lowpass'
    cityLp.frequency.value = 220
    const cityGain = ctx.createGain()
    cityGain.gain.value = 0.35
    city.connect(cityLp).connect(cityGain).connect(master)

    // Hum from the equipment: mains fundamental plus a faint harmonic.
    const hum = ctx.createGain()
    hum.gain.value = 0.012
    for (const [f, g] of [
      [50, 1],
      [100, 0.4],
      [150, 0.15],
    ] as const) {
      const o = ctx.createOscillator()
      o.frequency.value = f
      const og = ctx.createGain()
      og.gain.value = g
      o.connect(og).connect(hum)
      o.start()
    }
    hum.connect(master)

    rain.start()
    city.start()
    swell.start()
    this.ctx = ctx
    this.master = master
  }
}

function noiseBuffer(ctx: AudioContext, seconds: number, color: 'pink' | 'brown'): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    let b0 = 0
    let b1 = 0
    let b2 = 0
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      if (color === 'pink') {
        // Paul Kellet's economy pink filter.
        b0 = 0.99765 * b0 + white * 0.099046
        b1 = 0.963 * b1 + white * 0.2965164
        b2 = 0.57 * b2 + white * 1.0526913
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2
      } else {
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      }
    }
    // Crossfade the ends so the loop point is inaudible.
    const fade = Math.floor(ctx.sampleRate * 0.25)
    for (let i = 0; i < fade; i++) {
      const t = i / fade
      data[i] = (data[i] ?? 0) * t + (data[len - fade + i] ?? 0) * (1 - t)
    }
  }
  return buf
}
