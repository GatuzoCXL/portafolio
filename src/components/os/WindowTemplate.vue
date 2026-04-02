<template>
  <div
    class="window"
    :style="{
      top: `${x}px`,
      left: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: zIndex,
    }"
    @mousedown="bringToFrontAndDrag"
    ref="windowElement"
  >
    <div
      class="title-bar"
      @mousedown.prevent="startDrag"
      style="cursor: move;"
    >
      <div class="title-bar-controls">
        <button
          class="title-bar-button"
          @click="minimizeWindow"
          aria-label="Minimizar ventana"
        >
          _
        </button>
        <button
          class="title-bar-button"
          @click="maximizeWindow"
          aria-label="Maximizar ventana"
        >
          □
        </button>
        <button
          class="title-bar-button"
          @click="closeWindow"
          aria-label="Cerrar ventana"
        >
          ×
        </button>
      </div>
      <span class="title-bar-title">{{ title }}</span>
    </div>

    <div class="window-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

const bringToFrontAndDrag = () => {
  windowStore.bringToFront(props.windowId)
}

const startDrag = (e) => {
  isDragging.value = true
  dragOffsetX.value = e.clientX - props.x
  dragOffsetY.value = e.clientY - props.y

  const handleMouseMove = (moveEvent) => {
    if (isDragging.value) {
      const newX = moveEvent.clientX - dragOffsetX.value
      const newY = moveEvent.clientY - dragOffsetY.value
      windowStore.updateWindowPosition(props.windowId, newX, newY)
    }
  }

  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const minimizeWindow = () => {
  windowStore.minimizeWindow(props.windowId)
}

const maximizeWindow = () => {
  windowStore.maximizeWindow(props.windowId)
}

const closeWindow = () => {
  windowStore.closeWindow(props.windowId)
}
</script>

<style scoped>
.window {
  position: absolute;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 1px 1px 0 #dfdfdf inset, -1px -1px 0 #808080 inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d7);
  color: white;
  padding: 1px 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  height: 20px;
}

.title-bar-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 11px;
}

.title-bar-controls {
  display: flex;
  gap: 2px;
}

.title-bar-button {
  width: 18px;
  height: 18px;
  padding: 0;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.title-bar-button:hover {
  background: #dfdfdf;
}

.window-body {
  flex: 1;
  overflow: auto;
  background: #c0c0c0;
  padding: 2px;
}
</style>
