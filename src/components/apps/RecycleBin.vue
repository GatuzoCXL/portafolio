<template>
  <div class="recycle-bin-app">
    <ExplorerChrome
      v-model:address="address"
      :suggestions="[]"
      :show-navigation-buttons="false"
      @back="noop"
      @go="noop"
      @forward="noop"
    >
      <template #sidebar>
        <section class="xp-task-group">
          <header class="xp-task-title">Recycle Bin Tasks</header>
          <ul>
            <li><button class="xp-task-link" @click="noop">Empty Recycle Bin</button></li>
            <li><button class="xp-task-link" @click="noop">Restore all items</button></li>
          </ul>
        </section>
      </template>

      <div class="recycle-bin">
        <div class="bin-empty-icon">
          <img :src="binIcon" alt="Papelera vacía" />
        </div>
        <p class="bin-label">La papelera está vacía</p>
      </div>
    </ExplorerChrome>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { assetUrl } from '@/utils/assetUrl'
import ExplorerChrome from '@/components/os/ExplorerChrome.vue'

const binIcon = assetUrl('icons/recycle-bin.svg')
const address = ref('Recycle Bin')

const noop = () => {}
</script>

<style scoped>
.recycle-bin-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.recycle-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: #444;
  font-family: 'MS Sans Serif', Arial, sans-serif;
}

.bin-empty-icon img {
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bin-label {
  font-size: 12px;
}
</style>
