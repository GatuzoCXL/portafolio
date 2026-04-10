<template>
  <div class="project-detail">
    <div v-if="project" class="detail-content">
      <div class="detail-header">
        <h2>{{ project.name }}</h2>
        <p class="detail-description">{{ project.fullDescription }}</p>
      </div>

      <div class="detail-gallery">
        <div v-if="project.screenshots && project.screenshots.length" class="gallery-section">
          <h3>Capturas de pantalla</h3>
          <div class="screenshots">
            <img
              v-for="(screenshot, idx) in project.screenshots"
              :key="`screenshot-${idx}`"
              :src="screenshot"
              :alt="`Captura ${idx + 1}`"
              class="screenshot"
              @click="openImageViewer(idx)"
            />
          </div>
        </div>

        <div v-if="project.videos && project.videos.length" class="gallery-section">
          <h3>Demostraciones</h3>
          <div class="videos">
            <iframe
              v-for="(video, idx) in project.videos"
              :key="`video-${idx}`"
              :src="video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-frame"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="detail-tech">
        <h3>Tecnologías</h3>
        <div class="tech-list">
          <span v-for="tech in project.tech" :key="tech" class="tech-item">
            {{ tech }}
          </span>
        </div>
      </div>

      <div class="detail-links">
        <h3>Enlaces</h3>
        <div class="links-list">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            GitHub
          </a>
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            Demo en vivo
          </a>
          <a
            v-if="project.release"
            :href="project.release"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            Descargar
          </a>
        </div>
      </div>
    </div>

    <Teleport v-if="currentScreenshot" to="body">
      <div class="image-viewer" @click="closeImageViewer">
        <div class="image-viewer-content" @click.stop>
          <button class="nav-button close-button" @click="closeImageViewer" aria-label="Cerrar">
            <span></span>
          </button>

          <button class="nav-button prev-button" @click="showPreviousImage" aria-label="Anterior">
            <span></span>
          </button>

          <img :src="currentScreenshot" :alt="project.name" />

          <button class="nav-button next-button" @click="showNextImage" aria-label="Siguiente">
            <span></span>
          </button>

          <p class="image-counter">
            Imagen {{ selectedImageIndex + 1 }} de {{ project.screenshots.length }} ·
            Flechas / A-D
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
})

const selectedImageIndex = ref(null)
const { getProjectById, loadContent } = usePortfolioContent()
const project = ref(null)

const currentScreenshot = computed(() => {
  if (!project.value || selectedImageIndex.value === null) {
    return null
  }

  return project.value.screenshots[selectedImageIndex.value] || null
})

const openImageViewer = (index) => {
  selectedImageIndex.value = index
}

const closeImageViewer = () => {
  selectedImageIndex.value = null
}

const showNextImage = () => {
  if (!project.value?.screenshots?.length || selectedImageIndex.value === null) {
    return
  }

  selectedImageIndex.value = (selectedImageIndex.value + 1) % project.value.screenshots.length
}

const showPreviousImage = () => {
  if (!project.value?.screenshots?.length || selectedImageIndex.value === null) {
    return
  }

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + project.value.screenshots.length) % project.value.screenshots.length
}

const handleViewerKeyboard = (event) => {
  if (selectedImageIndex.value === null) {
    return
  }

  const key = event.key.toLowerCase()

  if (event.key === 'ArrowRight' || key === 'd') {
    event.preventDefault()
    showNextImage()
    return
  }

  if (event.key === 'ArrowLeft' || key === 'a') {
    event.preventDefault()
    showPreviousImage()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeImageViewer()
  }
}

onMounted(() => {
  loadContent().then(() => {
    project.value = getProjectById(props.projectId)
  })
  window.addEventListener('keydown', handleViewerKeyboard)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleViewerKeyboard)
})
</script>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
  overflow-y: auto;
  font-family: 'MS Sans Serif', Arial, sans-serif;
}

.detail-content {
  padding: 12px;
  flex: 1;
  overflow-y: auto;
}

.detail-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

.detail-header h2 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.detail-description {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: #333;
}

.gallery-section {
  margin-bottom: 16px;
}

.gallery-section h3 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

.screenshots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.screenshot {
  width: 100%;
  height: auto;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: pointer;
  transition: transform 0.2s;
}

.screenshot:hover {
  transform: scale(1.05);
  border-color: #ffffff #404040 #404040 #ffffff;
}

.videos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.video-frame {
  width: 100%;
  height: 180px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

.detail-tech,
.detail-links {
  margin-bottom: 16px;
  padding: 12px;
  background: #dfdfdf;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

.detail-tech h3,
.detail-links h3 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-item {
  background: #000080;
  color: white;
  padding: 3px 8px;
  font-size: 9px;
  border-radius: 2px;
  white-space: nowrap;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.link-button {
  padding: 6px 12px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  text-decoration: none;
  color: #000;
  font-size: 11px;
  text-align: center;
  transition: all 0.1s;
  border-radius: 2px;
  display: inline-block;
}

.link-button:hover {
  background: #dfdfdf;
}

.link-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.image-viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-content img {
  max-width: 90vw;
  max-height: 82vh;
  border: 3px solid #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.nav-button {
  position: absolute;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button span {
  position: relative;
  display: block;
  width: 10px;
  height: 10px;
}

.close-button span::before,
.close-button span::after {
  content: '';
  position: absolute;
  left: 1px;
  top: 4px;
  width: 8px;
  height: 2px;
  background: #000;
}

.close-button span::before {
  transform: rotate(45deg);
}

.close-button span::after {
  transform: rotate(-45deg);
}

.prev-button span::before,
.next-button span::before {
  content: '';
  position: absolute;
  top: 1px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.prev-button span::before {
  left: 2px;
  border-right: 6px solid #000;
}

.next-button span::before {
  right: 2px;
  border-left: 6px solid #000;
}

.nav-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.prev-button {
  left: -46px;
  top: 50%;
  transform: translateY(-50%);
}

.next-button {
  right: -46px;
  top: 50%;
  transform: translateY(-50%);
}

.close-button {
  right: -8px;
  top: -44px;
}

.image-counter {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 11px;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  padding: 4px 8px;
  border-radius: 3px;
}
</style>
