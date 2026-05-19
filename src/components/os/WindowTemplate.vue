<template>
  <Transition :name="transitionName">
    <div
      class="window"
      :class="{ maximized: isMaximized, 'is-active': isActive, 'is-dragging': isDragging, 'is-resizing': isResizing }"
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
            :class="{ 'is-restore': isMaximized }"
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
        class="resize-handle resize-n"
        @mousedown="startResize($event, 'n')"
      ></div>
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
        class="resize-handle resize-w"
        @mousedown="startResize($event, 'w')"
      ></div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-ne"
        @mousedown="startResize($event, 'ne')"
      ></div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-nw"
        @mousedown="startResize($event, 'nw')"
      ></div>
      <div
        v-if="!isMaximized"
        class="resize-handle resize-sw"
        @mousedown="startResize($event, 'sw')"
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
const isResizing = ref(false)

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
  const startLeft = dragX.value
  const startTop = dragY.value
  const MIN_WIDTH = 300
  const MIN_HEIGHT = 150

  // Prevenir seleccion de texto durante resize
  document.body.style.userSelect = 'none'
  isResizing.value = true

  const handleMouseMove = (e) => {
    e.preventDefault()
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    let nextWidth = startWidth
    let nextHeight = startHeight
    let nextLeft = startLeft
    let nextTop = startTop

    if (direction.includes('e')) {
      nextWidth = Math.max(MIN_WIDTH, startWidth + deltaX)
    }

    if (direction.includes('s')) {
      nextHeight = Math.max(MIN_HEIGHT, startHeight + deltaY)
    }

    if (direction.includes('w')) {
      const proposedWidth = startWidth - deltaX
      nextWidth = Math.max(MIN_WIDTH, proposedWidth)
      nextLeft = startLeft + (startWidth - nextWidth)
    }

    if (direction.includes('n')) {
      const proposedHeight = startHeight - deltaY
      nextHeight = Math.max(MIN_HEIGHT, proposedHeight)
      nextTop = startTop + (startHeight - nextHeight)
    }

    currentWidth.value = nextWidth
    currentHeight.value = nextHeight
    dragX.value = nextLeft
    dragY.value = nextTop
  }

  const handleMouseUp = () => {
    document.body.style.userSelect = ''
    isResizing.value = false
    windowStore.updateWindowPosition(props.windowId, Math.round(dragX.value), Math.round(dragY.value))
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
  padding: 0;
  border-radius: 8px 8px 0 0;
  background: #0831d9;
  box-shadow: var(--win-shadow);
  user-select: none;
  -webkit-user-select: none;
  transition:
    top 0.12s ease,
    left 0.12s ease,
    width 0.12s ease,
    height 0.12s ease,
    box-shadow 0.15s ease-out,
    background 0.15s ease-out;
}

.window::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.window.is-dragging,
.window.is-resizing {
  transition: none;
}

.window.is-dragging {
  cursor: move;
  will-change: top, left;
}

.window.is-resizing {
  will-change: top, left, width, height;
}

.window.maximized {
  border-radius: 0;
}

.window.maximized::before {
  border-radius: 0;
}

.window:not(.is-active) {
  background: #6582f5;
}

.window.is-active {
  box-shadow: 0 2px 10px rgba(0, 24, 115, 0.45);
}

.title-bar {
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  height: 31px;
  margin: 2px 2px 0;
  padding: 0 4px 0 6px;
  background: var(--win-title-bg);
  border-radius: 5px 5px 0 0;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.42),
    inset 1px 0 0 rgba(255, 255, 255, 0.15),
    inset -1px 0 0 rgba(0, 43, 153, 0.5);
  touch-action: none;
}

.title-bar::before,
.title-bar::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15px;
  pointer-events: none;
}

.title-bar::before {
  left: 0;
  background: linear-gradient(to right, rgba(22, 56, 230, 0.95) 0%, transparent 100%);
  opacity: 0.95;
}

.title-bar::after {
  right: 0;
  background: linear-gradient(to left, rgba(22, 56, 230, 0.95) 0%, transparent 100%);
  opacity: 0.85;
}

.title-bar.inactive {
  background: linear-gradient(
    to bottom,
    #7697e7 0%,
    #7e9ee3 3%,
    #94afe8 6%,
    #97b4e9 8%,
    #82a5e4 14%,
    #7c9fe2 17%,
    #7996de 25%,
    #7b99e1 56%,
    #82a9e9 81%,
    #80a5e7 89%,
    #7b96e1 94%,
    #7a93df 97%,
    #abbae3 100%
  );
}

.title-bar.inactive::before,
.title-bar.inactive::after {
  opacity: 0.4;
}

.title-bar.inactive .title-bar-text {
  opacity: 0.78;
}

.title-bar.inactive .title-btn {
  opacity: 0.72;
}

.title-bar-text {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.7);
}

.title-icon {
  width: 15px;
  height: 15px;
  object-fit: contain;
  flex-shrink: 0;
}

.window-body {
  flex: 1;
  overflow: auto;
  min-height: 0;
  margin: 0 2px 2px;
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  border-top: 0;
  background: var(--win-body-bg);
  padding: 0;
}

.window.maximized .title-bar,
.window.maximized .window-body {
  margin-left: 0;
  margin-right: 0;
}

.window.maximized .title-bar {
  margin-top: 0;
}

.window.maximized .window-body {
  margin-bottom: 0;
}

.title-bar-controls {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1px;
  margin-top: -1px;
}

.title-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  min-width: 22px;
  max-width: 22px;
  height: 22px;
  min-height: 22px;
  max-height: 22px;
  padding: 0;
  border: 1px solid #fff;
  border-radius: 3px;
  box-sizing: border-box;
  color: #fff;
  user-select: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  transition: filter var(--transition-fast);
  cursor: pointer;
}

.minimize-btn,
.maximize-btn {
  box-shadow: inset 0 -1px 2px 1px #4646ff;
  background-image: radial-gradient(
    circle at 90% 90%,
    #0054e9 0%,
    #2263d5 55%,
    #4479e4 70%,
    #a3bbec 90%,
    white 100%
  );
}

.close-btn {
  box-shadow: inset 0 -1px 2px 1px #da4600;
  background-image: radial-gradient(
    circle at 90% 90%,
    #cc4600 0%,
    #dc6527 55%,
    #cd7546 70%,
    #ffccb2 90%,
    white 100%
  );
}

.title-btn:hover {
  filter: brightness(1.18);
}

.title-btn:hover:active {
  filter: brightness(0.9);
}

.minimize-btn::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 13px;
  width: 8px;
  height: 3px;
  background: #fff;
}

.maximize-btn::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  width: 12px;
  height: 12px;
  box-shadow: inset 0 3px white, inset 0 0 0 1px white;
}

.maximize-btn.is-restore::before {
  left: 7px;
  top: 4px;
  width: 8px;
  height: 8px;
  box-shadow: inset 0 2px white, inset 0 0 0 1px white;
}

.maximize-btn.is-restore::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 7px;
  width: 8px;
  height: 8px;
  background-color: #136dff;
  box-shadow: inset 0 2px white, inset 0 0 0 1px white, 1px -1px #136dff;
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  left: 9px;
  top: 2px;
  width: 2px;
  height: 16px;
  background: #fff;
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
  opacity: 0.2;
  transition: opacity 0.12s ease;
}

.window:hover .resize-handle,
.window.is-resizing .resize-handle {
  opacity: 0.9;
}

.resize-n,
.resize-s {
  left: 10px;
  right: 10px;
  height: 7px;
  cursor: ns-resize;
}

.resize-n {
  top: 0;
  background: linear-gradient(180deg, rgba(56, 120, 210, 0.35) 0%, transparent 100%);
}

.resize-e,
.resize-w {
  top: 10px;
  bottom: 10px;
  width: 7px;
  cursor: ew-resize;
}

.resize-e {
  right: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(56, 120, 210, 0.35) 100%);
}

.resize-s {
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(56, 120, 210, 0.35) 100%);
}

.resize-w {
  left: 0;
  background: linear-gradient(90deg, rgba(56, 120, 210, 0.35) 0%, transparent 100%);
}

.resize-ne,
.resize-nw,
.resize-se,
.resize-sw {
  width: 18px;
  height: 18px;
}

.resize-ne {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.resize-nw {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.resize-sw {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.resize-se {
  bottom: 0;
  right: 0;
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
  transition: all 0.12s ease-in;
}

.window-minimize-leave-active {
  transition: all 0.12s ease-in;
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
  transition: all 0.12s ease-out;
}

.window-restore-leave-active {
  transition: all 0.12s ease-out;
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
