<template>
  <div
    class="window"
    :style="{
      top: `${dragY}px`,
      left: `${dragX}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: zIndex,
    }"
    @mousedown="bringToFront"
    ref="windowElement"
  >
    <div
      class="title-bar"
      ref="titleBarHandle"
      @mousedown="bringToFront"
    >
      <div class="title-bar-text">{{ title }}</div>
      <div class="title-bar-controls">
        <button
          @click="minimizeWindow"
          aria-label="Minimizar ventana"
        ></button>
        <button
          @click="maximizeWindow"
          aria-label="Maximizar ventana"
        ></button>
        <button
          @click="closeWindow"
          aria-label="Cerrar ventana"
        ></button>
      </div>
    </div>

    <section class="window-body">
      <slot></slot>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
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

const { x: dragX, y: dragY, isDragging } = useDraggable(windowElement, {
  initialValue: { x: props.x, y: props.y },
  handle: titleBarHandle,
  preventDefault: true,
})

watch([dragX, dragY], ([nextX, nextY]) => {
  windowStore.updateWindowPosition(props.windowId, Math.round(nextX), Math.round(nextY))
})

watch(
  () => [props.x, props.y],
  ([nextX, nextY]) => {
    if (!isDragging.value) {
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title-bar {
  cursor: move;
}

.window-body {
  flex: 1;
  overflow: auto;
}
</style>
