import { ref } from 'vue'

// Module-scoped refs so state is shared across all consumers.
const hasPlayed = ref(false)
const isEnabled = ref(true)
const hasInteracted = ref(false)
let lastClickAt = 0

const SOUND_URLS = {
  startup: 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3',
  shutdown: 'https://www.myinstants.com/media/sounds/preview_4.mp3',
  click: 'https://www.myinstants.com/media/sounds/clicksoundeffect.mp3',
}

const audioCache = new Map()

const getCachedAudio = (src) => {
  if (audioCache.has(src)) {
    return audioCache.get(src)
  }

  try {
    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.load()
    audioCache.set(src, audio)
    return audio
  } catch {
    return null
  }
}

export function useXPSound() {

  const safePlay = (src, { volume = 0.4, reuse = false } = {}) => {
    if (!isEnabled.value) return

    try {
      const audio = reuse ? getCachedAudio(src) : new Audio(src)
      if (!audio) return null
      audio.volume = volume
      // Best effort. Browsers may block until a user gesture.
      if (reuse) {
        audio.currentTime = 0
      }
      audio.play().catch(() => {})
      return audio
    } catch {
      // ignore
      return null
    }
  }

  const playStartupSound = () => {
    if (hasPlayed.value || !isEnabled.value || !hasInteracted.value) return

    const audio = safePlay(SOUND_URLS.startup, { volume: 0.4, reuse: true })
    hasPlayed.value = true
    return audio
  }

  const playShutdownSound = () => {
    // Shutdown sound should only play if the user already interacted.
    if (!hasInteracted.value || !isEnabled.value) return
    return safePlay(SOUND_URLS.shutdown, { volume: 0.45, reuse: true })
  }

  const playClickSound = () => {
    if (!hasInteracted.value || !isEnabled.value) return

    const now = Date.now()
    if (now - lastClickAt < 85) {
      return
    }

    lastClickAt = now
    return safePlay(SOUND_URLS.click, { volume: 0.22 })
  }

  const setupFirstInteractionListener = (onFirstInteraction) => {
    const handler = () => {
      hasInteracted.value = true

      // Warm startup/shutdown audio after first gesture.
      getCachedAudio(SOUND_URLS.startup)
      getCachedAudio(SOUND_URLS.shutdown)

      if (typeof onFirstInteraction === 'function') {
        onFirstInteraction()
      }
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
    }

    window.addEventListener('click', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    window.addEventListener('touchstart', handler, { once: true })
  }

  return {
    hasPlayed,
    isEnabled,
    hasInteracted,
    setupFirstInteractionListener,
    playStartupSound,
    playShutdownSound,
    playClickSound,
    safePlay,
  }
}
