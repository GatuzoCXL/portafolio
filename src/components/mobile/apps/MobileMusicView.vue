<script setup>
import { computed, onMounted } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useMusicPlayer } from '@/composables/useMusicPlayer'
import { assetUrl } from '@/utils/assetUrl'

const musicStore = useMusicStore()
const player = useMusicPlayer()
const musicIcon = assetUrl('icons/media-audio.svg')

onMounted(() => {
  player.init()
})

const statusLabel = computed(() => {
  if (player.isPlaying.value) return 'Reproduciendo'
  if (player.currentTrack.value) return 'Pausado'
  return 'Detenido'
})

const eqStyle = computed(() => ({
  '--eq-bars': String(musicStore.eqBars),
  '--eq-glow': String(musicStore.eqGlow),
}))

const toggleWidget = () => {
  musicStore.widgetVisible = !musicStore.widgetVisible
}
</script>

<template>
  <div class="mobile-music-view" :class="`skin-${musicStore.skin}`">
    <div class="music-hero">
      <img :src="player.currentTrack.value?.thumbnail || musicIcon" alt="cover" class="music-cover" />
      <div class="music-meta">
        <h2 class="track-title">{{ player.currentTrack.value?.title || musicStore.nowPlayingTitle }}</h2>
        <p class="track-channel">{{ player.currentTrack.value?.channelTitle || musicStore.nowPlayingChannel || 'Sin canal' }}</p>
        <span class="track-status">{{ statusLabel }}</span>
      </div>
    </div>

    <div class="music-progress">
      <span>{{ player.formatTime(player.currentTime.value) }}</span>
      <input
        type="range"
        min="0"
        :max="Math.max(player.duration.value, 1)"
        :value="player.currentTime.value"
        @input="player.seekTo($event)"
      />
      <span>{{ player.formatTime(player.duration.value) }}</span>
    </div>

    <div class="music-controls">
      <button class="control-btn" @click="player.prevTrack" aria-label="Anterior">⏮</button>
      <button class="control-btn play-btn" @click="player.togglePlay" aria-label="Play/Pause">
        {{ player.isPlaying.value ? '⏸' : '▶' }}
      </button>
      <button class="control-btn" @click="player.stopPlayback" aria-label="Detener">⏹</button>
      <button class="control-btn" @click="player.nextTrack" aria-label="Siguiente">⏭</button>
    </div>

    <div class="music-volume">
      <label>Volumen</label>
      <input type="range" min="0" max="100" :value="musicStore.volume" @input="player.setVolume($event)" />
      <span>{{ musicStore.volume }}</span>
    </div>

    <div class="music-equalizer" :class="{ active: player.isPlaying.value }" :style="eqStyle">
      <span v-for="i in musicStore.eqBars" :key="i" :style="{ animationDelay: `${i * 80}ms` }"></span>
    </div>

    <div class="music-playlist">
      <div class="playlist-head">
        <strong>Lista de reproducción</strong>
        <span v-if="player.loading.value">Cargando...</span>
        <span v-else-if="player.error.value" class="error">{{ player.error.value }}</span>
        <span v-else>{{ player.tracks.value.length }} pistas</span>
      </div>
      <ul class="track-list">
        <li
          v-for="(track, index) in player.tracks.value"
          :key="track.id"
          :class="{ active: player.currentIndex.value === index }"
        >
          <button class="track-btn" @click="player.selectTrack(index)">
            <img :src="track.thumbnail" :alt="track.title" />
            <span>{{ track.title }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="music-settings">
      <div class="setting-row">
        <label>Skin</label>
        <select v-model="musicStore.skin">
          <option v-for="skin in musicStore.availableSkins" :key="skin.id" :value="skin.id">
            {{ skin.label }}
          </option>
        </select>
      </div>
      <div class="setting-row">
        <label>Ecualizador: {{ musicStore.eqBars }} barras</label>
        <input type="range" min="10" max="40" v-model.number="musicStore.eqBars" />
      </div>
      <div class="setting-row">
        <label>Brillo: {{ musicStore.eqGlow.toFixed(2) }}</label>
        <input type="range" min="0.2" max="1" step="0.05" v-model.number="musicStore.eqGlow" />
      </div>
    </div>

    <button class="widget-toggle-btn" @click="toggleWidget">
      {{ musicStore.widgetVisible ? 'Ocultar widget' : 'Mostrar widget' }}
    </button>
  </div>
</template>

<style scoped>
.mobile-music-view {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #1a1a1a;
  min-height: 0;
  color: #e8e8e8;
}

.music-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-radius: 16px;
  text-align: center;
}

.music-cover {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #333;
}

.track-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #f2eef7;
}

.track-channel {
  margin: 4px 0 0;
  font-size: 13px;
  color: #8e8e8e;
}

.track-status {
  margin-top: 6px;
  font-size: 12px;
  color: #8ecf32;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.music-controls {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border: none;
  border-radius: 14px;
  background: #2d2d2d;
  color: #f2eef7;
  font-size: 20px;
  cursor: pointer;
  min-height: 44px;
}

.control-btn:active {
  opacity: 0.7;
}

.play-btn {
  background: #8ecf32;
  color: #0d1a06;
  font-size: 24px;
}

.music-volume {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: #252525;
  border-radius: 12px;
}

.music-volume label {
  font-size: 12px;
  color: #8e8e8e;
  font-weight: 600;
}

.music-volume span {
  font-size: 12px;
  color: #f2eef7;
  min-width: 28px;
  text-align: right;
}

.music-equalizer {
  display: grid;
  grid-template-columns: repeat(var(--eq-bars), minmax(3px, 1fr));
  gap: 2px;
  align-items: end;
  height: 40px;
  padding: 4px 8px;
  border-radius: 8px;
  background: #091932;
}

.music-equalizer span {
  width: 100%;
  height: 6px;
  background: linear-gradient(180deg, #6fff9a, #1fc05f);
  box-shadow: 0 0 6px rgba(111, 255, 154, var(--eq-glow));
  animation: eq 900ms ease-in-out infinite;
  animation-play-state: paused;
  border-radius: 1px;
}

.music-equalizer.active span {
  animation-play-state: running;
}

@keyframes eq {
  0%, 100% {
    height: 6px;
  }
  50% {
    height: 28px;
  }
}

.music-progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: #252525;
  border-radius: 12px;
  font-size: 12px;
  color: #8e8e8e;
}

.music-progress input[type='range'] {
  width: 100%;
}

.music-playlist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: #252525;
  border-radius: 12px;
}

.playlist-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8e8e8e;
}

.playlist-head strong {
  color: #f2eef7;
}

.playlist-head .error {
  color: #ff6b6b;
}

.track-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: clamp(120px, 30vh, 240px);
  overflow: auto;
  border: 1px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
}

.track-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-bottom: 1px solid #2a2a2a;
  background: transparent;
  padding: 8px 10px;
  text-align: left;
  color: #e8e8e8;
  cursor: pointer;
  min-height: 44px;
}

.track-btn img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.track-btn span {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-list li.active .track-btn {
  background: #2a3a1a;
}

.track-btn:active {
  opacity: 0.7;
}

.music-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  background: #252525;
  border-radius: 12px;
}

.setting-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-row label {
  font-size: 12px;
  color: #8e8e8e;
  font-weight: 600;
}

.setting-row select,
.setting-row input[type='range'] {
  width: 100%;
}

.setting-row select {
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1a1a1a;
  color: #f2eef7;
  font-size: 14px;
}

.widget-toggle-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #2d2d2d;
  color: #f2eef7;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
}

.widget-toggle-btn:active {
  opacity: 0.7;
}

@media (max-height: 600px) {
  .mobile-music-view {
    gap: 12px;
    padding: 12px;
  }
  .music-hero {
    padding: 16px 12px;
    gap: 10px;
  }
  .music-cover {
    width: 96px;
    height: 96px;
  }
  .control-btn {
    height: 48px;
  }
  .music-progress,
  .music-volume {
    padding: 10px;
  }
  .music-equalizer {
    height: 32px;
  }
  .music-playlist {
    padding: 12px;
  }
  .track-list {
    max-height: 180px;
  }
  .music-settings {
    gap: 10px;
    padding: 12px;
  }
  .widget-toggle-btn {
    padding: 12px;
  }
}

@media (max-height: 480px) {
  .mobile-music-view {
    gap: 8px;
    padding: 8px;
  }
  .music-hero {
    padding: 12px 8px;
    gap: 8px;
  }
  .music-cover {
    width: 72px;
    height: 72px;
  }
  .control-btn {
    height: 44px;
    font-size: 18px;
  }
  .play-btn {
    font-size: 22px;
  }
  .music-progress,
  .music-volume {
    padding: 8px;
  }
  .music-equalizer {
    height: 28px;
  }
  .music-playlist {
    padding: 10px;
    gap: 6px;
  }
  .track-list {
    max-height: 140px;
  }
  .music-settings {
    gap: 8px;
    padding: 10px;
  }
  .widget-toggle-btn {
    padding: 10px;
  }
}
</style>
