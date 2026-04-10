<template>
  <div class="taskbar">
    <button
      class="start-button"
      :class="{ active: windowsStore.isStartMenuOpen }"
      @click="onStartClick"
      aria-label="Botón de Inicio"
    >
      <img src="/icons/start.svg" alt="Start" class="start-icon" />
      Start
    </button>

    <div class="taskbar-divider"></div>

    <div class="taskbar-buttons">
      <button
        v-for="window in windowsStore.openWindows"
        :key="window.id"
        class="taskbar-button"
        :class="{
          minimized: window.isMinimized,
          active: activeWindowId === window.id && !window.isMinimized,
        }"
        @click="onTaskbarButtonClick(window.id)"
      >
        <img :src="window.icon" :alt="window.title" class="taskbar-icon" />
        {{ window.title }}
      </button>
    </div>

    <div class="system-clock">
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()
const currentTime = ref('')

const activeWindowId = computed(() => {
  const visibleWindows = windowsStore.openWindows.filter(windowItem => !windowItem.isMinimized)
  if (!visibleWindows.length) {
    return null
  }

  return [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex)[0].id
})

const updateClock = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

const toggleWindowFromTaskbar = (windowId) => {
  const window = windowsStore.windows.find(w => w.id === windowId)
  if (window) {
    if (window.isMinimized) {
      windowsStore.restoreMinimizedWindow(windowId)
    } else if (activeWindowId.value === windowId) {
      windowsStore.minimizeWindow(windowId)
    } else {
      windowsStore.bringToFront(windowId)
    }
  }
}

const onStartClick = () => {
  windowsStore.toggleStartMenu()
}

const onTaskbarButtonClick = (windowId) => {
  toggleWindowFromTaskbar(windowId)
}

onMounted(() => {
  updateClock()
  const interval = setInterval(updateClock, 60000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(180deg, #1d57a8 0%, #2c74cf 45%, #215db7 100%);
  border-top: 1px solid #6aa2ea;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  z-index: 9999;
  box-sizing: border-box;
}

.start-button {
  background: linear-gradient(180deg, #6ac247 0%, #3a9f32 100%);
  border: 2px solid;
  border-color: #8ee26a #1d5f1a #1d5f1a #8ee26a;
  border-radius: 0 12px 12px 0;
  padding: 2px 10px 2px 8px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  height: 24px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.start-button:hover {
  filter: brightness(1.06);
}

.start-button:active {
  border-color: #1d5f1a #8ee26a #8ee26a #1d5f1a;
}

.start-button.active {
  border-color: #1d5f1a #8ee26a #8ee26a #1d5f1a;
  filter: brightness(0.95);
}

.start-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.taskbar-divider {
  width: 2px;
  height: 22px;
  background: linear-gradient(90deg, #3a7fd4 0%, #0f4593 50%, #78aef1 100%);
  margin: 0 2px;
}

.taskbar-buttons {
  display: flex;
  gap: 2px;
  flex: 1;
  align-items: center;
  overflow-x: auto;
  padding: 0 4px;
}

.taskbar-button {
  background: linear-gradient(180deg, #4e8dd7 0%, #3b7bc9 100%);
  border: 2px solid;
  border-color: #88b8ef #1f4f95 #1f4f95 #88b8ef;
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.35);
  padding: 2px 6px;
  cursor: pointer;
  white-space: nowrap;
  height: 22px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.taskbar-button:hover {
  filter: brightness(1.08);
}

.taskbar-button:active {
  border-color: #1f4f95 #88b8ef #88b8ef #1f4f95;
}

.taskbar-button.active {
  background: linear-gradient(180deg, #2e6ab9 0%, #22579f 100%);
  border-color: #1f4f95 #88b8ef #88b8ef #1f4f95;
}

.taskbar-button.minimized {
  opacity: 0.78;
}

.system-clock {
  background: linear-gradient(180deg, #4b8dd8 0%, #3c78c4 100%);
  border: 2px solid;
  border-color: #1f4f95 #88b8ef #88b8ef #1f4f95;
  padding: 2px 6px;
  margin-left: auto;
  color: #fff;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  white-space: nowrap;
  height: 22px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.system-clock {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}
</style>
