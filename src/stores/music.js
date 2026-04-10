import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'xp-music-preferences-v1'

const getSavedPreferences = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useMusicStore = defineStore('music', () => {
  const saved = getSavedPreferences()

  const widgetVisible = ref(saved?.widgetVisible ?? true)
  const skin = ref(saved?.skin ?? 'xp-blue')
  const eqBars = ref(saved?.eqBars ?? 24)
  const eqGlow = ref(saved?.eqGlow ?? 0.75)
  const volume = ref(saved?.volume ?? 65)

  const isPlaying = ref(false)
  const nowPlayingTitle = ref('Sin selección')
  const nowPlayingChannel = ref('')

  const command = ref({ type: '', nonce: 0 })

  const availableSkins = [
    { id: 'xp-blue', label: 'XP Blue' },
    { id: 'xp-olive', label: 'XP Olive' },
    { id: 'xp-silver', label: 'XP Silver' },
    { id: 'mp3-classic', label: 'MP3 Classic' },
    { id: 'winamp-neon', label: 'Winamp Neon' },
    { id: 'cassette-tape', label: 'Cassette Tape' },
    { id: 'cyber-purple', label: 'Cyber Purple' },
    { id: 'amber-led', label: 'Amber LED' },
  ]

  const sendCommand = (type) => {
    command.value = {
      type,
      nonce: Date.now(),
    }
  }

  watch(
    [widgetVisible, skin, eqBars, eqGlow, volume],
    () => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            widgetVisible: widgetVisible.value,
            skin: skin.value,
            eqBars: eqBars.value,
            eqGlow: eqGlow.value,
            volume: volume.value,
          })
        )
      } catch {
        // ignore persistence failures (private mode, quota, etc.)
      }
    },
    { deep: false }
  )

  return {
    widgetVisible,
    skin,
    eqBars,
    eqGlow,
    volume,
    isPlaying,
    nowPlayingTitle,
    nowPlayingChannel,
    command,
    availableSkins,
    sendCommand,
  }
})
