import { ref, computed, watch } from 'vue'
import { useMusicStore } from '@/stores/music'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const PLAYLIST_ID = 'PLdutKNs0aaYFwLGTFMGFyCEYeknDFYZXU'

const loading = ref(false)
const error = ref('')
const tracks = ref([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

let ytPlayer = null
let progressTimer = null
let initialized = false
let watcherSetup = false
let persistentHost = null
let musicStoreRef = null

const currentTrack = computed(() => tracks.value[currentIndex.value] || null)

const ensureHost = () => {
  if (!persistentHost) {
    persistentHost = document.createElement('div')
    persistentHost.style.position = 'absolute'
    persistentHost.style.width = '0'
    persistentHost.style.height = '0'
    persistentHost.style.overflow = 'hidden'
    persistentHost.setAttribute('aria-hidden', 'true')
    document.body.appendChild(persistentHost)
  }
  return persistentHost
}

const loadYouTubeIframeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[data-youtube-iframe-api]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.youtubeIframeApi = 'true'
      document.body.appendChild(script)
    }
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
  })
}

const syncProgress = () => {
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return
  currentTime.value = Math.floor(ytPlayer.getCurrentTime() || 0)
  duration.value = Math.floor(ytPlayer.getDuration() || 0)
}

const bootPlayer = async () => {
  if (ytPlayer) return
  const host = ensureHost()
  await loadYouTubeIframeApi()

  ytPlayer = new window.YT.Player(host, {
    height: '0',
    width: '0',
    videoId: currentTrack.value?.id || '',
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
      controls: 0,
      fs: 0,
      iv_load_policy: 3,
    },
    events: {
      onReady: (event) => {
        if (currentTrack.value) {
          event.target.cueVideoById(currentTrack.value.id)
        }
        event.target.setVolume(musicStoreRef?.volume ?? 65)
      },
      onStateChange: (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
          if (!tracks.value.length) {
            isPlaying.value = false
            return
          }
          const nextIndex = (currentIndex.value + 1) % tracks.value.length
          selectTrack(nextIndex, { autoplay: true })
          return
        }
        isPlaying.value = event.data === window.YT.PlayerState.PLAYING
      },
    },
  })

  if (!progressTimer) {
    progressTimer = window.setInterval(syncProgress, 500)
  }
}

const loadPlaylist = async () => {
  if (tracks.value.length) return
  loading.value = true
  error.value = ''
  try {
    const url = `${API_BASE}/api/music/playlist?playlistId=${encodeURIComponent(PLAYLIST_ID)}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Error ${response.status}`)
    const payload = await response.json()
    tracks.value = payload.tracks || []
    currentIndex.value = 0
  } catch {
    error.value = 'No se pudo cargar la playlist'
  } finally {
    loading.value = false
  }
}

const selectTrack = (index, { autoplay = isPlaying.value } = {}) => {
  currentIndex.value = index
  const track = tracks.value[index]
  if (!track || !ytPlayer) return
  if (autoplay) {
    ytPlayer.loadVideoById(track.id)
    isPlaying.value = true
  } else {
    ytPlayer.cueVideoById(track.id)
    isPlaying.value = false
  }
  currentTime.value = 0
  if (musicStoreRef) {
    musicStoreRef.nowPlayingTitle = track.title
    musicStoreRef.nowPlayingChannel = track.channelTitle
  }
}

const togglePlay = () => {
  if (!ytPlayer) return
  if (isPlaying.value) {
    ytPlayer.pauseVideo()
  } else {
    ytPlayer.playVideo()
  }
}

const stopPlayback = () => {
  if (!ytPlayer) return
  ytPlayer.stopVideo()
  isPlaying.value = false
  currentTime.value = 0
}

const nextTrack = () => {
  if (!tracks.value.length) return
  const shouldAutoplay = isPlaying.value
  const nextIndex = (currentIndex.value + 1) % tracks.value.length
  selectTrack(nextIndex, { autoplay: shouldAutoplay })
}

const prevTrack = () => {
  if (!tracks.value.length) return
  const shouldAutoplay = isPlaying.value
  const prevIndex = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
  selectTrack(prevIndex, { autoplay: shouldAutoplay })
}

const seekTo = (event) => {
  if (!ytPlayer) return
  const value = Number(event.target.value || 0)
  ytPlayer.seekTo(value, true)
  currentTime.value = value
}

const setVolume = (event) => {
  const value = Number(event.target.value || 0)
  if (musicStoreRef) musicStoreRef.volume = value
  if (ytPlayer) ytPlayer.setVolume(value)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function useMusicPlayer() {
  const musicStore = useMusicStore()
  musicStoreRef = musicStore

  if (!watcherSetup) {
    watcherSetup = true

    watch(
      () => musicStore.command,
      (cmd) => {
        if (!cmd?.type) return
        if (cmd.type === 'prev') prevTrack()
        if (cmd.type === 'next') nextTrack()
        if (cmd.type === 'toggle-play') togglePlay()
        if (cmd.type === 'stop') stopPlayback()
      },
      { deep: true }
    )

    watch(
      () => musicStore.volume,
      (value) => {
        if (ytPlayer) ytPlayer.setVolume(value)
      }
    )

    watch(isPlaying, (value) => {
      if (musicStoreRef) musicStoreRef.isPlaying = value
    })
  }

  const init = async () => {
    if (initialized) return
    initialized = true
    await loadPlaylist()
    if (currentTrack.value) {
      await bootPlayer()
      musicStore.nowPlayingTitle = currentTrack.value.title
      musicStore.nowPlayingChannel = currentTrack.value.channelTitle
    }
  }

  return {
    loading,
    error,
    tracks,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    selectTrack,
    togglePlay,
    stopPlayback,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    formatTime,
    init,
  }
}
