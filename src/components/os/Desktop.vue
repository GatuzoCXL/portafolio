<template>
  <div class="desktop">
    <div class="desktop-icons">
      <div
        v-for="icon in desktopIcons"
        :key="icon.id"
        class="desktop-icon"
        @dblclick="handleIconDoubleClick(icon.id)"
      >
        <img :src="icon.icon" :alt="icon.label" />
        <span>{{ icon.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()

const desktopIcons = [
  {
    id: 'my-pc',
    label: 'Mi PC',
    icon: '/icons/my-pc.svg',
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
]

const handleIconDoubleClick = (windowId) => {
  windowsStore.toggleWindow(windowId)
}
</script>

<style scoped>
.desktop {
  width: 100%;
  height: 100%;
  background: url('/wallpapers/bliss.svg') center center / cover no-repeat;
  overflow: hidden;
  user-select: none;
}

.desktop-icons {
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 20px;
  align-items: flex-start;
  pointer-events: auto;
  z-index: 1;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 80px;
  font-size: 11px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  user-select: none;
  -webkit-user-select: none;
}

.desktop-icon:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.desktop-icon img {
  width: 48px;
  height: 48px;
  font-size: 48px;
}

.desktop-icon span {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
