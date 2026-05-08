<template>
  <div class="doc-pdf-preview">
    <div class="doc-pdf-shell">
      <transition name="preview-fade" mode="out-in">
        <div v-if="error" key="pdf-error" class="preview-unavailable">
          <p class="doc-meta">{{ error }}</p>
          <div class="doc-actions">
            <slot name="fallback-actions" />
          </div>
        </div>
        <div v-else-if="!loading && !pdf" key="pdf-loading" class="preview-status">
          Cargando documento…
        </div>
        <VuePDF
          v-else
          key="pdf-viewer"
          :pdf="pdf"
          :page="currentPage"
          :scale="scale"
          class="doc-pdf-viewer"
          :style="{ maxHeight: `${maxHeight}px` }"
          @onDocumentLoad="onDocumentLoad"
          @onPageLoad="onPageLoad"
          @rendered="onPageRendered"
          @error="onError"
        />
      </transition>
    </div>

    <div v-if="!error && pageCount > 1" class="doc-pdf-controls" role="navigation" aria-label="Navegación de páginas">
      <button
        class="xp-tool-btn"
        :disabled="currentPage <= 1"
        @click="prevPage"
        aria-label="Página anterior"
      >
        &lt;
      </button>
      <span class="pdf-page-info" aria-live="polite">{{ currentPage }} / {{ pageCount }}</span>
      <button
        class="xp-tool-btn"
        :disabled="currentPage >= pageCount"
        @click="nextPage"
        aria-label="Página siguiente"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  maxHeight: {
    type: Number,
    default: 460,
  },
})

const emit = defineEmits(['load', 'error'])

const currentPage = ref(1)
const pageCount = ref(0)
const error = ref('')
const loading = ref(true)
const scale = ref(1)

const { pdf, loaded, error: pdfError } = usePDF(props.url)

watch(loaded, (val) => {
  if (val) {
    loading.value = false
  }
})

watch(pdfError, (err) => {
  if (err) {
    error.value = 'No se pudo cargar el PDF.'
    loading.value = false
    emit('error', error.value)
  }
})

const onDocumentLoad = ({ totalPages }) => {
  pageCount.value = totalPages
  loading.value = false
}

const onPageLoad = () => {
  loading.value = false
}

const onPageRendered = () => {
  loading.value = false
  emit('load')
}

const onError = (err) => {
  error.value = err?.message || 'No se pudo renderizar el PDF.'
  loading.value = false
  emit('error', error.value)
}

const prevPage = () => {
  if (currentPage.value <= 1) return
  currentPage.value--
}

const nextPage = () => {
  if (currentPage.value >= pageCount.value) return
  currentPage.value++
}

watch(
  () => props.url,
  () => {
    loading.value = true
    error.value = ''
    currentPage.value = 1
    pageCount.value = 0
  }
)
</script>

<style scoped>
.doc-pdf-preview {
  display: grid;
  gap: 6px;
}

.doc-pdf-shell {
  border: 1px solid #7f9db9;
  background: #fff;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  max-height: calc(v-bind(maxHeight) * 1px + 8px);
  min-height: 120px;
}

/* VuePDF .page no desborda el contenedor */
.doc-pdf-shell :deep(.page) {
  display: block !important;
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}

.doc-pdf-viewer {
  display: block;
  max-width: 100%;
  height: auto;
  background: white;
}

.doc-pdf-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pdf-page-info {
  font-size: 10px;
  color: #475d7d;
  min-width: 40px;
  text-align: center;
}



.preview-unavailable {
  border: 1px dashed #7f9db9;
  background: #f8fbff;
  padding: 10px;
  display: grid;
  gap: 8px;
  width: 100%;
  min-height: 120px;
  align-items: center;
  justify-items: center;
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.18s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

.preview-status {
  font-size: 11px;
  color: #6b82a8;
  padding: 8px 0;
  display: block;
  text-align: center;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
