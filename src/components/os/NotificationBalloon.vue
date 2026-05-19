<template>
  <div class="notification-balloon" :class="{ visible: isVisible, leaving: isLeaving }">
    <div class="balloon-body">
      <button class="balloon-close" @click="closeBalloon" aria-label="Cerrar">&times;</button>
      <div class="balloon-header">
        <img :src="infoIcon" alt="" class="balloon-icon" />
        <span class="balloon-title">&iexcl;Bienvenido!</span>
      </div>
      <p class="balloon-message">Bienvenido a mi portafolio.</p>
      <p class="balloon-hint">Puedes comenzar por Proyectos, Sobre mí, Documentos o Contacto según lo que desees explorar primero.</p>
      <div class="balloon-links">
        <a @click.prevent="openAndClose('internet-explorer')">Proyectos</a>
        <span class="link-sep">&middot;</span>
        <a @click.prevent="openAndClose('my-pc')">Sobre m&iacute;</a>
        <span class="link-sep">&middot;</span>
        <a @click.prevent="openAndClose('messenger')">Contacto</a>
        <span class="link-sep">&middot;</span>
        <a @click.prevent="openAndClose('documents')">Documentos</a>
        <span class="link-sep">&middot;</span>
        <a @click.prevent="openAndClose('documents')">CV</a>
      </div>
    </div>
    <div class="balloon-pointer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { xpIcon } from '@/utils/xpIcons'

const windowsStore = useWindowsStore()
const isVisible = ref(false)
const isLeaving = ref(false)
const infoIcon = xpIcon('windows-logo')
let showTimer = null
let hideTimer = null

const closeBalloon = () => {
  if (isLeaving.value) return
  isLeaving.value = true
  hideTimer && clearTimeout(hideTimer)
  setTimeout(() => {
    windowsStore.balloonDismissed = true
  }, 400)
}

const openAndClose = (windowId) => {
  windowsStore.openWindow(windowId)
  closeBalloon()
}

onMounted(() => {
  showTimer = setTimeout(() => {
    isVisible.value = true
    hideTimer = setTimeout(() => {
      closeBalloon()
    }, 20000)
  }, 1200)
})

onUnmounted(() => {
  showTimer && clearTimeout(showTimer)
  hideTimer && clearTimeout(hideTimer)
})
</script>

<style scoped>
.notification-balloon {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 260px;
  z-index: 10000;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.notification-balloon.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.notification-balloon.leaving {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
}

.balloon-body {
  background: linear-gradient(180deg, #fffef6 0%, #fff9dc 100%);
  border: 1px solid #c9b56c;
  border-radius: 6px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.35);
  padding: 9px 11px 10px;
  position: relative;
}

.balloon-body::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.balloon-pointer {
  position: absolute;
  bottom: -11px;
  right: 26px;
  width: 18px;
  height: 12px;
  overflow: hidden;
}

.balloon-pointer::before {
  content: '';
  position: absolute;
  left: 1px;
  top: -7px;
  width: 14px;
  height: 14px;
  background: linear-gradient(180deg, #fffef6 0%, #fff9dc 100%);
  border-right: 1px solid #c9b56c;
  border-bottom: 1px solid #c9b56c;
  transform: rotate(45deg);
}

.balloon-close {
  position: absolute;
  top: 5px;
  right: 6px;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 1px solid #d7c27a;
  border-radius: 2px;
  background: linear-gradient(180deg, #fffdf4 0%, #f3e3a3 100%);
  box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.85);
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  color: #5f5a4c;
}

.balloon-close:hover {
  background: linear-gradient(180deg, #fffef8 0%, #f6e8b6 100%);
  color: #333;
}

.balloon-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  padding-right: 18px;
}

.balloon-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.balloon-title {
  font-size: 12px;
  font-weight: 700;
  color: #000;
}

.balloon-message {
  font-size: 11px;
  color: #000;
  margin: 0 0 4px;
  line-height: 1.35;
}

.balloon-hint {
  font-size: 11px;
  color: #333;
  margin: 0 0 7px;
  line-height: 1.35;
}

.balloon-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 11px;
  line-height: 1.25;
}

.balloon-links a {
  color: #0000ee;
  text-decoration: underline;
  cursor: pointer;
}

.balloon-links a:hover {
  color: #0000aa;
}

.link-sep {
  color: #666;
}
</style>
