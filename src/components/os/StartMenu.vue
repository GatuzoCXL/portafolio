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
          <div class="user-icon">👤</div>
          <span class="user-name">Usuario</span>
        </div>
      </div>

      <div class="start-menu-content">
        <div class="programs-column">
          <button
            v-for="program in recentPrograms"
            :key="program.id"
            class="program-button"
            @click="openProgram(program.id)"
          >
            {{ program.icon }} {{ program.name }}
          </button>
        </div>

        <div class="menu-divider"></div>

        <div class="system-column">
          <button class="system-button" @click="handleDocuments">
            📄 Mis Documentos
          </button>
          <button class="system-button" @click="handleControl">
            ⚙️ Panel de Control
          </button>
          <button class="system-button" @click="handleSearch">
            🔍 Buscar
          </button>
          <div class="menu-divider-h"></div>
          <button class="system-button shutdown" @click="handleShutdown">
            🔌 Apagar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()

const recentPrograms = [
  { id: 'my-pc', name: 'Mi PC', icon: '🖥️' },
  { id: 'internet-explorer', name: 'Internet Explorer', icon: '🌐' },
  { id: 'messenger', name: 'MSN Messenger', icon: '💬' },
]

const openProgram = (windowId) => {
  windowsStore.toggleWindow(windowId)
  windowsStore.closeStartMenu()
}

const handleDocuments = () => {
  alert('Mis Documentos')
  windowsStore.closeStartMenu()
}

const handleControl = () => {
  alert('Panel de Control')
  windowsStore.closeStartMenu()
}

const handleSearch = () => {
  alert('Buscar')
  windowsStore.closeStartMenu()
}

const handleShutdown = () => {
  const confirm = window.confirm('¿Estás seguro de que deseas apagar?')
  if (confirm) {
    alert('Sistema apagado. Gracias por visitar.')
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
  width: 278px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  z-index: 9998;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
}

.start-menu-header {
  background: linear-gradient(90deg, #34529b, #4a7fbf);
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  font-size: 24px;
}

.user-name {
  font-weight: bold;
}

.start-menu-content {
  display: flex;
  flex-direction: column;
  padding: 2px;
  flex: 1;
}

.programs-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.program-button {
  background: transparent;
  border: none;
  padding: 4px 8px;
  text-align: left;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
}

.program-button:hover {
  background: linear-gradient(90deg, #000080, #1084d7);
  color: white;
}

.menu-divider {
  height: 2px;
  background: linear-gradient(90deg, #dfdfdf 0%, #808080 50%, #ffffff 100%);
  margin: 4px 0;
}

.system-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.system-button {
  background: transparent;
  border: none;
  padding: 4px 8px;
  text-align: left;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
}

.system-button:hover {
  background: linear-gradient(90deg, #000080, #1084d7);
  color: white;
}

.menu-divider-h {
  height: 2px;
  background: linear-gradient(90deg, #dfdfdf 0%, #808080 50%, #ffffff 100%);
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
