<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="dialogStore.isOpen" class="dialog-overlay" @click="onOverlayClick">
        <div class="dialog-window" role="dialog" aria-modal="true" @click.stop>
          <div class="dialog-titlebar">
            <span class="title-bar-text">{{ dialogStore.title }}</span>
            <div class="title-bar-controls">
              <button
                class="title-btn close-btn"
                @click.stop="cancel"
                aria-label="Close"
                title="Cerrar"
              ></button>
            </div>
          </div>

          <div class="dialog-body">
            <img :src="dialogIcon" alt="Sistema" class="dialog-icon" />
            <p>{{ dialogStore.message }}</p>
          </div>

          <div class="dialog-actions">
            <button v-if="dialogStore.type === 'confirm'" @click="cancel">Cancelar</button>
            <button @click="accept">{{ dialogStore.type === 'confirm' ? 'Aceptar' : 'OK' }}</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { useSystemDialogStore } from '@/stores/systemDialog'
import { xpIcon } from '@/utils/xpIcons'

const dialogStore = useSystemDialogStore()
const dialogIcon = xpIcon('messenger')

const accept = () => {
  dialogStore.close(true)
}

const cancel = () => {
  dialogStore.close(false)
}

const onOverlayClick = () => {
  if (dialogStore.type === 'confirm') {
    cancel()
    return
  }

  accept()
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 20000;
  display: grid;
  place-items: center;
}

.dialog-window {
  width: min(380px, calc(100vw - 20px));
  background: #ece9d8;
  box-shadow: inset 0 0 0 1px #0831d9, 0 4px 12px rgba(16, 63, 154, 0.34);
  border-radius: 8px 7px 0 0;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  overflow: hidden;
}

.dialog-titlebar {
  display: flex;
  align-items: center;
  user-select: none;
  height: 28px;
  padding: 3px 5px 3px 3px;
  background: var(--win-title-bg);
  border-top: 1px solid #0831d9;
  border-left: 1px solid #0831d9;
  border-right: 1px solid #001ea0;
  border-radius: 8px 7px 0 0;
}

.title-bar-text {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  color: #fff;
  font-size: var(--font-lg);
  font-weight: 700;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.45);
}

.title-bar-controls {
  display: flex;
  align-items: center;
  gap: 1px;
}

.dialog-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px 8px;
}

.dialog-icon {
  width: 24px;
  height: 24px;
}

.dialog-body p {
  margin: 0;
  line-height: 1.45;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 8px 10px 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.14s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
