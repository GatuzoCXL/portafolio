<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { useXPSound } from '@/composables/useXPSound'
import { useActiveShell } from '@/composables/useActiveShell'
import DesktopShell from '@/components/os/DesktopShell.vue'
import MobileShell from '@/components/mobile/MobileShell.vue'
import BootScreen from '@/components/os/BootScreen.vue'
import ShutdownScreen from '@/components/os/ShutdownScreen.vue'
import { useRunLauncherStore } from '@/stores/runLauncher'

const windowsStore = useWindowsStore()
const { setupFirstInteractionListener, playClickSound, playMobileTapSound, hasInteracted } = useXPSound()
const { isMobile } = useActiveShell()

const isBooting = ref(true)
const runLauncher = useRunLauncherStore()
let globalClickHandler = null
let globalDblClickHandler = null
let globalKeydownHandler = null

const onBootDone = () => {
  isBooting.value = false
}

watch(isMobile, (mobile) => {
  if (mobile) {
    isBooting.value = false
  }
}, { immediate: true })

onMounted(() => {
  setupFirstInteractionListener()

  const interactiveSelector = [
    'button',
    'a',
    '[role="button"]',
    '.desktop-icon',
    '.screenshot',
    '.nav-button',
    '.context-item',
    '.tech-badge',
    '.game-button',
    'input',
    'textarea',
    'select',
  ].join(', ')

  const onGlobalClick = (event) => {
    if (windowsStore.isShuttingDown) return
    if (event.target?.closest(interactiveSelector)) {
      isMobile.value ? playMobileTapSound() : playClickSound()
    }
  }

  const onGlobalDblClick = (event) => {
    if (windowsStore.isShuttingDown) return
    if (event.target?.closest('.title-bar, .desktop-icon, .screenshot')) {
      isMobile.value ? playMobileTapSound() : playClickSound()
    }
  }

  const onGlobalKeydown = (event) => {
    if (isBooting.value || windowsStore.isShuttingDown) return
    if (isMobile.value) return

    const targetTag = event.target?.tagName?.toLowerCase()
    const isTypingContext =
      targetTag === 'input' || targetTag === 'textarea' || event.target?.isContentEditable

    if (event.key === 'Escape' && runLauncher.isOpen) {
      runLauncher.close()
      event.preventDefault()
      return
    }

    const isRunShortcut = (event.metaKey && event.key.toLowerCase() === 'r') ||
      (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'r')
    if (isRunShortcut && !isTypingContext) {
      runLauncher.open()
      event.preventDefault()
      return
    }

    if (event.altKey && event.key === 'F4') {
      const closed = windowsStore.closeActiveWindow()
      if (closed) {
        event.preventDefault()
      }
      return
    }

    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'm') {
      const minimized = windowsStore.minimizeActiveWindow()
      if (minimized) {
        event.preventDefault()
      }
      return
    }

    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'w' && !isTypingContext) {
      const closed = windowsStore.closeActiveWindow()
      if (closed) {
        event.preventDefault()
      }
    }
  }

  globalClickHandler = onGlobalClick
  globalDblClickHandler = onGlobalDblClick
  globalKeydownHandler = onGlobalKeydown
  window.addEventListener('click', globalClickHandler, true)
  window.addEventListener('dblclick', globalDblClickHandler, true)
  window.addEventListener('keydown', globalKeydownHandler, true)
})

onBeforeUnmount(() => {
  if (globalClickHandler) {
    window.removeEventListener('click', globalClickHandler, true)
    globalClickHandler = null
  }

  if (globalDblClickHandler) {
    window.removeEventListener('dblclick', globalDblClickHandler, true)
    globalDblClickHandler = null
  }

  if (globalKeydownHandler) {
    window.removeEventListener('keydown', globalKeydownHandler, true)
    globalKeydownHandler = null
  }
})
</script>

<template>
  <div id="windows-xp-os">
    <BootScreen v-if="isBooting && !isMobile" @done="onBootDone" />

    <ShutdownScreen v-if="!isBooting && windowsStore.isShuttingDown" />

    <template v-if="!isBooting || isMobile">
      <DesktopShell v-if="!isMobile" />
      <MobileShell v-else />
    </template>
  </div>
</template>
