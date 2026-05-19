<template>
  <div class="wallpaper-app xp-window-frame">
    <div class="xp-explorer-chrome">
      <div class="xp-menu-row">
        <span class="xp-menu-item">File</span>
        <span class="xp-menu-item">Edit</span>
        <span class="xp-menu-item">View</span>
        <span class="xp-menu-item">Help</span>
      </div>
      <div class="xp-toolbar-row">
        <button class="xp-tool-btn search" @click="previewDefault">Default</button>
        <button class="xp-tool-btn folders" @click="shuffleWallpaper">Random</button>
      </div>
    </div>

    <div class="wallpaper-layout">
      <aside class="wallpaper-sidebar">
        <div class="wallpaper-title">Wallpaper</div>
        <p>
          Cambia el fondo del escritorio.
        </p>
        <div class="wallpaper-hero">
          <img :src="previewWallpaper.url" :alt="previewWallpaper.title" class="wallpaper-hero__image" />
          <div class="wallpaper-hero__overlay">
            <span class="wallpaper-hero__label">Vista previa</span>
            <strong>{{ previewWallpaper.title }}</strong>
            <p>{{ previewWallpaper.description }}</p>
          </div>
        </div>
        <div class="wallpaper-note">
          Fondo actual:
          <strong>{{ currentWallpaper.title }}</strong>
        </div>
        <div class="wallpaper-actions">
          <button class="wallpaper-action" @click="applyPreview">Usar este fondo</button>
          <button class="wallpaper-action" @click="shuffleWallpaper">Aleatorio</button>
        </div>
      </aside>

      <main class="wallpaper-gallery">
        <button
          v-for="option in wallpaperOptions"
          :key="option.id"
          class="wallpaper-card"
          :class="{ active: option.id === previewWallpaper.id }"
          @click="setPreviewWallpaper(option.id)"
          @dblclick="applyWallpaper(option.id)"
        >
          <img :src="option.url" :alt="option.title" class="wallpaper-preview" />
          <div class="wallpaper-card__body">
            <strong>{{ option.title }}</strong>
            <p>{{ option.description }}</p>
          </div>
        </button>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()
const wallpaperOptions = computed(() => windowsStore.wallpaperOptions)
const currentWallpaper = computed(() => windowsStore.currentWallpaper)
const previewWallpaperId = ref(currentWallpaper.value.id)

watch(
  () => currentWallpaper.value.id,
  (nextId) => {
    previewWallpaperId.value = nextId
  },
  { immediate: true }
)

const previewWallpaper = computed(() => {
  return wallpaperOptions.value.find(option => option.id === previewWallpaperId.value) || currentWallpaper.value
})

const setPreviewWallpaper = (wallpaperId) => {
  previewWallpaperId.value = wallpaperId
}

const applyWallpaper = (wallpaperId = previewWallpaperId.value) => {
  windowsStore.setWallpaper(wallpaperId)
}

const applyPreview = () => {
  windowsStore.setWallpaper(previewWallpaperId.value)
}

const previewDefault = () => {
  previewWallpaperId.value = 'bliss'
}

const shuffleWallpaper = () => {
  const options = wallpaperOptions.value
  if (!options.length) return

  const next = options[Math.floor(Math.random() * options.length)]
  if (next) {
    previewWallpaperId.value = next.id
  }
}
</script>

<style scoped>
.wallpaper-app {
  height: 100%;
  background: linear-gradient(180deg, #f6f9fe 0%, #e2ecf8 100%);
}

.wallpaper-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 8px;
  height: calc(100% - 57px);
  padding: 2px;
}

.wallpaper-sidebar {
  padding: 10px;
  border: 1px solid #9bb6d8;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
  background: linear-gradient(180deg, #ffffff 0%, #eef4fb 100%);
}

.wallpaper-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #173d73;
  border-bottom: 1px solid #8ca7c5;
  padding-bottom: 4px;
}

.wallpaper-sidebar p,
.wallpaper-note {
  margin: 0 0 8px;
  font-size: 10.5px;
  line-height: 1.5;
  color: #264563;
}

.wallpaper-hero {
  position: relative;
  overflow: hidden;
  margin: 0 0 10px;
  border: 1px solid #9bb6d8;
  background: #fff;
  min-height: 180px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.wallpaper-hero__image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.wallpaper-hero__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 30, 62, 0.82) 32%, rgba(10, 22, 44, 0.94) 100%);
  color: #fff;
}

.wallpaper-hero__label {
  display: inline-block;
  margin-bottom: 4px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wallpaper-hero__overlay strong {
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
}

.wallpaper-hero__overlay p {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.88);
}

.wallpaper-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.wallpaper-action {
  flex: 1;
  border: 1px solid #8ea8c9;
  background: linear-gradient(180deg, #ffffff 0%, #e4eef8 100%);
  color: #123864;
  padding: 5px 8px;
  font-size: 10px;
  cursor: pointer;
}

.wallpaper-action:hover {
  background: linear-gradient(180deg, #ffffff 0%, #edf4fb 100%);
  border-color: #7f9db9;
}

.wallpaper-action:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}

.wallpaper-gallery {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  align-content: start;
}

.wallpaper-card {
  border: 1px solid #9bb6d8;
  background: linear-gradient(180deg, #ffffff 0%, #eef4fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.68);
  padding: 8px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wallpaper-card.active {
  border-color: #7f9db9;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 1px rgba(42, 104, 191, 0.18);
}

.wallpaper-preview {
  width: 100%;
  height: 116px;
  object-fit: cover;
  border: 1px solid #94afd1;
}

.wallpaper-card__body strong {
  display: block;
  color: #123864;
  margin-bottom: 3px;
}

.wallpaper-card__body p {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: #365572;
}
</style>
