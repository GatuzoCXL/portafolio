import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Gestión de ventanas: estado, posiciones, z-index y menú de inicio
export const useWindowsStore = defineStore('windows', () => {
  const windows = ref([
    {
      id: 'my-pc',
      title: 'Mi PC',
      icon: '🖥️',
      component: 'AboutMe',
      isOpen: false,
      isMinimized: false,
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      zIndex: 1,
    },
    {
      id: 'internet-explorer',
      title: 'Internet Explorer',
      icon: '🌐',
      component: 'Projects',
      isOpen: false,
      isMinimized: false,
      x: 150,
      y: 150,
      width: 850,
      height: 650,
      zIndex: 1,
    },
    {
      id: 'messenger',
      title: 'MSN Messenger',
      icon: '💬',
      component: 'Contact',
      isOpen: false,
      isMinimized: false,
      x: 200,
      y: 200,
      width: 400,
      height: 500,
      zIndex: 1,
    },
  ])

  const isStartMenuOpen = ref(false)
  const maxZIndex = ref(100)

  const toggleWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      if (window.isMinimized) {
        window.isMinimized = false
        bringToFront(windowId)
      } else if (window.isOpen) {
        window.isMinimized = true
      } else {
        window.isOpen = true
        window.isMinimized = false
        bringToFront(windowId)
      }
    }
  }

  const closeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.isOpen = false
      window.isMinimized = false
    }
  }

  const bringToFront = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      maxZIndex.value += 1
      window.zIndex = maxZIndex.value
    }
  }

  const updateWindowPosition = (windowId, x, y) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.x = x
      window.y = y
    }
  }

  const minimizeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.isMinimized = true
    }
  }

  const maximizeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.x = 0
      window.y = 0
      window.width = window.innerWidth || 1920
      window.height = window.innerHeight || 1080
    }
  }

  const restoreWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.x = 100
      window.y = 100
      window.width = 800
      window.height = 600
    }
  }

  const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value
  }

  const closeStartMenu = () => {
    isStartMenuOpen.value = false
  }

  const openWindows = computed(() => {
    return windows.value.filter(w => w.isOpen)
  })

  return {
    windows,
    isStartMenuOpen,
    maxZIndex,
    openWindows,
    toggleWindow,
    closeWindow,
    bringToFront,
    updateWindowPosition,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    toggleStartMenu,
    closeStartMenu,
  }
})
