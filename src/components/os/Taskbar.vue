<template>
  <footer class="taskbar">
    <div class="taskbar-items left">
      <div class="start-menu-container">
        <StartMenu />
      </div>
      <button
        class="start-button"
        @click="onStartClick"
        aria-label="Botón de Inicio"
      >
        <img :src="startLogo" alt="" class="start-button-logo" />
        <span class="start-button-label">start</span>
      </button>

      <button
        v-for="window in windowsStore.openWindows"
        :key="window.id"
        class="taskbar-button"
        :class="{
          active: activeWindowId === window.id && !window.isMinimized,
        }"
        @click="onTaskbarButtonClick(window.id)"
      >
        <img :src="window.icon" :alt="window.title" class="taskbar-icon" />
        <span class="taskbar-button-label">{{ window.title }}</span>
      </button>
    </div>

    <div class="taskbar-items right">
      <img :src="traySpeaker" alt="Volumen" title="Volumen" class="tray-icon" />
      <img :src="trayNetwork" alt="Mi PC" title="Mi PC" class="tray-icon" />
      <div style="position: relative; width: 0; height: 0">
        <NotificationBalloon v-if="!windowsStore.balloonDismissed" />
      </div>
      <div class="system-clock">
        {{ currentTime }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { xpIcon } from '@/utils/xpIcons'
import StartMenu from '@/components/os/StartMenu.vue'
import NotificationBalloon from '@/components/os/NotificationBalloon.vue'

const windowsStore = useWindowsStore()
const currentTime = ref('')
const startLogo = xpIcon('start-logo')
const traySpeaker = xpIcon('tray-speaker')
const trayNetwork = xpIcon('tray-network')

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
  background: linear-gradient(
    to bottom,
    #245edb 0%,
    #2b6add 4%,
    #2f6fe0 8%,
    #3277e5 16%,
    #2f71e1 24%,
    #2967dc 42%,
    #255fd7 62%,
    #2157ce 82%,
    #1c4fbe 100%
  );
  display: flex;
  align-items: center;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  z-index: 9999;
  box-sizing: border-box;
  border-top: 1px solid #78b4ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.taskbar-items {
  display: flex;
  align-items: center;
  height: 100%;
}

.taskbar-items.left {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 0;
  padding: 0;
  min-width: 0;
}

.taskbar-items.right {
  background: linear-gradient(
    to bottom,
    #11a1ee 0%,
    #1099ea 12%,
    #0f90e2 34%,
    #0d84d6 68%,
    #0b72c8 100%
  );
  border-left: 1px solid #0d4fb7;
  border-top-left-radius: 9px;
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    -1px 0 0 rgba(14, 70, 163, 0.45);
  padding: 0 12px 0 9px;
  margin-left: 6px;
  flex-shrink: 0;
  gap: 6px;
}

.start-menu-container {
  position: relative;
}

.start-button {
  height: 100%;
  cursor: pointer;
  background:
    radial-gradient(circle at 24% 24%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 34%, rgba(0, 0, 0, 0.03) 100%),
    linear-gradient(180deg, #4fb54a 0%, #3d9b38 48%, #2e7b28 100%);
  appearance: none;
  border: 1px solid #2b6c23;
  border-top-color: #79cb6d;
  border-bottom-color: #194715;
  border-radius: 0 10px 10px 0;
  padding: 0 17px 0 9px;
  margin: 0;
  margin-right: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  outline: none;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.24),
    inset -1px -1px 0 rgba(24, 85, 20, 0.22);
  transition: all var(--transition-fast);
  overflow: hidden;
}

.start-button:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(0, 0, 0, 0.03) 100%),
    linear-gradient(180deg, #51b849 0%, #42a43a 52%, #33882b 100%);
  border-color: #2f7427;
  border-top-color: #68c159;
  border-bottom-color: #235d1d;
}

.start-button:active {
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.02) 40%, rgba(255, 255, 255, 0.03) 100%),
    linear-gradient(180deg, #3e9837 0%, #32842c 100%);
  border-color: #2c6d24;
  border-top-color: #4ca042;
  border-bottom-color: #1f4f19;
}

.start-button::after {
  content: '';
  position: absolute;
  top: 0;
  right: -7px;
  width: 16px;
  height: 100%;
  background: linear-gradient(180deg, #48ad41 0%, #3c9a35 52%, #2f7f27 100%);
  border-right: 1px solid #2b6c23;
  transform: skewX(22deg);
  transform-origin: top right;
}

.start-button:hover::after {
  background: linear-gradient(180deg, #51b849 0%, #42a43a 52%, #33882b 100%);
  border-right-color: #2f7427;
}

.start-button:active::after {
  background: linear-gradient(180deg, #3e9837 0%, #32842c 100%);
  border-right-color: #2c6d24;
}

.start-button-logo,
.start-button-label {
  position: relative;
  z-index: 1;
}

.start-button-logo {
  display: block;
  width: 17px;
  height: 17px;
  pointer-events: none;
  user-select: none;
  object-fit: contain;
}

.start-button-label {
  color: #fff;
  font-size: 18px;
  line-height: 1;
  font-style: italic;
  font-weight: 700;
  letter-spacing: -1px;
  text-transform: lowercase;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.28);
  pointer-events: none;
  user-select: none;
  font-family: 'Trebuchet MS', 'Tahoma', sans-serif;
}

.taskbar-button {
  flex: 1;
  max-width: 158px;
  color: #fff;
  border-radius: 3px 3px 0 0;
  margin: 4px 2px 2px 0;
  padding: 0 8px;
  height: 21px;
  font-size: 11px;
  background: linear-gradient(180deg, #4c95f6 0%, #397ce4 46%, #2a63cd 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #2a5fbf;
  border-top-color: #8ec0ff;
  border-left-color: #79aff4;
  border-right-color: #214fa9;
  border-bottom-color: #1f49a0;
  cursor: pointer;
  white-space: nowrap;
  min-width: 52px;
  overflow: hidden;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  transition: filter var(--transition-fast), background var(--transition-fast);
}

.taskbar-button:hover {
  background: linear-gradient(180deg, #58a2ff 0%, #3f82ea 54%, #2d67d1 100%);
}

.taskbar-button:active {
  background: linear-gradient(180deg, #2c67ca 0%, #2559b8 56%, #204ca4 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.28);
}

.taskbar-button:focus,
.taskbar-button:focus-visible,
.start-button:focus,
.start-button:focus-visible {
  outline: none;
}

.taskbar-button.active {
  background: linear-gradient(180deg, #2756b0 0%, #21489f 44%, #173884 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  border-top-color: #6ea7f1;
  border-left-color: #4f7fcc;
  border-right-color: #163777;
  border-bottom-color: #14336f;
}

.taskbar-button.active:hover {
  background: linear-gradient(180deg, #2e61bf 0%, #2551ab 48%, #1b4293 100%);
}

.taskbar-button.active:hover:active {
  background: linear-gradient(180deg, #2756b0 0%, #21489f 44%, #173884 100%);
}


.taskbar-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
  pointer-events: none;
}

.taskbar-button-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  flex: 1;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
}

.tray-icon {
  height: 16px;
  width: 16px;
  cursor: default;
  opacity: 0.95;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.15));
}

.system-clock {
  margin: 0 2px 0 5px;
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  min-width: 34px;
  text-align: center;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
}
</style>
