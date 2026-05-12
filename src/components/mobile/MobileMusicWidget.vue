<script setup>
import { onMounted } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useShellStore } from '@/stores/shell'
import { useMusicPlayer } from '@/composables/useMusicPlayer'
import { assetUrl } from '@/utils/assetUrl'

const musicStore = useMusicStore()
const shellStore = useShellStore()
const player = useMusicPlayer()
const musicIcon = assetUrl('icons/media-audio.svg')

onMounted(() => {
  player.init()
})

const openMusicApp = () => {
  shellStore.openApp('music-player')
}
</script>

<template>
  <div class="mobile-music-widget" @click="openMusicApp">
    <div class="widget-header">
      <img :src="player.currentTrack.value?.thumbnail || musicIcon" alt="cover" class="widget-cover" />
      <div class="widget-info">
        <p class="widget-title">{{ player.currentTrack.value?.title || 'Sin selección' }}</p>
        <p class="widget-channel">{{ player.currentTrack.value?.channelTitle || 'Sin reproducción' }}</p>
      </div>
      <button class="widget-close" @click.stop="musicStore.widgetVisible = false" aria-label="Cerrar">✕</button>
    </div>

    <div class="widget-progress">
      <span>{{ player.formatTime(player.currentTime.value) }}</span>
      <input
        type="range"
        min="0"
        :max="Math.max(player.duration.value, 1)"
        :value="player.currentTime.value"
        @input="player.seekTo($event)"
        @click.stop
      />
      <span>{{ player.formatTime(player.duration.value) }}</span>
    </div>

    <div class="widget-controls" @click.stop>
      <button @click="player.prevTrack" :disabled="!player.tracks.value.length" aria-label="Anterior">⏮</button>
      <button @click="player.togglePlay" :disabled="!player.currentTrack.value" aria-label="Play/Pause">
        {{ player.isPlaying.value ? '⏸' : '▶' }}
      </button>
      <button @click="player.nextTrack" :disabled="!player.tracks.value.length" aria-label="Siguiente">⏭</button>
    </div>
  </div>
</template>

<style scoped>
.mobile-music-widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  background: #15101c;
  border: 1px solid #2c2334;
  border-radius: 14px;
  color: #f2eef7;
  cursor: pointer;
  max-width: 360px;
  width: 100%;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-cover {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.widget-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.widget-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-channel {
  margin: 0;
  font-size: 12px;
  color: #8e8e8e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: #8e8e8e;
}

.widget-progress input[type='range'] {
  width: 100%;
}

.widget-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.widget-controls button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  background: #2d2d2d;
  color: #f2eef7;
  font-size: 16px;
  cursor: pointer;
}

.widget-controls button:active {
  opacity: 0.7;
}

.widget-controls button:disabled {
  opacity: 0.3;
  cursor: default;
}

.widget-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #8e8e8e;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.widget-close:active {
  color: #f2eef7;
}
</style>
