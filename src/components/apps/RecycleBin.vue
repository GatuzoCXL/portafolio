<template>
  <div class="recycle-bin">
    <div class="bin-empty-icon">
      <img :src="binIcon" alt="Papelera vacía" />
    </div>
    <p class="bin-label">La papelera está vacía</p>
  </div>
</template>

<script setup>
import { assetUrl } from '@/utils/assetUrl'
const binIcon = assetUrl('icons/recycle-bin.svg')
</script>

<style scoped>
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