<template>
  <Transition :name="transitionName">
    <div
      class="window"
      :class="{ maximized: isMaximized, 'is-active': isActive, 'is-dragging': isDragging }"
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

    // Snap maximizar cerca del borde superior.
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

    // Snap mitad izquierda/derecha.
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
      return
    }

    windowStore.updateWindowPosition(props.windowId, Math.round(dragX.value), Math.round(dragY.value))
  },
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
  event.preventDefault()

  const startX = event.clientX
  const startY = event.clientY
  const startWidth = currentWidth.value
  const startHeight = currentHeight.value

  // Prevenir seleccion de texto durante resize
  document.body.style.userSelect = 'none'

  const handleMouseMove = (e) => {
    e.preventDefault()
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
    document.body.style.userSelect = ''
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
  border: 2px solid;
  border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
  box-shadow: var(--win-shadow);
  border-radius: 6px 6px 0 0;
  background: var(--win-body-bg);
  user-select: none;
  -webkit-user-select: none;
  transition:
    top 0.12s ease,
    left 0.12s ease,
    width 0.12s ease,
    height 0.12s ease,
    box-shadow 0.15s ease-out,
    border-color 0.15s ease-out;
}

.window.is-dragging {
  transition: none;
  cursor: move;
  will-change: top, left;
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
  background: var(--win-title-bg);
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.25) rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15);
  touch-action: none;
}

.title-bar.inactive {
  background: linear-gradient(90deg, #7f94ad 0%, #9aacc3 45%, #8ea1b9 100%);
}

.title-bar.inactive .title-bar-text {
  opacity: 0.7;
}

.title-bar.inactive .minimize-btn,
.title-bar.inactive .maximize-btn {
  filter: grayscale(0.6);
}

.title-bar.inactive .close-btn {
  filter: grayscale(0.4);
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
  font-size: var(--font-lg);
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
  background: var(--win-body-bg);
  padding: var(--spacing-md);
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
  width: 22px;
  min-width: 22px;
  max-width: 22px;
  height: 20px;
  min-height: 20px;
  max-height: 20px;
  padding: 0;
  border-radius: 2px;
  box-sizing: border-box;
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.8),
    inset -1px -1px 0 rgba(0, 0, 0, 0.25);
  color: #fff;
  user-select: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  transition: transform var(--transition-fast), filter var(--transition-fast);
  cursor: pointer;
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
  transform: scale(1.08);
  filter: brightness(1.15);
}

.title-bar-controls button:active {
  transform: scale(0.92);
  box-shadow:
    inset -2px -2px 0 rgba(255, 255, 255, 0.25),
    inset 2px 2px 0 rgba(0, 0, 0, 0.4);
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
  width: 11px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  top: 50%;
  left: 50%;
  margin-top: -1px;
  margin-left: -5.5px;
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

.window-minimize-enter-active {
  transition: all 0.3s ease-in;
}

.window-minimize-leave-active {
  transition: all 0.3s ease-in;
}

.window-minimize-enter-from {
  opacity: 1;
  transform: scale(1);
}

.window-minimize-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(200px);
}

.window-restore-enter-active {
  transition: all 0.3s ease-out;
}

.window-restore-leave-active {
  transition: all 0.3s ease-out;
}

.window-restore-enter-from {
  opacity: 0;
  transform: scale(0.3) translateY(200px);
}

.window-restore-leave-to {
  opacity: 1;
  transform: scale(1);
}
</style>
