<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { useMusicStore } from '@/stores/music'
import { useXPSound } from '@/composables/useXPSound'
import Desktop from '@/components/os/Desktop.vue'
import Taskbar from '@/components/os/Taskbar.vue'
import StartMenu from '@/components/os/StartMenu.vue'
import WindowTemplate from '@/components/os/WindowTemplate.vue'
import BootScreen from '@/components/os/BootScreen.vue'
import ShutdownScreen from '@/components/os/ShutdownScreen.vue'
import MusicWidget from '@/components/os/MusicWidget.vue'
import SystemDialog from '@/components/os/SystemDialog.vue'
import RunDialog from '@/components/os/RunDialog.vue'
import AboutMe from '@/components/apps/AboutMe.vue'
import Documents from '@/components/apps/Documents.vue'
import Projects from '@/components/apps/Projects.vue'
import Contact from '@/components/apps/Contact.vue'
import GamesExplorer from '@/components/apps/GamesExplorer.vue'
import ProjectDetail from '@/components/apps/ProjectDetail.vue'
import MusicPlayerApp from '@/components/apps/MusicPlayerApp.vue'
import { useRunLauncherStore } from '@/stores/runLauncher'

const windowsStore = useWindowsStore()
const { setupFirstInteractionListener, playStartupSound, playClickSound } = useXPSound()

const appComponents = {
  AboutMe,
  Documents,
  Projects,
  Contact,
  GamesExplorer,
  ProjectDetail,
  MusicPlayerApp,
}

const isBooting = ref(true)
const pendingStartupSound = ref(false)
const musicStore = useMusicStore()
const runLauncher = useRunLauncherStore()
let globalClickHandler = null
let globalDblClickHandler = null
let globalKeydownHandler = null

const onBootDone = () => {
  isBooting.value = false
  if (pendingStartupSound.value) {
    playStartupSound()
    pendingStartupSound.value = false
  }
}

onMounted(() => {
  setupFirstInteractionListener(() => {
    if (isBooting.value) {
      pendingStartupSound.value = true
      return
    }

    playStartupSound()
  })

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
      playClickSound()
    }
  }

  const onGlobalDblClick = (event) => {
    if (windowsStore.isShuttingDown) return
    if (event.target?.closest('.title-bar, .desktop-icon, .screenshot')) {
      playClickSound()
    }
  }

  const onGlobalKeydown = (event) => {
    if (isBooting.value || windowsStore.isShuttingDown) return

    const targetTag = event.target?.tagName?.toLowerCase()
    const isTypingContext =
      targetTag === 'input' || targetTag === 'textarea' || event.target?.isContentEditable

    // Esc closes Run dialog first
    if (event.key === 'Escape' && runLauncher.isOpen) {
      runLauncher.close()
      event.preventDefault()
      return
    }

    // Win+R / Ctrl+R opens Run dialog (outside typing)
    const isRunShortcut = (event.metaKey && event.key.toLowerCase() === 'r') ||
      (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'r')
    if (isRunShortcut && !isTypingContext) {
      runLauncher.open()
      event.preventDefault()
      return
    }

    // Alt + F4 -> close active window
    if (event.altKey && event.key === 'F4') {
      const closed = windowsStore.closeActiveWindow()
      if (closed) {
        event.preventDefault()
      }
      return
    }

    // Ctrl + M -> minimize active window
    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'm') {
      const minimized = windowsStore.minimizeActiveWindow()
      if (minimized) {
        event.preventDefault()
      }
      return
    }

    // Ctrl + W -> close active window (only outside typing contexts)
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
    <BootScreen v-if="isBooting" @done="onBootDone" />

    <ShutdownScreen v-if="!isBooting && windowsStore.isShuttingDown" />

    <template v-if="!isBooting">
      <Desktop />

      <TransitionGroup name="window">
        <WindowTemplate
          v-for="window in windowsStore.windows"
          v-show="window.isOpen && !window.isMinimized"
          :key="window.id"
          :window-id="window.id"
          :title="window.title"
          :icon="window.icon"
          :x="window.x"
          :y="window.y"
          :width="window.width"
          :height="window.height"
          :z-index="window.zIndex"
        >
          <component
            :is="appComponents[window.component]"
            :project-id="window.projectId"
          />
        </WindowTemplate>
      </TransitionGroup>

      <Taskbar />
      <StartMenu />
      <MusicWidget v-if="musicStore.widgetVisible" @close="musicStore.widgetVisible = false" />
      <SystemDialog />
      <RunDialog />
    </template>
  </div>
</template>
