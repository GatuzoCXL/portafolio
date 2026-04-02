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
    icon: '🖥️',
  },
  {
    id: 'internet-explorer',
    label: 'Internet Explorer',
    icon: '🌐',
  },
  {
    id: 'messenger',
    label: 'MSN Messenger',
    icon: '💬',
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
  background: linear-gradient(135deg, #0066cc 0%, #00ccff 100%);
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1920"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="%2300aaff"/><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
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
