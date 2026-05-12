import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useShellStore } from '@/stores/shell'

const MOBILE_BREAKPOINT = '(max-width: 768px)'

export function useActiveShell() {
  const shellStore = useShellStore()
  let mediaQuery = null
  let mediaQueryListener = null

  const updateIsMobile = (mq) => {
    shellStore.isMobile = mq.matches
  }

  const currentShell = computed(() => {
    return shellStore.isMobile ? 'mobile' : 'desktop'
  })

  if (typeof window !== 'undefined') {
    shellStore.isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    mediaQueryListener = (e) => updateIsMobile(e)
    mediaQuery.addEventListener('change', mediaQueryListener)
    updateIsMobile(mediaQuery)
  })

  onBeforeUnmount(() => {
    if (mediaQuery && mediaQueryListener) {
      mediaQuery.removeEventListener('change', mediaQueryListener)
      mediaQuery = null
      mediaQueryListener = null
    }
  })

  return {
    isMobile: computed(() => shellStore.isMobile),
    currentShell,
    openApp: shellStore.openApp,
  }
}
