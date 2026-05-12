<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useShellStore } from '@/stores/shell'
import MobileStatusBar from './MobileStatusBar.vue'
import MobileIntroScreen from './MobileIntroScreen.vue'
import MobileLauncher from './MobileLauncher.vue'
import MobileAppView from './MobileAppView.vue'

const shellStore = useShellStore()
const isStarting = ref(true)
let introTimer = null

const isInLauncher = computed(() => shellStore.activeMobileApp === null)

const mainStyle = computed(() => {
  const url = shellStore.activeMobileWallpaper
  if (!url) return {}
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})

const onHomeTap = () => {
  shellStore.activeMobileApp = null
}

const onBackTap = () => {
  shellStore.activeMobileApp = null
}

const finishIntro = () => {
  isStarting.value = false
  if (introTimer) {
    clearTimeout(introTimer)
    introTimer = null
  }
}

onMounted(() => {
  introTimer = window.setTimeout(finishIntro, 1400)
})

onBeforeUnmount(() => {
  if (introTimer) {
    clearTimeout(introTimer)
    introTimer = null
  }
})
</script>

<template>
  <div class="mobile-shell">
    <MobileStatusBar />

    <main class="mobile-shell-main" :style="mainStyle">
      <MobileIntroScreen v-if="isStarting" @done="finishIntro" />
      <MobileLauncher v-else-if="isInLauncher" />
      <MobileAppView v-else />
    </main>

    <nav class="mobile-shell-nav">
      <button class="mobile-nav-btn" aria-label="Atrás" @click="onBackTap">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M14 5C10 8.5 8 10.5 8 12C8 13.5 10 15.5 14 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <button class="mobile-nav-btn" aria-label="Inicio" @click="onHomeTap">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M5 11L12 5L19 11V19H5V11Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
      </button>

      <button class="mobile-nav-btn" aria-label="Recientes" aria-disabled="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="5" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8" />
          <rect x="5" y="9" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.mobile-shell {
  --mobile-bg: #000000;
  --mobile-accent: #8ecf32;
  --mobile-icon-color: #f2eef7;
  --mobile-statusbar-bg: #000000;
  --mobile-nav-bg: #000000;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100%;
  background: var(--mobile-bg);
  overflow: hidden;
}

.mobile-shell-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000000;
}

.mobile-shell-nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 56px;
  background: var(--mobile-nav-bg);
  border-top: 1px solid #222222;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.mobile-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 16px;
  border-radius: 8px;
  min-height: 44px;
  min-width: 44px;
  color: var(--mobile-icon-color);
}

.mobile-nav-btn:active {
  opacity: 0.6;
}

.mobile-nav-btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: default;
}

</style>
