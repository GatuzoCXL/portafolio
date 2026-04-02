<script setup>
import { useWindowsStore } from '@/stores/windows'
import Desktop from '@/components/os/Desktop.vue'
import Taskbar from '@/components/os/Taskbar.vue'
import StartMenu from '@/components/os/StartMenu.vue'
import WindowTemplate from '@/components/os/WindowTemplate.vue'
import AboutMe from '@/components/apps/AboutMe.vue'
import Projects from '@/components/apps/Projects.vue'
import Contact from '@/components/apps/Contact.vue'
import GamesExplorer from '@/components/apps/GamesExplorer.vue'

const windowsStore = useWindowsStore()

const appComponents = {
  AboutMe,
  Projects,
  Contact,
  GamesExplorer,
}
</script>

<template>
  <div id="windows-xp-os">
    <Desktop />

    <div v-for="window in windowsStore.windows" :key="window.id">
      <WindowTemplate
        v-if="window.isOpen && !window.isMinimized"
        :window-id="window.id"
        :title="window.title"
        :x="window.x"
        :y="window.y"
        :width="window.width"
        :height="window.height"
        :z-index="window.zIndex"
      >
        <component :is="appComponents[window.component]" />
      </WindowTemplate>
    </div>

    <Taskbar />
    <StartMenu />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  background: #000080;
}

#app,
#windows-xp-os {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* Scrollbar estilo Windows XP */
::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-track {
  background: #c0c0c0;
  border: 1px solid #808080;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #dfdfdf 0%, #c0c0c0 100%);
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

::-webkit-scrollbar-corner {
  background: #c0c0c0;
}
</style>
