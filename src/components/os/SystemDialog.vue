<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="dialogStore.isOpen" class="dialog-overlay" @click="onOverlayClick">
        <div class="dialog-window" role="dialog" aria-modal="true" @click.stop>
          <div class="dialog-titlebar">
            <span>{{ dialogStore.title }}</span>
            <button class="x" @click="cancel">×</button>
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
import { assetUrl } from '@/utils/assetUrl'

const dialogStore = useSystemDialogStore()
const dialogIcon = assetUrl('icons/messenger.svg')

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
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.35);
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.dialog-titlebar {
  height: 24px;
  background: linear-gradient(90deg, #0a4ca0 0%, #2f7ad2 45%, #2a67be 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 0 8px;
  font-weight: 700;
}

.x {
  width: 20px;
  height: 18px;
  border: 1px solid #8a241b;
  background: linear-gradient(180deg, #ffae9c 0%, #ef5d4b 45%, #cc2d1f 100%);
  color: #fff;
  line-height: 1;
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
