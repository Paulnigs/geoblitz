class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled = true

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null

    if (!this.audioContext) {
      try {
        this.audioContext = new (
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      } catch {
        return null
      }
    }
    return this.audioContext
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  playCorrect() {
    if (!this.enabled) return
    // Play a cheerful ascending arpeggio
    setTimeout(() => this.playTone(523, 0.12, "sine"), 0) // C5
    setTimeout(() => this.playTone(659, 0.12, "sine"), 80) // E5
    setTimeout(() => this.playTone(784, 0.15, "sine"), 160) // G5
    setTimeout(() => this.playTone(1047, 0.2, "sine"), 240) // C6
  }

  playWrong() {
    if (!this.enabled) return
    this.playTone(300, 0.15, "square")
    setTimeout(() => this.playTone(200, 0.2, "square"), 100)
  }

  playTick() {
    if (!this.enabled) return
    this.playTone(440, 0.05, "sine")
  }

  playStreak() {
    if (!this.enabled) return
    setTimeout(() => this.playTone(523, 0.1, "sine"), 0)
    setTimeout(() => this.playTone(659, 0.1, "sine"), 100)
    setTimeout(() => this.playTone(784, 0.1, "sine"), 200)
    setTimeout(() => this.playTone(1047, 0.15, "sine"), 300)
    setTimeout(() => this.playTone(1319, 0.2, "sine"), 400)
  }

  playWarning() {
    if (!this.enabled) return
    this.playTone(600, 0.1, "square")
  }

  private playTone(frequency: number, duration: number, type: OscillatorType) {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch {
      // Audio not available
    }
  }
}

export const soundManager = new SoundManager()
