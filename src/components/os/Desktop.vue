<template>
  <div class="desktop" @click="handleDesktopClick" @contextmenu.prevent="openContextMenu">
    <div class="desktop-icons">
      <div
        v-for="icon in desktopIcons"
        :key="icon.id"
        class="desktop-icon"
        :class="{ 'icon-clicked': clickedId === icon.id, 'is-selected': selectedIconId === icon.id }"
        @dblclick="handleIconDoubleClick(icon.id)"
        @click.stop="handleIconClick(icon.id)"
        @contextmenu.prevent.stop="openIconContextMenu($event, icon.id)"
      >
        <div class="icon-img-wrapper">
          <img :src="icon.icon" :alt="icon.label" />
        </div>
        <span>{{ icon.label }}</span>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="desktop-context-menu"
        :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      >
        <button class="context-item" @click="refreshDesktop">Actualizar</button>
        <button class="context-item" @click="clearSelection">Deseleccionar</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()
const clickedId = ref(null)
const selectedIconId = ref(null)
const contextMenu = ref({ visible: false, x: 0, y: 0, iconId: null })

const desktopIcons = [
  {
    id: 'my-pc',
    label: 'Mi PC',
    icon: '/icons/my-pc.svg',
  },
  {
    id: 'documents',
    label: 'Mis Documentos',
    icon: '/icons/documents.svg',
  },
  {
    id: 'internet-explorer',
    label: 'Internet Explorer',
    icon: '/icons/internet-explorer.svg',
  },
  {
    id: 'messenger',
    label: 'MSN Messenger',
    icon: '/icons/messenger.svg',
  },
  {
    id: 'games-folder',
    label: 'Juegos',
    icon: '/icons/games-folder.svg',
  },
  {
    id: 'music-player',
    label: 'Music Studio',
    icon: '/icons/media-audio.svg',
  },
]

const handleIconClick = (id) => {
  closeContextMenu()
  selectedIconId.value = id
  clickedId.value = id
  setTimeout(() => {
    clickedId.value = null
  }, 200)
}

const handleIconDoubleClick = (windowId) => {
  windowsStore.toggleWindow(windowId)
}

const handleDesktopClick = () => {
  selectedIconId.value = null
  closeContextMenu()
}

const openContextMenu = (event) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    iconId: null,
  }
}

const openIconContextMenu = (event, iconId) => {
  selectedIconId.value = iconId
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    iconId,
  }
}

const closeContextMenu = () => {
  contextMenu.value.visible = false
}

const refreshDesktop = () => {
  closeContextMenu()
}

const clearSelection = () => {
  selectedIconId.value = null
  closeContextMenu()
}

const handleGlobalClick = () => {
  closeContextMenu()
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.desktop {
  width: 100%;
  height: 100%;
  background: url('/wallpapers/ed.jpg') center center / cover no-repeat;
  overflow: hidden;
  user-select: none;
}

.desktop-icons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  align-items: flex-start;
  pointer-events: auto;
  z-index: 1;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 3px;
  width: 76px;
  font-size: 11px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.5);
  user-select: none;
  -webkit-user-select: none;
  transition: background-color 0.1s;
  outline: 1px solid transparent;
}

.desktop-icon:hover {
  background-color: rgba(49, 106, 197, 0.3);
  outline: 1px dotted rgba(255, 255, 255, 0.6);
}

.desktop-icon:active,
.desktop-icon.icon-clicked {
  background-color: rgba(49, 106, 197, 0.5);
}

.desktop-icon.is-selected {
  background-color: rgba(49, 106, 197, 0.5);
  outline: 1px dotted rgba(255, 255, 255, 0.75);
}

.icon-img-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.desktop-icon:hover .icon-img-wrapper {
  filter: drop-shadow(0 0 6px rgba(100, 160, 255, 0.7)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.desktop-icon.icon-clicked .icon-img-wrapper {
  transform: scale(0.88);
}

.desktop-icon img {
  width: 48px;
  height: 48px;
}

.desktop-icon span {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  max-width: 72px;
}

.desktop-context-menu {
  position: fixed;
  min-width: 160px;
  background: #ece9d8;
  border: 1px solid #0046b8;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.35);
  padding: 2px;
  z-index: 12000;
  display: flex;
  flex-direction: column;
}

.context-item {
  border: none;
  background: transparent;
  text-align: left;
  padding: 6px 8px;
  font-size: 11px;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  cursor: pointer;
}

.context-item:hover {
  background: linear-gradient(90deg, #2a68bf, #3b89dd);
  color: #fff;
}
</style>
