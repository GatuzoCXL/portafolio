<template>
  <Transition :name="transitionName">
    <div
      class="window"
      :class="{ maximized: isMaximized, 'is-active': isActive }"
      :style="{
        top: `${dragY}px`,
        left: `${dragX}px`,
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        zIndex: zIndex,
      }"
      @pointerdown.capture="bringToFront"
      ref="windowElement"
    >
      <div
        class="title-bar"
        :class="{ inactive: !isActive }"
        ref="titleBarHandle"
        @pointerdown.capture="bringToFront"
        @dblclick.stop="toggleMaximize"
      >
        <div class="title-bar-text">
          <img v-if="icon" :src="icon" :alt="title" class="title-icon" />
          {{ title }}
        </div>
        <div class="title-bar-controls">
          <button
            class="title-btn minimize-btn"
            @click.stop="minimizeWindow"
            aria-label="Minimizar ventana"
            title="Minimizar"
          ></button>
          <button
            class="title-btn maximize-btn"
            @click.stop="toggleMaximize"
            aria-label="Maximizar/Restaurar ventana"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
          ></button>
          <button
            class="title-btn close-btn"
            @click.stop="closeWindow"
            aria-label="Cerrar ventana"
            title="Cerrar"
          ></button>
        </div>
      </div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-e"
        @mousedown="startResize($event, 'e')"
      ></div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-s"
        @mousedown="startResize($event, 's')"
      ></div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-se"
        @mousedown="startResize($event, 'se')"
      >
        <span class="resize-grip" aria-hidden="true"></span>
      </div>

      <section class="window-body">
        <slot></slot>
      </section>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useDraggable } from '@vueuse/core'
import { useWindowsStore } from '@/stores/windows'

const props = defineProps({
  windowId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  x: {
    type: Number,
    default: 100,
  },
  y: {
    type: Number,
    default: 100,
  },
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 600,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
})

const windowStore = useWindowsStore()
const windowElement = ref(null)
const titleBarHandle = ref(null)
const isMaximized = ref(false)

const savedX = ref(props.x)
const savedY = ref(props.y)
const savedW = ref(props.width)
const savedH = ref(props.height)

const currentWidth = ref(props.width)
const currentHeight = ref(props.height)

const isActive = computed(() => {
  const visibleWindows = windowStore.openWindows.filter(windowItem => !windowItem.isMinimized)
  if (!visibleWindows.length) {
    return false
  }

  const topWindow = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex)[0]
  return topWindow?.id === props.windowId
})

const transitionName = computed(() => {
  const windowItem = windowStore.windows.find(w => w.id === props.windowId)
  if (!windowItem) {
    return 'window'
  }

  if (windowItem.isMinimizing) {
    return 'window-minimize'
  }
  if (windowItem.isRestoring) {
    return 'window-restore'
  }

  return 'window'
})

const { x: dragX, y: dragY, isDragging } = useDraggable(windowElement, {
  initialValue: { x: props.x, y: props.y },
  handle: titleBarHandle,
  preventDefault: true,
  disabled: () => isMaximized.value,
  onStart: () => {
    bringToFront()
  },
  onEnd: () => {
    if (isMaximized.value) return

    const SNAP_THRESHOLD = 22
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight - 30

    // Snap maximize near top edge.
    if (dragY.value <= SNAP_THRESHOLD) {
      isMaximized.value = true
      dragX.value = 0
      dragY.value = 0
      currentWidth.value = viewportW
      currentHeight.value = viewportH
      windowStore.updateWindowPosition(props.windowId, 0, 0)
      windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
      return
    }

    // Snap left / right half.
    if (dragX.value <= SNAP_THRESHOLD) {
      dragX.value = 0
      dragY.value = 0
      currentWidth.value = Math.floor(viewportW / 2)
      currentHeight.value = viewportH
      windowStore.updateWindowPosition(props.windowId, 0, 0)
      windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
      return
    }

    if (dragX.value + currentWidth.value >= viewportW - SNAP_THRESHOLD) {
      dragX.value = Math.floor(viewportW / 2)
      dragY.value = 0
      currentWidth.value = Math.floor(viewportW / 2)
      currentHeight.value = viewportH
      windowStore.updateWindowPosition(props.windowId, dragX.value, 0)
      windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
    }
  },
})

watch([dragX, dragY], ([nextX, nextY]) => {
  if (!isMaximized.value) {
    windowStore.updateWindowPosition(props.windowId, Math.round(nextX), Math.round(nextY))
  }
})

watch(
  () => [props.x, props.y],
  ([nextX, nextY]) => {
    if (!isDragging.value && !isMaximized.value) {
      dragX.value = nextX
      dragY.value = nextY
    }
  }
)

const bringToFront = () => {
  windowStore.bringToFront(props.windowId)
}

const minimizeWindow = () => {
  windowStore.minimizeWindow(props.windowId)
}

const toggleMaximize = () => {
    if (isMaximized.value) {
      isMaximized.value = false
    dragX.value = savedX.value
    dragY.value = savedY.value
    currentWidth.value = savedW.value
      currentHeight.value = savedH.value
      windowStore.updateWindowPosition(props.windowId, dragX.value, dragY.value)
      windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
    } else {
    savedX.value = dragX.value
    savedY.value = dragY.value
    savedW.value = currentWidth.value
    savedH.value = currentHeight.value

    isMaximized.value = true
    dragX.value = 0
    dragY.value = 0
      currentWidth.value = window.innerWidth
      currentHeight.value = window.innerHeight - 30
      windowStore.updateWindowPosition(props.windowId, 0, 0)
      windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
    }
}

const closeWindow = () => {
  windowStore.closeWindow(props.windowId)
}

const startResize = (event, direction) => {
  const startX = event.clientX
  const startY = event.clientY
  const startWidth = currentWidth.value
  const startHeight = currentHeight.value

  const handleMouseMove = (e) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    if (direction.includes('e')) {
      currentWidth.value = Math.max(300, startWidth + deltaX)
    }
    if (direction.includes('s')) {
      currentHeight.value = Math.max(150, startHeight + deltaY)
    }
  }

  const handleMouseUp = () => {
    windowStore.updateWindowSize(props.windowId, currentWidth.value, currentHeight.value)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.35));
  border: 1px solid #0b4ca0;
  border-radius: 6px 6px 0 0;
  background: #f3f7ff;
  transition:
    top 0.12s ease,
    left 0.12s ease,
    width 0.12s ease,
    height 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease;
}

.window.maximized {
  border-radius: 0;
}

.window.is-active {
  box-shadow: 0 0 0 1px rgba(88, 154, 245, 0.25);
}

.title-bar {
  display: flex;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  height: 28px;
  padding: 0 4px 0 8px;
  background: linear-gradient(90deg, #0a4ca0 0%, #2f7ad2 45%, #2a67be 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
}

.title-bar.inactive {
  background: linear-gradient(90deg, #7f94ad 0%, #9aacc3 45%, #8ea1b9 100%);
}

.title-bar-text {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.45);
}

.title-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  flex-shrink: 0;
}

.window-body {
  flex: 1;
  overflow: auto;
  min-height: 0;
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #c0c0c0;
}

.window-enter-active {
  animation: window-open 0.18s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

.window-leave-active {
  animation: window-close 0.15s ease-in forwards;
  pointer-events: none;
}

@keyframes window-open {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes window-close {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.75) translateY(30px);
  }
}

.window-minimize-leave-active {
  animation: window-minimize 0.18s ease-in forwards;
  pointer-events: none;
}

@keyframes window-minimize {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.1;
    transform: translateY(220px) scale(0.25);
  }
}

.window-restore-enter-active {
  animation: window-restore 0.18s ease-out forwards;
}

@keyframes window-restore {
  from {
    opacity: 0.1;
    transform: translateY(220px) scale(0.25);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title-bar-controls {
  display: flex;
  align-items: center;
  gap: 1px;
}

.title-bar-controls button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  max-width: 20px;
  height: 17px;
  min-height: 17px;
  max-height: 17px;
  padding: 0;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid #0d2f8f;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.75),
    inset -1px -1px 0 rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.35);
  color: #fff;
  user-select: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
}

.minimize-btn,
.maximize-btn {
  background: linear-gradient(180deg, #6ea6ff 0%, #2e6bdd 45%, #1d49b5 100%);
}

.close-btn {
  border-color: #8a241b;
  background: linear-gradient(180deg, #ffae9c 0%, #ef5d4b 45%, #cc2d1f 100%);
}

.title-bar-controls button:hover {
  filter: brightness(1.12);
}

.title-bar-controls button:active {
  transform: translateY(1px);
  box-shadow:
    inset -1px -1px 0 rgba(255, 255, 255, 0.35),
    inset 1px 1px 0 rgba(0, 0, 0, 0.35);
}

.minimize-btn::before {
  content: '';
  width: 8px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  margin-top: 4px;
}

.maximize-btn::before {
  content: '';
  width: 8px;
  height: 7px;
  border: 1px solid #fff;
  box-sizing: border-box;
  border-top-width: 2px;
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

.resize-handle {
  position: absolute;
  background: transparent;
  opacity: 0.35;
  transition: opacity 0.12s ease;
}

.window:hover .resize-handle {
  opacity: 0.75;
}

.resize-e {
  right: 0;
  top: 0;
  bottom: 0;
  width: 7px;
  cursor: ew-resize;
  background: linear-gradient(90deg, transparent 0%, rgba(56, 120, 210, 0.35) 100%);
}

.resize-s {
  bottom: 0;
  left: 0;
  right: 0;
  height: 7px;
  cursor: ns-resize;
  background: linear-gradient(180deg, transparent 0%, rgba(56, 120, 210, 0.35) 100%);
}

.resize-se {
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.resize-grip {
  width: 12px;
  height: 12px;
  margin: 0 2px 2px 0;
  background: repeating-linear-gradient(
    -45deg,
    rgba(36, 89, 170, 0.95) 0,
    rgba(36, 89, 170, 0.95) 1px,
    transparent 1px,
    transparent 3px
  );
  border-radius: 1px;
}
</style>
