<script setup>
import { computed } from 'vue'
import { useShellStore } from '@/stores/shell'
import MobileAboutView from './apps/MobileAboutView.vue'
import MobileDocumentsView from './apps/MobileDocumentsView.vue'
import MobileContactView from './apps/MobileContactView.vue'
import MobileForumView from './apps/MobileForumView.vue'
import MobileGamesView from './apps/MobileGamesView.vue'
import MobileMusicView from './apps/MobileMusicView.vue'
import MobileWallpaperView from './apps/MobileWallpaperView.vue'
import Projects from '@/components/apps/Projects.vue'
import ProjectDetail from '@/components/apps/ProjectDetail.vue'
import RecycleBin from '@/components/apps/RecycleBin.vue'

const shellStore = useShellStore()

const appComponents = {
  AboutMe: MobileAboutView,
  Documents: MobileDocumentsView,
  Contact: MobileContactView,
  Forum: MobileForumView,
  MobileGames: MobileGamesView,
  MobileMusicView,
  MobileWallpaper: MobileWallpaperView,
  Projects,
  ProjectDetail,
  RecycleBin,
}

const appMeta = {
  'my-pc': { label: 'Sobre mi', component: 'AboutMe' },
  'documents': { label: 'Documentos', component: 'Documents' },
  'internet-explorer': { label: 'Foro de Proyectos', component: 'Forum' },
  'messenger': { label: 'Contacto', component: 'Contact' },
  'games-folder': { label: 'Juegos', component: 'MobileGames' },
  'music-player': { label: 'Musica', component: 'MobileMusicView' },
  'wallpaper': { label: 'Fondo', component: 'MobileWallpaper' },
  'recycle-bin': { label: 'Papelera', component: 'RecycleBin' },
}

const activeApp = computed(() => shellStore.activeMobileApp)
const appKey = computed(() => activeApp.value?.replace('project-', '') ?? null)
const isProject = computed(() => activeApp.value?.startsWith('project-') ?? false)

const appComponent = computed(() => {
  const id = activeApp.value
  if (!id) return null
  if (id === 'my-pc') return appComponents.AboutMe
  if (id === 'documents') return appComponents.Documents
  if (id === 'internet-explorer') return appComponents.Forum
  if (id === 'messenger') return appComponents.Contact
  if (id === 'games-folder') return appComponents.MobileGames
  if (id === 'music-player') return appComponents.MobileMusicView
  if (id === 'wallpaper') return appComponents.MobileWallpaper
  if (id === 'recycle-bin') return appComponents.RecycleBin
  if (id.startsWith('project-')) return appComponents.ProjectDetail
  return null
})

const appProps = computed(() => {
  const id = activeApp.value
  if (!id) return {}
  if (id.startsWith('project-')) {
    return { projectId: id.replace('project-', '') }
  }
  return {}
})

const currentLabel = computed(() => {
  const id = activeApp.value
  if (!id) return ''
  if (isProject.value) return 'Proyecto'
  return appMeta[id]?.label ?? ''
})

const onBack = () => {
  shellStore.activeMobileApp = null
}
</script>

<template>
  <div class="mobile-app-view">
    <header class="mobile-app-header">
      <button class="mobile-app-back" aria-label="Atras" @click="onBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="mobile-app-title">{{ currentLabel }}</span>
      <span class="mobile-app-spacer"></span>
    </header>

    <div class="mobile-app-content">
      <component
        v-if="appComponent"
        :is="appComponent"
        v-bind="appProps"
      />
    </div>
  </div>
</template>

<style scoped>
.mobile-app-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1a1a1a;
  min-height: 0;
}

.mobile-app-header {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  background: #000000;
  border-bottom: 1px solid #2c2334;
  flex-shrink: 0;
  gap: 8px;
}

.mobile-app-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #f2eef7;
  border-radius: 8px;
  flex-shrink: 0;
}

.mobile-app-back:active {
  opacity: 0.6;
}

.mobile-app-title {
  font-size: 16px;
  font-weight: 600;
  color: #f2eef7;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-app-spacer {
  width: 40px;
  flex-shrink: 0;
}

.mobile-app-content {
  flex: 1;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  container-type: inline-size;
  min-height: 0;
}

.mobile-app-content::-webkit-scrollbar {
  display: none;
}

/* Scope XP overrides for embedded app content */
.mobile-app-content :deep(*) {
  box-sizing: border-box;
}

.mobile-app-content :deep(body) {
  background: #1a1a1a;
}
</style>
