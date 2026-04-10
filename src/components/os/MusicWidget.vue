<template>
  <aside class="music-widget" :class="skinClass">
    <header class="widget-header">
      <div class="widget-title">
        <img src="/icons/media-audio.svg" alt="Music" />
        <div>
          <strong>Now Playing</strong>
          <p>YT Music Widget</p>
        </div>
      </div>
      <button class="close-widget" @click="$emit('close')" aria-label="Cerrar widget"></button>
    </header>

    <section class="widget-now">
      <img :src="currentTrack?.thumbnail || '/icons/media-audio.svg'" alt="cover" class="cover" />
      <div class="track-meta">
        <p class="track-title">{{ currentTrack?.title || 'Sin selección' }}</p>
        <p class="track-channel">{{ currentTrack?.channelTitle || 'Sin reproducción automática' }}</p>
      </div>
    </section>

    <div ref="playerHost" class="player-host"></div>

    <div class="controls-row">
      <button @click="prevTrack" :disabled="!tracks.length" aria-label="Anterior">⏮</button>
      <button @click="togglePlay" :disabled="!currentTrack" aria-label="Play/Pause">
        {{ isPlaying ? '⏸' : '▶' }}
      </button>
      <button @click="stopPlayback" :disabled="!currentTrack" aria-label="Detener">⏹</button>
      <button @click="nextTrack" :disabled="!tracks.length" aria-label="Siguiente">⏭</button>
    </div>

    <div class="progress-block">
      <span>{{ formatTime(currentTime) }}</span>
      <input
        type="range"
        min="0"
        :max="Math.max(duration, 1)"
        :value="currentTime"
        @input="seekTo($event)"
      />
      <span>{{ formatTime(duration) }}</span>
    </div>

    <div class="volume-block">
      <label for="volume">Vol</label>
      <input id="volume" type="range" min="0" max="100" :value="volume" @input="setVolume($event)" />
    </div>

    <div class="equalizer" :class="{ active: isPlaying }" :style="eqStyle" aria-hidden="true">
      <span v-for="i in musicStore.eqBars" :key="i" :style="{ animationDelay: `${i * 80}ms` }"></span>
    </div>

    <div class="playlist-head">
      <strong>Playlist</strong>
      <span v-if="loading">Cargando...</span>
      <span v-else-if="error" class="error">{{ error }}</span>
      <span v-else>{{ tracks.length }} tracks</span>
    </div>

    <ul class="track-list">
      <li v-for="(track, index) in tracks" :key="track.id" :class="{ active: currentIndex === index }">
        <button class="track-btn" @click="selectTrack(index)">
          <img :src="track.thumbnail" :alt="track.title" />
          <span>{{ track.title }}</span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@/stores/music'

defineEmits(['close'])

const musicStore = useMusicStore()

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const PLAYLIST_ID = 'PLdutKNs0aaYFwLGTFMGFyCEYeknDFYZXU'

const loading = ref(false)
const error = ref('')
const tracks = ref([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(musicStore.volume)
const playerHost = ref(null)

let ytPlayer = null
let progressTimer = null

const currentTrack = computed(() => tracks.value[currentIndex.value] || null)
const skinClass = computed(() => `skin-${musicStore.skin}`)
const eqStyle = computed(() => ({
  '--eq-bars': String(musicStore.eqBars),
  '--eq-glow': String(musicStore.eqGlow),
}))

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
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') {
    return
  }

  currentTime.value = Math.floor(ytPlayer.getCurrentTime() || 0)
  duration.value = Math.floor(ytPlayer.getDuration() || 0)
}

const bootPlayer = async () => {
  if (!currentTrack.value || !playerHost.value) {
    return
  }

  await loadYouTubeIframeApi()

  ytPlayer = new window.YT.Player(playerHost.value, {
    height: '0',
    width: '0',
    videoId: currentTrack.value.id,
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
        event.target.cueVideoById(currentTrack.value.id)
        event.target.setVolume(volume.value)
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

  progressTimer = window.setInterval(syncProgress, 500)
}

const loadPlaylist = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = `${API_BASE}/api/music/playlist?playlistId=${encodeURIComponent(PLAYLIST_ID)}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error ${response.status}`)
    }

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

  if (!track || !ytPlayer) {
    return
  }

  if (autoplay) {
    ytPlayer.loadVideoById(track.id)
    isPlaying.value = true
  } else {
    ytPlayer.cueVideoById(track.id)
    isPlaying.value = false
  }

  currentTime.value = 0

  musicStore.nowPlayingTitle = track.title
  musicStore.nowPlayingChannel = track.channelTitle
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
  volume.value = value
  musicStore.volume = value
  if (ytPlayer) {
    ytPlayer.setVolume(value)
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

onMounted(async () => {
  await loadPlaylist()
  await bootPlayer()

  if (currentTrack.value) {
    musicStore.nowPlayingTitle = currentTrack.value.title
    musicStore.nowPlayingChannel = currentTrack.value.channelTitle
  }
})

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
    volume.value = value
    if (ytPlayer) ytPlayer.setVolume(value)
  }
)

watch(isPlaying, (value) => {
  musicStore.isPlaying = value
})

onBeforeUnmount(() => {
  if (progressTimer) {
    window.clearInterval(progressTimer)
  }

  if (ytPlayer && typeof ytPlayer.destroy === 'function') {
    ytPlayer.destroy()
  }
})
</script>

<style scoped>
.music-widget {
  position: fixed;
  right: 10px;
  top: 10px;
  bottom: 40px;
  width: 340px;
  z-index: 90;
  background: #d7e7fb;
  border: 2px solid;
  border-color: #ffffff #4f79ad #4f79ad #ffffff;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.35);
}

.music-widget.skin-xp-olive {
  background: #e6edd8;
  border-color: #ffffff #7a8d4f #7a8d4f #ffffff;
}

.music-widget.skin-xp-silver {
  background: #e7ebf3;
  border-color: #ffffff #7d879b #7d879b #ffffff;
}

.music-widget.skin-mp3-classic {
  background: linear-gradient(180deg, #222 0%, #121212 100%);
  border-color: #8b8b8b #060606 #060606 #8b8b8b;
  color: #e8e8e8;
}

.music-widget.skin-winamp-neon {
  background: linear-gradient(145deg, #19231b 0%, #0b0f0a 100%);
  border-color: #94ff57 #304322 #304322 #94ff57;
  color: #d6ffd1;
}

.music-widget.skin-cassette-tape {
  background: linear-gradient(180deg, #262120 0%, #1a1413 100%);
  border-color: #b0936f #3e2b22 #3e2b22 #b0936f;
  color: #f7e4cf;
}

.music-widget.skin-cyber-purple {
  background: linear-gradient(180deg, #1e1838 0%, #0f0a1f 100%);
  border-color: #c48bff #35245e #35245e #c48bff;
  color: #f0e6ff;
}

.music-widget.skin-amber-led {
  background: linear-gradient(180deg, #1e1610 0%, #0f0b08 100%);
  border-color: #ffcc7a #5f3f16 #5f3f16 #ffcc7a;
  color: #ffe2aa;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #1f57a6, #2f7bd6 45%, #2a69bf);
  color: #fff;
  padding: 6px;
}

.music-widget.skin-mp3-classic .widget-header,
.music-widget.skin-cassette-tape .widget-header,
.music-widget.skin-amber-led .widget-header {
  background: linear-gradient(90deg, #454545, #2d2d2d 45%, #1b1b1b);
}

.music-widget.skin-winamp-neon .widget-header {
  background: linear-gradient(90deg, #1d4f1c, #1f7b28 45%, #14501e);
}

.music-widget.skin-cyber-purple .widget-header {
  background: linear-gradient(90deg, #4b2e88, #6f3cc8 45%, #4f2c8f);
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.widget-title img {
  width: 16px;
  height: 16px;
}

.widget-title p {
  margin: 0;
  font-size: 10px;
}

.close-widget {
  width: 18px;
  height: 18px;
  border: 1px solid #6a1d1d;
  background: linear-gradient(180deg, #ffb4a6, #e54f3d);
  position: relative;
}

.close-widget::before,
.close-widget::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 2px;
  background: #fff;
  top: 7px;
  left: 4px;
}

.close-widget::before {
  transform: rotate(45deg);
}

.close-widget::after {
  transform: rotate(-45deg);
}

.widget-now {
  display: flex;
  gap: 8px;
  border: 1px solid #7f9db9;
  background: #f5fbff;
  padding: 6px;
}

.music-widget.skin-mp3-classic .widget-now,
.music-widget.skin-cassette-tape .widget-now,
.music-widget.skin-amber-led .widget-now {
  background: #111;
  border-color: #4c4c4c;
}

.music-widget.skin-winamp-neon .widget-now {
  background: #102011;
  border-color: #5ea93d;
}

.music-widget.skin-cyber-purple .widget-now {
  background: #1d1735;
  border-color: #7456b4;
}

.cover {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border: 1px solid #7f9db9;
}

.track-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
}

.track-channel {
  margin: 3px 0 0;
  font-size: 10px;
  color: #355377;
}

.player-host {
  width: 0;
  height: 0;
  overflow: hidden;
}

.controls-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.progress-block,
.volume-block {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 6px;
  align-items: center;
  font-size: 10px;
}

.volume-block {
  grid-template-columns: auto 1fr;
}

.equalizer {
  display: grid;
  grid-template-columns: repeat(var(--eq-bars), minmax(4px, 1fr));
  gap: 2px;
  align-items: end;
  height: 34px;
  padding: 3px 5px;
  border: 1px solid #7f9db9;
  background: #091932;
  position: relative;
}

.music-widget.skin-cyber-purple .equalizer {
  background: #120f20;
}

.music-widget.skin-amber-led .equalizer {
  background: #1a1209;
}

.equalizer span {
  width: 100%;
  height: 8px;
  background: linear-gradient(180deg, #6fff9a, #1fc05f);
  box-shadow: 0 0 8px rgba(111, 255, 154, var(--eq-glow));
  animation: eq 900ms ease-in-out infinite;
  animation-play-state: paused;
}

.music-widget.skin-cyber-purple .equalizer span {
  background: linear-gradient(180deg, #d197ff, #8b46d9);
  box-shadow: 0 0 8px rgba(209, 151, 255, var(--eq-glow));
}

.music-widget.skin-amber-led .equalizer span {
  background: linear-gradient(180deg, #ffd27d, #d8892b);
  box-shadow: 0 0 8px rgba(255, 210, 125, var(--eq-glow));
}

.equalizer.active span {
  animation-play-state: running;
}

@keyframes eq {
  0%,
  100% {
    height: 6px;
  }
  50% {
    height: 22px;
  }
}

.playlist-head {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  padding: 4px 2px 0;
}

.track-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  border: 1px solid #7f9db9;
  background: #fff;
  flex: 1;
}

.music-widget.skin-mp3-classic .track-list,
.music-widget.skin-cassette-tape .track-list,
.music-widget.skin-amber-led .track-list {
  background: #151515;
  border-color: #444;
}

.music-widget.skin-winamp-neon .track-list {
  background: #101a10;
  border-color: #467b35;
}

.music-widget.skin-cyber-purple .track-list {
  background: #161027;
  border-color: #7050ad;
}

.track-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 0;
  border-bottom: 1px solid #e2ebf8;
  background: transparent;
  padding: 5px;
  text-align: left;
}

.music-widget.skin-mp3-classic .track-btn,
.music-widget.skin-cassette-tape .track-btn,
.music-widget.skin-amber-led .track-btn,
.music-widget.skin-winamp-neon .track-btn,
.music-widget.skin-cyber-purple .track-btn {
  color: inherit;
}

.track-btn img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.track-list li.active .track-btn,
.track-btn:hover {
  background: #d9e9ff;
}

.music-widget.skin-mp3-classic .track-list li.active .track-btn,
.music-widget.skin-mp3-classic .track-btn:hover {
  background: #262626;
}

.music-widget.skin-winamp-neon .track-list li.active .track-btn,
.music-widget.skin-winamp-neon .track-btn:hover {
  background: #193420;
}

.music-widget.skin-cassette-tape .track-list li.active .track-btn,
.music-widget.skin-cassette-tape .track-btn:hover {
  background: #3b2b23;
}

.music-widget.skin-cyber-purple .track-list li.active .track-btn,
.music-widget.skin-cyber-purple .track-btn:hover {
  background: #2f2350;
}

.music-widget.skin-amber-led .track-list li.active .track-btn,
.music-widget.skin-amber-led .track-btn:hover {
  background: #3b2814;
}

.error {
  color: #a52323;
}
</style>
