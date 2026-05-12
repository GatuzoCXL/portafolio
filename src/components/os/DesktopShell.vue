<script setup>
import { useWindowsStore } from '@/stores/windows'
import { useMusicStore } from '@/stores/music'
import Desktop from './Desktop.vue'
import Taskbar from './Taskbar.vue'
import StartMenu from './StartMenu.vue'
import WindowTemplate from './WindowTemplate.vue'
import MusicWidget from './MusicWidget.vue'
import SystemDialog from './SystemDialog.vue'
import RunDialog from './RunDialog.vue'
import AboutMe from '@/components/apps/AboutMe.vue'
import Documents from '@/components/apps/Documents.vue'
import Projects from '@/components/apps/Projects.vue'
import Contact from '@/components/apps/Contact.vue'
import Forum from '@/components/apps/Forum.vue'
import GamesExplorer from '@/components/apps/GamesExplorer.vue'
import ProjectDetail from '@/components/apps/ProjectDetail.vue'
import MusicPlayerApp from '@/components/apps/MusicPlayerApp.vue'
import Wallpaper from '@/components/apps/Wallpaper.vue'
import RecycleBin from '@/components/apps/RecycleBin.vue'

const appComponents = {
  AboutMe,
  Documents,
  Projects,
  Contact,
  Forum,
  GamesExplorer,
  ProjectDetail,
  MusicPlayerApp,
  Wallpaper,
  RecycleBin,
}

const windowsStore = useWindowsStore()
const musicStore = useMusicStore()
</script>

<template>
  <div class="desktop-shell">
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
  </div>
</template>

<style scoped>
.desktop-shell {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>