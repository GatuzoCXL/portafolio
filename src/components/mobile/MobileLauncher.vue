<script setup>
import { ref } from 'vue'
import { useShellStore } from '@/stores/shell'
import { useMusicStore } from '@/stores/music'
import MobileMusicWidget from './MobileMusicWidget.vue'

const shellStore = useShellStore()
const musicStore = useMusicStore()

const activeTab = ref('apps')

let startX = 0
let currentX = 0
const SWIPE_THRESHOLD = 40

const onTouchStart = (e) => {
  startX = e.touches[0].clientX
  currentX = startX
}

const onTouchMove = (e) => {
  currentX = e.touches[0].clientX
}

const onTouchEnd = () => {
  const delta = currentX - startX
  if (activeTab.value === 'apps' && delta < -SWIPE_THRESHOLD) {
    activeTab.value = 'widgets'
  } else if (activeTab.value === 'widgets' && delta > SWIPE_THRESHOLD) {
    activeTab.value = 'apps'
  }
  startX = 0
  currentX = 0
}

const setTab = (tab) => {
  activeTab.value = tab
}

const base = import.meta.env.BASE_URL

const apps = [
  { id: 'my-pc', label: 'Sobre mí', icon: `${base}icons/mobile/about.svg`, color: '#6bb7ff' },
  { id: 'documents', label: 'Documentos', icon: `${base}icons/mobile/documents.svg`, color: '#8ecf32' },
  { id: 'internet-explorer', label: 'Foro', icon: `${base}icons/mobile/forum.svg`, color: '#43d7ff' },
  { id: 'messenger', label: 'Contacto', icon: `${base}icons/mobile/contact.svg`, color: '#ffb84d' },
  { id: 'games-folder', label: 'Juegos', icon: `${base}icons/mobile/games.svg`, color: '#b978ff' },
  { id: 'music-player', label: 'Música', icon: `${base}icons/mobile/music.svg`, color: '#ff6aa9' },
  { id: 'wallpaper', label: 'Fondo', icon: `${base}icons/mobile/wallpaper.svg`, color: '#84e060' },
  { id: 'recycle-bin', label: 'Papelera', icon: `${base}icons/mobile/recycle-bin.svg`, color: '#d3dde7' },
]

const openApp = (appId) => {
  shellStore.openApp(appId)
}

const showWidget = () => {
  musicStore.widgetVisible = true
}
</script>

<template>
  <div class="mobile-launcher"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd">

    <header class="launcher-tabs">
      <button
        class="launcher-tab"
        :class="{ 'launcher-tab--active': activeTab === 'apps' }"
        type="button"
        @click="setTab('apps')"
      >Apps</button>
      <button
        class="launcher-tab"
        :class="{ 'launcher-tab--active': activeTab === 'widgets' }"
        type="button"
        @click="setTab('widgets')"
      >Widgets</button>
    </header>

    <div v-if="activeTab === 'apps'" class="launcher-content">
      <div class="launcher-grid">
        <button
          v-for="app in apps"
          :key="app.id"
          class="launcher-icon"
          :aria-label="app.label"
          @click="openApp(app.id)"
        >
          <span class="launcher-app-icon" :style="{ '--app-color': app.color }">
            <img :src="app.icon" alt="" class="launcher-app-icon__img" />
          </span>
          <span class="launcher-label">{{ app.label }}</span>
        </button>
      </div>
    </div>

    <div v-else-if="activeTab === 'widgets'" class="launcher-content">
      <div class="widgets-area">
        <MobileMusicWidget v-if="musicStore.widgetVisible" />
        <div v-else class="widgets-placeholder">
          <div class="widgets-inner">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="6" stroke="#3a3545" stroke-width="2" fill="none" />
              <rect x="12" y="14" width="10" height="10" rx="2" fill="#3a3545" />
              <rect x="26" y="14" width="10" height="10" rx="2" fill="#3a3545" />
              <rect x="12" y="28" width="24" height="6" rx="2" fill="#3a3545" />
            </svg>
            <p>El widget de música está oculto</p>
            <button class="widget-action-btn" @click="showWidget">Mostrar widget</button>
            <button class="widget-action-btn secondary" @click="openApp('music-player')">Abrir Música</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-launcher {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.45) 100%);
  padding: 0 10px 18px;
  color: #f6f2fb;
  overflow: hidden;
}

.launcher-tabs {
  display: flex;
  align-items: flex-end;
  align-self: stretch;
  width: 100%;
  height: 48px;
  background: rgba(0,0,0,0.22);
  border-bottom: 2px solid #13aeea;
  padding: 0;
  margin: 0 0 28px;
}

.launcher-tab {
  position: relative;
  min-width: 86px;
  height: 46px;
  border: 0;
  border-right: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  color: #c4bccf;
  font-size: 15px;
  text-align: left;
  padding: 0 12px;
  cursor: pointer;
  text-shadow: 0 1px 3px rgba(0,0,0,0.7);
  border-radius: 0;
}

.launcher-tab--active {
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  background: rgba(0,0,0,0.22);
}

.launcher-tab--active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: #13aeea;
}

.launcher-content {
  flex: 1;
  overflow: hidden;
}

.launcher-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px 8px;
  padding: 0 4px;
  max-width: 420px;
  width: 100%;
  align-self: center;
}

.launcher-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 2px;
  border-radius: 12px;
  min-height: 86px;
  min-width: 44px;
}

.launcher-icon:focus-visible {
  outline: 2px solid #13aeea;
  outline-offset: 2px;
}

.launcher-app-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.24), transparent 42%),
    var(--app-color);
  box-shadow:
    inset 0 0 0 2px rgba(0, 0, 0, 0.32),
    0 8px 18px rgba(0, 0, 0, 0.36);
}

.launcher-app-icon__img {
  width: 26px;
  height: 26px;
  filter: drop-shadow(0 1px rgba(255, 255, 255, 0.35));
}

.launcher-icon:active {
  transform: scale(0.95);
}

.launcher-label {
  font-size: 11px;
  color: #ffffff;
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.01em;
  max-width: 78px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 4px rgba(0,0,0,0.85);
  background: rgba(0,0,0,0.22);
  padding: 2px 5px;
  border-radius: 8px;
}

.widgets-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 16px;
}

.widgets-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.widgets-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}

.widgets-inner p {
  font-size: 15px;
  color: #c4bccf;
  margin: 0;
}

.widget-action-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #2d2d2d;
  color: #f2eef7;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
}

.widget-action-btn.secondary {
  background: transparent;
  border: 1px solid #2c2334;
  color: #8f8796;
}

.widget-action-btn:active {
  opacity: 0.7;
}

@media (max-width: 360px) {
  .launcher-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
