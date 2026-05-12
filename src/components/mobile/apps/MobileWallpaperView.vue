<script setup>
import { computed } from 'vue'
import { useShellStore } from '@/stores/shell'

const shellStore = useShellStore()

const options = [
  {
    id: 'none',
    label: 'Sin fondo',
    url: null,
  },
  {
    id: 'backrooms-glitch',
    label: 'Backrooms glitch',
    url: 'https://w0.peakpx.com/wallpaper/362/199/HD-wallpaper-backroom-backrooms-colours-dark-door-effect-glitch-tech-unnerving.jpg',
  },
  {
    id: 'endless-mall',
    label: 'Centro comercial infinito',
    url: 'https://imgs.search.brave.com/KwZHQeSRocVhUJjgwWroVqgStiNGuUE4ODzgCTUWyu4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci82NDUv/NjgyL0hELXdhbGxw/YXBlci1lbmRsZXNz/LXdhbG1hcnQtbGlt/aW5hbC1zcGFjZS1i/YWNrcm9vbXMtc2hv/cHBpbmctdGh1bWJu/YWlsLmpwZw',
  },
  {
    id: 'vaporwave-dark',
    label: 'Vaporwave oscuro',
    url: 'https://w0.peakpx.com/wallpaper/362/879/HD-wallpaper-vaporwave-awesome-colours-dark.jpg',
  },
  {
    id: 'amoled-flair',
    label: 'Destello de color AMOLED',
    url: 'https://w0.peakpx.com/wallpaper/713/676/HD-wallpaper-mob-aesthetic-mob-psycho-100-vaporwave.jpg',
  },
]

const currentUrl = computed(() => shellStore.activeMobileWallpaper)

const selectWallpaper = (url) => {
  shellStore.setMobileWallpaper(url)
}

const isSelected = (url) => {
  if (url === null) return currentUrl.value === null
  return currentUrl.value === url
}
</script>

<template>
  <div class="mobile-wallpaper-view">
    <p class="wallpaper-hint">Selecciona un fondo para la pantalla de inicio.</p>

    <div class="wallpaper-grid">
      <button
        v-for="option in options"
        :key="option.id"
        class="wallpaper-card"
        :class="{ 'wallpaper-card--active': isSelected(option.url) }"
        :aria-label="option.label"
        @click="selectWallpaper(option.url)"
      >
        <div class="wallpaper-thumb">
          <img
            v-if="option.url"
            :src="option.url"
            :alt="option.label"
            loading="lazy"
          />
          <div v-else class="wallpaper-thumb--empty"></div>
        </div>
        <span class="wallpaper-label">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mobile-wallpaper-view {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #1a1a1a;
  min-height: 100%;
}

.wallpaper-hint {
  margin: 0;
  font-size: 13px;
  color: #8e8e8e;
  line-height: 1.4;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.wallpaper-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #252525;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  text-align: left;
  min-height: 120px;
}

.wallpaper-card--active {
  border-color: #13aeea;
}

.wallpaper-card:active {
  opacity: 0.8;
}

.wallpaper-thumb {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  background: #000000;
}

.wallpaper-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wallpaper-thumb--empty {
  width: 100%;
  height: 100%;
  background: #000000;
}

.wallpaper-label {
  font-size: 12px;
  color: #f2eef7;
  font-weight: 600;
  line-height: 1.2;
}

@media (max-width: 360px) {
  .wallpaper-grid {
    grid-template-columns: 1fr;
  }
}
</style>
