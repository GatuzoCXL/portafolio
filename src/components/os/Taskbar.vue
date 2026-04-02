<template>
  <div class="taskbar">
    <button
      class="start-button"
      @click="windowsStore.toggleStartMenu"
      aria-label="Botón de Inicio"
    >
      <span class="start-icon">🪟</span>
      Start
    </button>

    <div class="taskbar-divider"></div>

    <div class="taskbar-buttons">
      <button
        v-for="window in windowsStore.openWindows"
        :key="window.id"
        class="taskbar-button"
        :class="{ minimized: window.isMinimized }"
        @click="toggleWindowFromTaskbar(window.id)"
      >
        {{ window.icon }} {{ window.title }}
      </button>
    </div>

    <div class="system-clock">
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()
const currentTime = ref('')

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
      window.isMinimized = false
      windowsStore.bringToFront(windowId)
    } else {
      window.isMinimized = true
    }
  }
}

onMounted(() => {
  updateClock()
  const interval = setInterval(updateClock, 60000) // Actualizar cada minuto
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: linear-gradient(180deg, #dfdfdf 0%, #c0c0c0 100%);
  border-top: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
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
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 2px 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  height: 22px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.start-button:hover {
  background: #dfdfdf;
}

.start-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.start-icon {
  font-size: 14px;
}

.taskbar-divider {
  width: 2px;
  height: 22px;
  background: linear-gradient(90deg, #dfdfdf 0%, #808080 50%, #ffffff 100%);
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
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
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

.taskbar-button:hover {
  background: #dfdfdf;
}

.taskbar-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.taskbar-button.minimized {
  font-style: italic;
  opacity: 0.7;
}

.system-clock {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 2px 6px;
  margin-left: auto;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  white-space: nowrap;
  height: 22px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.system-clock {
  box-shadow: 1px 1px 0 #ffffff inset, -1px -1px 0 #808080 inset;
}
</style>
