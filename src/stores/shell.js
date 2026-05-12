import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWindowsStore } from './windows'

const MOBILE_WALLPAPER_KEY = 'mobile-wallpaper-v1'

const readSavedMobileWallpaper = () => {
  try {
    return window.localStorage.getItem(MOBILE_WALLPAPER_KEY)
  } catch {
    return null
  }
}

export const useShellStore = defineStore('shell', () => {
  const isMobile = ref(false)
  const activeMobileApp = ref(null)
  const activeMobileWallpaper = ref(readSavedMobileWallpaper())

  const openApp = (appId) => {
    if (isMobile.value) {
      activeMobileApp.value = appId
    } else {
      const windowsStore = useWindowsStore()
      windowsStore.openWindow(appId)
    }
  }

  const closeMobileApp = () => {
    activeMobileApp.value = null
  }

  const setMobileWallpaper = (url) => {
    activeMobileWallpaper.value = url
    try {
      if (url) {
        window.localStorage.setItem(MOBILE_WALLPAPER_KEY, url)
      } else {
        window.localStorage.removeItem(MOBILE_WALLPAPER_KEY)
      }
    } catch {
    }
  }

  return {
    isMobile,
    activeMobileApp,
    activeMobileWallpaper,
    openApp,
    closeMobileApp,
    setMobileWallpaper,
  }
})
