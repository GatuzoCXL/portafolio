<template>
  <transition name="fade">
    <div
      v-if="windowsStore.isStartMenuOpen"
      class="start-menu-overlay"
      @click="windowsStore.closeStartMenu"
    ></div>
  </transition>

  <transition name="slide-up">
    <div v-if="windowsStore.isStartMenuOpen" class="start-menu">
      <div class="start-menu-header">
        <div class="user-info">
          <div class="user-avatar">G</div>
          <div class="user-meta">
            <span class="user-name">Gasut</span>
            <span class="user-subname">Administrador</span>
          </div>
        </div>
      </div>

      <div class="start-menu-content">
        <div class="programs-column">
          <div class="menu-section-title">Programas</div>
          <button
            v-for="program in recentPrograms"
            :key="program.id"
            class="program-button"
            @click="openProgram(program.id)"
          >
            <img :src="program.icon" :alt="program.name" class="program-icon" />
            {{ program.name }}
          </button>
        </div>

        <div class="menu-divider"></div>

        <div class="system-column">
          <button class="system-button" @click="handleDocuments">
            <img :src="documentsIcon" alt="Documentos" class="sys-icon" />
            Mis Documentos
          </button>
          <button class="system-button" @click="handleControl">
            <img :src="controlPanelIcon" alt="Panel" class="sys-icon" />
            Panel de Control
          </button>
          <button class="system-button" @click="handleSearch">
            <img :src="searchIcon" alt="Buscar" class="sys-icon" />
            Buscar
          </button>
          <div class="menu-divider-h"></div>
          <button class="system-button shutdown" @click="handleShutdown">
            <img :src="powerIcon" alt="Apagar" class="sys-icon" />
            Apagar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'
import { useSystemDialogStore } from '@/stores/systemDialog'
import { useRunLauncherStore } from '@/stores/runLauncher'
import { assetUrl } from '@/utils/assetUrl'

const windowsStore = useWindowsStore()
const dialog = useSystemDialogStore()
const runLauncher = useRunLauncherStore()
const documentsIcon = assetUrl('icons/documents.svg')
const controlPanelIcon = assetUrl('icons/control-panel.svg')
const searchIcon = assetUrl('icons/search.svg')
const powerIcon = assetUrl('icons/power.svg')

const recentPrograms = windowsStore.windows.map((windowItem) => ({
  id: windowItem.id,
  name: windowItem.title,
  icon: windowItem.icon,
}))

const openProgram = (windowId) => {
  windowsStore.toggleWindow(windowId)
  windowsStore.closeStartMenu()
}

const handleDocuments = async () => {
  windowsStore.toggleWindow('documents')
  windowsStore.closeStartMenu()
}

const handleControl = async () => {
  await dialog.alert({
    title: 'Panel de Control',
    message: 'Este panel está en construcción. Se personalizará próximamente.',
  })
  windowsStore.closeStartMenu()
}

const handleSearch = () => {
  runLauncher.open()
  windowsStore.closeStartMenu()
}

const handleShutdown = async () => {
  const confirmShutdown = await dialog.confirm({
    title: 'Apagar sistema',
    message: '¿Estás seguro de que deseas apagar?',
  })
  if (confirmShutdown) {
    windowsStore.beginShutdown()
  }
}
</script>

<style scoped>
.start-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
}

.start-menu {
  position: fixed;
  bottom: 28px;
  left: 0;
  width: 360px;
  background: #f2f7ff;
  border: 2px solid;
  border-color: #ffffff #3f6ea8 #3f6ea8 #ffffff;
  z-index: 9998;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
}

.start-menu-header {
  background: linear-gradient(90deg, #1f57a6 0%, #2f7bd6 45%, #2a69bf 100%);
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: linear-gradient(180deg, #ffcf7d, #f3a33e);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #5f3200;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-name {
  font-weight: bold;
}

.user-subname {
  font-size: 10px;
  opacity: 0.92;
}

.start-menu-content {
  display: flex;
  flex-direction: row;
  min-height: 300px;
  flex: 1;
}

.programs-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 6px;
  background: #fff;
}

.menu-section-title {
  font-size: 10px;
  font-weight: 700;
  color: #2d4f7f;
  padding: 3px 6px 6px;
  text-transform: uppercase;
  letter-spacing: 0.25px;
}

.program-button {
  background: transparent;
  border: none;
  padding: 6px 8px;
  text-align: left;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
}

.program-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.program-button:hover {
  background: linear-gradient(90deg, #000080, #1084d7);
  color: white;
}

.menu-divider {
  width: 1px;
  background: linear-gradient(180deg, #d8e6fb 0%, #8eb1e1 50%, #d8e6fb 100%);
}

.system-column {
  width: 148px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 6px;
  background: linear-gradient(180deg, #deebfb 0%, #cddff6 100%);
}

.system-button {
  background: transparent;
  border: none;
  padding: 6px 8px;
  text-align: left;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sys-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.system-button:hover {
  background: linear-gradient(90deg, #000080, #1084d7);
  color: white;
}

.menu-divider-h {
  height: 1px;
  background: linear-gradient(90deg, #aac4e6 0%, #6f97cd 50%, #aac4e6 100%);
  margin: 4px 0;
}

.system-button.shutdown {
  font-weight: bold;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.15s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
