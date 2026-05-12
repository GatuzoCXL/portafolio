<template>
  <div class="mobile-docs">
    <p v-if="loading" class="docs-loading">Cargando contenido...</p>
    <template v-else>
      <section class="docs-card">
        <h2 class="docs-heading">Curriculum Vitae</h2>
        <div v-if="documents.cv?.url" class="cv-card">
          <div class="cv-info">
            <span class="cv-title">{{ documents.cv.title || 'CV' }}</span>
            <span v-if="documents.cv.updatedAt" class="cv-date">{{ documents.cv.updatedAt }}</span>
          </div>
          <div class="cv-actions">
            <button class="doc-btn" @click="openPreview(documents.cv.url, documents.cv.title || 'CV')">
              Ver
            </button>
            <a :href="downloadUrl(documents.cv.url)" target="_blank" rel="noopener noreferrer" class="doc-btn doc-btn--outline" download>
              Descargar
            </a>
          </div>
        </div>
        <p v-else class="docs-empty">No hay CV publicado.</p>
      </section>

      <section class="docs-card">
        <h2 class="docs-heading">Certificaciones</h2>
        <div v-if="certificates.length" class="cert-list">
          <article v-for="cert in certificates" :key="cert.id || cert.url" class="cert-item">
            <div class="cert-thumb">
              <img v-if="cert.thumbnail" :src="cert.thumbnail" :alt="cert.title" />
              <span v-else class="cert-thumb-placeholder">PDF</span>
            </div>
            <div class="cert-info">
              <strong class="cert-name">{{ cert.title }}</strong>
              <span class="cert-meta">{{ cert.issuer }} &middot; {{ cert.date }}</span>
            </div>
            <div class="cert-actions">
              <button class="doc-btn doc-btn--sm" @click="openPreview(cert.url, cert.title || 'Certificado')">Ver</button>
              <a :href="downloadUrl(cert.url)" target="_blank" rel="noopener noreferrer" class="doc-btn doc-btn--sm doc-btn--outline" download>Descargar</a>
            </div>
          </article>
        </div>
        <p v-else class="docs-empty">Sin certificados cargados.</p>
      </section>

      <p v-if="error" class="docs-error">{{ error }}</p>
    </template>

    <Teleport to="body">
      <div
        v-if="showPreview"
        class="mobile-preview-overlay"
        role="dialog"
        :aria-label="`Vista previa: ${previewTitle}`"
        @click.self="closePreview"
      >
        <div class="mobile-preview-sheet">
          <div class="mobile-preview-header">
            <span class="mobile-preview-title">{{ previewTitle }}</span>
            <button class="mobile-preview-close" @click="closePreview" aria-label="Cerrar">×</button>
          </div>
          <div class="mobile-preview-body">
            <div v-if="previewError" class="mobile-preview-error">
              <p>{{ previewError }}</p>
              <a :href="previewUrl" target="_blank" rel="noopener noreferrer" class="mobile-preview-fallback">
                Abrir en nueva pestaña
              </a>
            </div>
            <div v-else-if="previewUrl" class="mobile-pdf-wrap">
              <DocumentPdfPreview
                :key="`mobile-pdf-${previewUrl}`"
                :url="previewUrl"
                :title="previewTitle"
                :max-height="800"
                @error="onPreviewError"
              />
            </div>
          </div>
          <div class="mobile-preview-footer">
            <a :href="previewUrl" target="_blank" rel="noopener noreferrer" class="mobile-preview-link">
              Abrir en nueva pestaña
            </a>
            <a
              :href="downloadUrl(previewUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="mobile-preview-link"
              download
            >
              Descargar
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { downloadUrl, pdfProxyUrl, isPdfUrl } from '@/utils/assetUrl'
import DocumentPdfPreview from '@/components/apps/DocumentPdfPreview.vue'

const { documents, loadContent, loading, loaded, error } = usePortfolioContent()

const certificates = computed(() => documents.value?.certificates || [])

const previewUrl = ref('')
const previewTitle = ref('')
const previewError = ref('')
const showPreview = ref(false)

const openPreview = (url, title) => {
  if (!url) return
  const resolved = isPdfUrl(url) ? pdfProxyUrl(url) : url
  previewUrl.value = resolved
  previewTitle.value = title || 'Documento'
  previewError.value = ''
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  window.setTimeout(() => {
    previewUrl.value = ''
    previewTitle.value = ''
    previewError.value = ''
  }, 300)
}

const onPreviewError = (msg) => {
  previewError.value = msg || 'No se pudo cargar el documento.'
}

onMounted(() => {
  loadContent()
})

// Re-fetch on remount if content is still loading (API response pending)
watch(loading, (isLoading) => {
  if (!isLoading && !loaded.value) {
    loadContent()
  }
})
</script>

<style scoped>
.mobile-docs {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #1a1a1a;
  min-height: 100%;
}

.docs-card {
  background: #252525;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.docs-heading {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #8ecf32;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cv-card {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cv-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cv-title {
  font-size: 14px;
  font-weight: 600;
  color: #f2eef7;
}

.cv-date {
  font-size: 11px;
  color: #8e8e8e;
}

.cv-actions {
  display: flex;
  gap: 8px;
}

.doc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: #8ecf32;
  color: #0d1a06;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.doc-btn:active {
  opacity: 0.7;
}

.doc-btn--outline {
  background: transparent;
  border: 1.5px solid #8ecf32;
  color: #8ecf32;
}

.doc-btn--sm {
  padding: 5px 10px;
  font-size: 11px;
  border-radius: 6px;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cert-item {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cert-thumb {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  background: #3a3a3a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cert-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cert-thumb-placeholder {
  font-size: 10px;
  font-weight: 700;
  color: #8ecf32;
}

.cert-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cert-name {
  font-size: 12px;
  font-weight: 600;
  color: #f2eef7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cert-meta {
  font-size: 10px;
  color: #8e8e8e;
}

.cert-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.docs-loading {
  margin: 0;
  font-size: 12px;
  color: #8ecf32;
  text-align: center;
  padding: 40px 0;
}

.docs-empty {
  margin: 0;
  font-size: 12px;
  color: #6e6e6e;
  text-align: center;
  padding: 20px 0;
}

.docs-error {
  margin: 0;
  font-size: 11px;
  color: #e07777;
  text-align: center;
}

.mobile-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  z-index: 10000;
}

.mobile-preview-sheet {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.mobile-preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #f2eef7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-preview-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #333;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.mobile-preview-body {
  flex: 1;
  overflow: auto;
  padding: 8px;
  background: #0d0d0d;
  display: flex;
  flex-direction: column;
}

.mobile-preview-error {
  color: #e07777;
  text-align: center;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-preview-fallback {
  color: #8ecf32;
  text-decoration: underline;
  font-size: 13px;
}

.mobile-preview-footer {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #333;
  flex-shrink: 0;
  background: #1a1a1a;
}

.mobile-preview-link {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: #8ecf32;
  color: #0d1a06;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
}

.mobile-preview-body {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.mobile-preview-body::-webkit-scrollbar {
  display: none;
}

.mobile-preview-body .mobile-pdf-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mobile-preview-body :deep(.doc-pdf-shell) {
  border: none;
  background: transparent;
  padding: 0;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
}

.mobile-preview-body :deep(.doc-pdf-viewer) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
}

.mobile-preview-body :deep(.page) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  display: flex !important;
  justify-content: center;
}

.mobile-preview-body :deep(.page canvas),
.mobile-preview-body :deep(.page img) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
}
</style>