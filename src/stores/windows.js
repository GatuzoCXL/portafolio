import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const LAYOUT_STORAGE_KEY = 'xp-window-layout-v1'

const readSavedLayout = () => {
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Gestión de ventanas: estado, posiciones, z-index y menú de inicio
export const useWindowsStore = defineStore('windows', () => {
  const savedLayout = readSavedLayout()

  const windows = ref([
    {
      id: 'my-pc',
      title: 'Mi PC',
      icon: '/icons/my-pc.svg',
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
      id: 'documents',
      title: 'Mis Documentos',
      icon: '/icons/documents.svg',
      component: 'Documents',
      isOpen: false,
      isMinimized: false,
      x: 140,
      y: 110,
      width: 760,
      height: 580,
      zIndex: 1,
    },
    {
      id: 'internet-explorer',
      title: 'Internet Explorer',
      icon: '/icons/internet-explorer.svg',
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
      icon: '/icons/messenger.svg',
      component: 'Contact',
      isOpen: false,
      isMinimized: false,
      x: 200,
      y: 200,
      width: 400,
      height: 500,
      zIndex: 1,
    },
    {
      id: 'games-folder',
      title: 'Carpeta de Juegos',
      icon: '/icons/games-folder.svg',
      component: 'GamesExplorer',
      isOpen: false,
      isMinimized: false,
      x: 240,
      y: 120,
      width: 980,
      height: 680,
      zIndex: 1,
    },
    {
      id: 'music-player',
      title: 'Music Studio',
      icon: '/icons/media-audio.svg',
      component: 'MusicPlayerApp',
      isOpen: false,
      isMinimized: false,
      x: 260,
      y: 100,
      width: 560,
      height: 560,
      zIndex: 1,
    },
  ])

  const isStartMenuOpen = ref(false)
  const isShuttingDown = ref(false)
  const maxZIndex = ref(100)

  const MINIMIZE_ANIMATION_MS = 180

  // Restore persisted layout for static windows.
  windows.value = windows.value.map((windowItem) => {
    const saved = savedLayout[windowItem.id]
    if (!saved) return windowItem

    return {
      ...windowItem,
      x: Number.isFinite(saved.x) ? saved.x : windowItem.x,
      y: Number.isFinite(saved.y) ? saved.y : windowItem.y,
      width: Number.isFinite(saved.width) ? saved.width : windowItem.width,
      height: Number.isFinite(saved.height) ? saved.height : windowItem.height,
      isOpen: typeof saved.isOpen === 'boolean' ? saved.isOpen : windowItem.isOpen,
      isMinimized:
        typeof saved.isMinimized === 'boolean' ? saved.isMinimized : windowItem.isMinimized,
    }
  })

  const persistLayout = () => {
    try {
      const layout = windows.value.reduce((acc, windowItem) => {
        if (windowItem.id.startsWith('project-')) {
          return acc
        }

        acc[windowItem.id] = {
          x: windowItem.x,
          y: windowItem.y,
          width: windowItem.width,
          height: windowItem.height,
          isOpen: windowItem.isOpen,
          isMinimized: windowItem.isMinimized,
        }

        return acc
      }, {})

      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout))
    } catch {
      // ignore persistence errors
    }
  }

  const toggleWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      if (window.isMinimized) {
        restoreMinimizedWindow(windowId)
      } else if (window.isOpen) {
        minimizeWindow(windowId)
      } else {
        window.isOpen = true
        window.isMinimized = false
        bringToFront(windowId)
        persistLayout()
      }
    }
  }

  const openWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (!window) return

    window.isOpen = true
    window.isMinimized = false
    bringToFront(windowId)
    persistLayout()
  }

  const closeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.isOpen = false
      window.isMinimized = false
      window.isMinimizing = false
      window.isRestoring = false
      persistLayout()
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
      persistLayout()
    }
  }

  const updateWindowSize = (windowId, width, height) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      window.width = width
      window.height = height
      persistLayout()
    }
  }

  const minimizeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      if (window.isMinimized || window.isMinimizing) return
      window.isMinimizing = true

      window.settledX = window.x
      window.settledY = window.y

      window.settleTimeout && clearTimeout(window.settleTimeout)
      window.settleTimeout = setTimeout(() => {
        window.isMinimized = true
        window.isMinimizing = false
        persistLayout()
      }, MINIMIZE_ANIMATION_MS)
    }
  }

  const restoreMinimizedWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId)
    if (window) {
      if (!window.isMinimized || window.isRestoring) return
      window.isMinimized = false
      window.isRestoring = true
      bringToFront(windowId)

      window.restoreTimeout && clearTimeout(window.restoreTimeout)
      window.restoreTimeout = setTimeout(() => {
        window.isRestoring = false
        persistLayout()
      }, MINIMIZE_ANIMATION_MS)
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

  const beginShutdown = () => {
    isStartMenuOpen.value = false
    isShuttingDown.value = true

    // Clear any in-flight animation timers to avoid stray state changes.
    for (const w of windows.value) {
      w.settleTimeout && clearTimeout(w.settleTimeout)
      w.restoreTimeout && clearTimeout(w.restoreTimeout)
    }
  }

  const openProjectDetail = (projectId) => {
    // Buscar o crear ventana de detalles
    let detailWindow = windows.value.find(w => w.id === `project-${projectId}`)
    
    if (!detailWindow) {
      detailWindow = {
        id: `project-${projectId}`,
        title: `Project Details - ${projectId}`,
        icon: '/icons/internet-explorer.svg',
        component: 'ProjectDetail',
        projectId: projectId,
        isOpen: true,
        isMinimized: false,
        x: 300,
        y: 250,
        width: 900,
        height: 600,
        zIndex: maxZIndex.value + 1,
      }
      windows.value.push(detailWindow)
      maxZIndex.value += 1
    } else {
      detailWindow.isOpen = true
      detailWindow.isMinimized = false
      bringToFront(`project-${projectId}`)
    }
  }

  const openWindows = computed(() => {
    return windows.value.filter(w => w.isOpen)
  })

  const activeWindow = computed(() => {
    const visible = openWindows.value.filter(w => !w.isMinimized)
    if (!visible.length) return null
    return [...visible].sort((a, b) => b.zIndex - a.zIndex)[0]
  })

  const closeActiveWindow = () => {
    if (!activeWindow.value) return false
    closeWindow(activeWindow.value.id)
    return true
  }

  const minimizeActiveWindow = () => {
    if (!activeWindow.value) return false
    minimizeWindow(activeWindow.value.id)
    return true
  }

  return {
    windows,
    isStartMenuOpen,
    isShuttingDown,
    maxZIndex,
    openWindows,
    activeWindow,
    toggleWindow,
    openWindow,
    closeWindow,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
    minimizeWindow,
    restoreMinimizedWindow,
    maximizeWindow,
    restoreWindow,
    toggleStartMenu,
    closeStartMenu,
    beginShutdown,
    openProjectDetail,
    closeActiveWindow,
    minimizeActiveWindow,
  }
})
