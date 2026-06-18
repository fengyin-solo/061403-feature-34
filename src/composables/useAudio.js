import { ref } from 'vue'

export function useAudio() {
  const audioContext = ref(null)
  const muted = ref(false)

  function initAudio() {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContext.value.state === 'suspended') {
      audioContext.value.resume()
    }
  }

  function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (muted.value || !audioContext.value) return
    
    try {
      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.value.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(volume, audioContext.value.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + duration)
      
      oscillator.start(audioContext.value.currentTime)
      oscillator.stop(audioContext.value.currentTime + duration)
    } catch (e) {
      console.log('Audio playback failed:', e)
    }
  }

  function playChop() {
    initAudio()
    playTone(150, 0.15, 'square', 0.2)
    setTimeout(() => playTone(120, 0.1, 'square', 0.15), 80)
  }

  function playHunt() {
    initAudio()
    playTone(400, 0.1, 'sawtooth', 0.2)
    setTimeout(() => playTone(300, 0.15, 'sawtooth', 0.15), 100)
  }

  function playSuccess() {
    initAudio()
    playTone(523, 0.15, 'sine', 0.3)
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 100)
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200)
  }

  function playFire() {
    initAudio()
    playTone(200, 0.3, 'triangle', 0.15)
    setTimeout(() => playTone(250, 0.2, 'triangle', 0.1), 50)
    setTimeout(() => playTone(180, 0.25, 'triangle', 0.1), 100)
  }

  function playWarning() {
    initAudio()
    playTone(220, 0.2, 'square', 0.25)
    setTimeout(() => playTone(220, 0.2, 'square', 0.25), 250)
  }

  function playDanger() {
    initAudio()
    playTone(100, 0.3, 'sawtooth', 0.3)
    setTimeout(() => playTone(80, 0.4, 'sawtooth', 0.3), 200)
  }

  function playEat() {
    initAudio()
    playTone(330, 0.1, 'sine', 0.2)
    setTimeout(() => playTone(440, 0.15, 'sine', 0.2), 80)
  }

  function playCraft() {
    initAudio()
    playTone(300, 0.1, 'triangle', 0.2)
    setTimeout(() => playTone(400, 0.1, 'triangle', 0.2), 100)
    setTimeout(() => playTone(500, 0.15, 'triangle', 0.2), 200)
  }

  function playBlizzard() {
    initAudio()
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(100 + Math.random() * 50, 0.2, 'sawtooth', 0.15)
      }, i * 100)
    }
  }

  function toggleMute() {
    muted.value = !muted.value
  }

  return {
    muted,
    initAudio,
    playChop,
    playHunt,
    playSuccess,
    playFire,
    playWarning,
    playDanger,
    playEat,
    playCraft,
    playBlizzard,
    toggleMute
  }
}
