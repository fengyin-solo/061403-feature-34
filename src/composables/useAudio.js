import { ref, watch } from 'vue'

export function useAudio() {
  const audioContext = ref(null)
  const muted = ref(false)

  const masterGain = ref(null)

  const ambientTracks = ref({
    day: { oscillator: null, gain: null, active: false },
    night: { oscillator: null, gain: null, active: false },
    blizzard: { oscillator: null, gain: null, active: false },
    fire: { oscillator: null, gain: null, active: false }
  })

  const dangerAlertInterval = ref(null)
  const dangerAlertActive = ref(false)

  function initAudio() {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
      masterGain.value = audioContext.value.createGain()
      masterGain.value.connect(audioContext.value.destination)
      masterGain.value.gain.value = muted.value ? 0 : 1
    }
    if (audioContext.value.state === 'suspended') {
      audioContext.value.resume()
    }
  }

  function applyMuteToAll() {
    if (!masterGain.value) return
    masterGain.value.gain.setValueAtTime(
      muted.value ? 0 : 1,
      audioContext.value.currentTime
    )
  }

  function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (muted.value || !audioContext.value) return

    try {
      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(masterGain.value)

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

  function startAmbientTrack(trackName, frequency, type, baseVolume, modulation = false) {
    initAudio()
    if (!audioContext.value || muted.value) return

    stopAmbientTrack(trackName)

    try {
      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()

      oscillator.type = type
      oscillator.frequency.value = frequency

      gainNode.gain.setValueAtTime(0, audioContext.value.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        baseVolume,
        audioContext.value.currentTime + 2
      )

      oscillator.connect(gainNode)
      gainNode.connect(masterGain.value)

      if (modulation) {
        const lfo = audioContext.value.createOscillator()
        const lfoGain = audioContext.value.createGain()
        lfo.frequency.value = 0.3
        lfoGain.gain.value = baseVolume * 0.3
        lfo.connect(lfoGain)
        lfoGain.connect(gainNode.gain)
        lfo.start()
        ambientTracks.value[trackName].lfo = lfo
      }

      oscillator.start()
      ambientTracks.value[trackName].oscillator = oscillator
      ambientTracks.value[trackName].gain = gainNode
      ambientTracks.value[trackName].active = true
    } catch (e) {
      console.log('Ambient track start failed:', e)
    }
  }

  function stopAmbientTrack(trackName) {
    const track = ambientTracks.value[trackName]
    if (!track || !track.active || !audioContext.value) return

    try {
      const fadeOutTime = 1.5
      track.gain.gain.cancelScheduledValues(audioContext.value.currentTime)
      track.gain.gain.setValueAtTime(
        track.gain.gain.value,
        audioContext.value.currentTime
      )
      track.gain.gain.linearRampToValueAtTime(
        0,
        audioContext.value.currentTime + fadeOutTime
      )

      const osc = track.oscillator
      const lfo = track.lfo
      setTimeout(() => {
        try {
          osc.stop()
          osc.disconnect()
        } catch (e) {}
        try {
          if (lfo) {
            lfo.stop()
            lfo.disconnect()
          }
        } catch (e) {}
        try {
          track.gain.disconnect()
        } catch (e) {}
      }, fadeOutTime * 1000 + 100)

      track.active = false
      track.oscillator = null
      track.gain = null
      track.lfo = null
    } catch (e) {
      console.log('Ambient track stop failed:', e)
      track.active = false
      track.oscillator = null
      track.gain = null
      track.lfo = null
    }
  }

  function startDayAmbient() {
    stopNightAmbient()
    stopBlizzardAmbient()
    startAmbientTrack('day', 180, 'sine', 0.04, true)
  }

  function stopDayAmbient() {
    stopAmbientTrack('day')
  }

  function startNightAmbient() {
    stopDayAmbient()
    stopBlizzardAmbient()
    startAmbientTrack('night', 90, 'sine', 0.05, true)
  }

  function stopNightAmbient() {
    stopAmbientTrack('night')
  }

  function startBlizzardAmbient() {
    startAmbientTrack('blizzard', 120, 'sawtooth', 0.08, true)
  }

  function stopBlizzardAmbient() {
    stopAmbientTrack('blizzard')
  }

  function startFireAmbient() {
    startAmbientTrack('fire', 200, 'triangle', 0.06, true)
  }

  function stopFireAmbient() {
    stopAmbientTrack('fire')
  }

  function updateAmbientByScene(isDay, isBlizzard) {
    if (isBlizzard) {
      startBlizzardAmbient()
    } else {
      stopBlizzardAmbient()
    }

    if (isDay) {
      startDayAmbient()
    } else {
      startNightAmbient()
    }
  }

  function updateFireAmbientByHeat(heat) {
    if (heat > 10) {
      startFireAmbient()
      if (ambientTracks.value.fire.gain && audioContext.value) {
        const targetVolume = Math.min(0.12, (heat / 100) * 0.12)
        ambientTracks.value.fire.gain.gain.linearRampToValueAtTime(
          targetVolume,
          audioContext.value.currentTime + 1
        )
      }
    } else {
      stopFireAmbient()
    }
  }

  function playDangerPulse() {
    if (muted.value || !audioContext.value) return
    playTone(330, 0.12, 'square', 0.2)
    setTimeout(() => playTone(220, 0.12, 'square', 0.2), 150)
  }

  function startDangerAlert() {
    if (dangerAlertActive.value) return
    dangerAlertActive.value = true

    playDangerPulse()
    dangerAlertInterval.value = setInterval(() => {
      if (!muted.value) {
        playDangerPulse()
      }
    }, 2000)
  }

  function stopDangerAlert() {
    dangerAlertActive.value = false
    if (dangerAlertInterval.value) {
      clearInterval(dangerAlertInterval.value)
      dangerAlertInterval.value = null
    }
  }

  function updateDangerAlert(isDanger) {
    if (isDanger) {
      startDangerAlert()
    } else {
      stopDangerAlert()
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

  function stopAllAmbient() {
    Object.keys(ambientTracks.value).forEach(trackName => {
      stopAmbientTrack(trackName)
    })
  }

  function toggleMute() {
    muted.value = !muted.value
    applyMuteToAll()
    return muted.value
  }

  function setMute(value) {
    muted.value = value
    applyMuteToAll()
  }

  watch(muted, () => {
    applyMuteToAll()
  })

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
    toggleMute,
    setMute,
    startDayAmbient,
    stopDayAmbient,
    startNightAmbient,
    stopNightAmbient,
    startBlizzardAmbient,
    stopBlizzardAmbient,
    startFireAmbient,
    stopFireAmbient,
    updateAmbientByScene,
    updateFireAmbientByHeat,
    startDangerAlert,
    stopDangerAlert,
    updateDangerAlert,
    stopAllAmbient
  }
}
