<template>
  <div class="documents-app xp-window-frame">
    <div class="xp-explorer-chrome">
      <div class="xp-menu-row">
        <span class="xp-menu-item">File</span>
        <span class="xp-menu-item">Edit</span>
        <span class="xp-menu-item">View</span>
        <span class="xp-menu-item">Favorites</span>
        <span class="xp-menu-item">Tools</span>
        <span class="xp-menu-item">Help</span>
      </div>
      <div class="xp-toolbar-row">
        <button class="xp-tool-btn back" @click="goBack">Back</button>
        <button class="xp-tool-btn search" @click="focusAddress">Search</button>
        <button class="xp-tool-btn folders">Folders</button>
      </div>
      <div class="xp-address-row">
        <span class="xp-address-label">Address</span>
        <div class="xp-suggest-wrapper">
          <input
            ref="addressRef"
            v-model="address"
            class="xp-address-input"
            type="text"
            @focus="showSuggestions = true"
            @blur="hideSuggestionsSoon"
            @keydown.down.prevent="moveSuggestion(1)"
            @keydown.up.prevent="moveSuggestion(-1)"
            @keydown.enter.prevent="handleEnter"
            @keydown.tab.prevent="completeWithHighlighted"
            @keydown.esc.prevent="showSuggestions = false"
          />
          <div v-if="showSuggestions && filteredSuggestions.length" class="xp-suggestions">
            <div
              v-for="(item, idx) in filteredSuggestions"
              :key="item"
              class="xp-suggestion-item"
              :class="{ active: idx === selectedSuggestionIndex }"
              @mouseenter="selectedSuggestionIndex = idx"
              @mousedown.prevent="pickSuggestion(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <button class="xp-tool-btn go-btn" @click="runSearch">Go</button>
        <button class="xp-tool-btn xp-address-jump" @click="jumpToProjects">Proy</button>
      </div>
    </div>

    <div class="xp-page-shell">
    <aside class="xp-sidebar-panel">
      <section class="xp-task-group">
        <header class="xp-task-title">File and Folder Tasks</header>
        <ul>
          <li><button class="xp-task-link" @click="openCv">Abrir CV</button></li>
          <li><button class="xp-task-link" @click="focusCertificates">Ver certificados</button></li>
          <li><button class="xp-task-link" @click="clearSearch">Actualizar documentos</button></li>
        </ul>
      </section>

      <section class="xp-task-group">
        <header class="xp-task-title">Ubicaciones</header>
        <ul>
          <li><button class="xp-task-link" @click="openCv">Mi CV</button></li>
          <li><button class="xp-task-link" @click="focusCertificates">Mis Certificados</button></li>
          <li><button class="xp-task-link" @click="jumpToProjects">Proyectos</button></li>
        </ul>
      </section>

        <section class="xp-task-group">
        <header class="xp-task-title">Detalles</header>
        <ul>
          <template v-if="selectedCertificate">
            <li>Formato: {{ selectedCertificateTypeLabel }}</li>
            <li>Origen: Supabase</li>
          </template>
          <template v-else-if="documents.cv">
            <li>CV: {{ documents.cv.title || 'CV' }}</li>
            <li>Formato: {{ cvTypeLabel }}</li>
          </template>
          <template v-else>
            <li>Selecciona un certificado para ver sus detalles.</li>
          </template>
        </ul>
      </section>
    </aside>

    <main class="xp-main-panel">
      <fieldset class="doc-section">
        <legend>Curriculum Vitae</legend>

        <div class="doc-card" ref="cvPreviewRef">
          <div class="doc-head doc-head--prominent">
            <div class="doc-head-left">
              <span class="doc-title">{{ documents.cv?.title || 'CV' }}</span>
              <p class="doc-meta" v-if="documents.cv?.updatedAt">Actualizado: {{ documents.cv.updatedAt }}</p>
            </div>
            <span class="format-badge" :class="badgeToneClass(cvTypeLabel)">{{ cvTypeLabel }}</span>
          </div>
          <div v-if="showingCvPreview && cvPreviewUrl" class="doc-preview-shell">
            <transition name="preview-fade" mode="out-in">
              <DocumentPdfPreview
                v-if="isCvPdf && cvPreviewUrl"
                :key="`cv-pdf-${cvPreviewUrl}`"
                :url="cvPreviewUrl"
                :title="documents.cv?.title"
                :max-height="460"
                @load="onCvPreviewLoaded"
                @error="onCvPreviewError"
              >
                <template #fallback-actions>
                  <a :href="documents.cv.url" target="_blank" rel="noopener noreferrer" class="doc-link">
                    Abrir en nueva pestaña
                  </a>
                  <a
                    :href="cvDownloadUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="doc-link"
                    :download="cvFileName"
                  >
                    Descargar CV
                  </a>
                </template>
              </DocumentPdfPreview>
              <img
                v-else-if="isCvImage"
                :key="`cv-image-${cvPreviewUrl}`"
                class="doc-preview image"
                :class="{ 'is-loading': cvPreviewLoading }"
                :src="cvPreviewUrl"
                :alt="documents.cv?.title || 'Vista previa CV'"
                loading="lazy"
                @load="onCvPreviewLoaded"
              />
              <div v-else key="cv-unavailable" class="preview-unavailable">
                <p v-if="cvInlineError" class="doc-meta">{{ cvInlineError }}</p>
                <p class="doc-meta">No hay preview embebido para este formato.</p>
                <div class="doc-actions">
                  <a :href="documents.cv.url" target="_blank" rel="noopener noreferrer" class="doc-link">
                    Abrir en nueva pestaña
                  </a>
                  <a
                    :href="cvDownloadUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="doc-link"
                    :download="cvFileName"
                  >
                    Descargar CV
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="documents.cv?.url" class="doc-actions">
            <button class="doc-link doc-link-btn" @click="openCvOverlay">Ver aquí</button>
            <a :href="documents.cv.url" target="_blank" rel="noopener noreferrer" class="doc-link">
              Abrir en nueva pestaña
            </a>
            <a
              :href="cvDownloadUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="doc-link"
              :download="cvFileName"
            >
              Descargar CV
            </a>
            <button class="doc-link doc-link-btn" @click="copyLink(documents.cv.url, 'Enlace del CV copiado')">
              Copiar enlace
            </button>
          </div>
          <p v-else class="doc-empty empty-state-box">Aún no se ha publicado nada.</p>
        </div>
      </fieldset>

      <fieldset class="doc-section">
        <legend>Certificados</legend>

        <div v-if="filteredCertificates.length" class="cert-grid" ref="certsRef">
          <article v-for="cert in filteredCertificates" :key="cert.id || cert.url" class="cert-card" :class="{ 'cert-card--selected': certKey(cert) === selectedCertificateKey }">
            <span class="format-badge cert" :class="badgeToneClass(certificateTypeLabel(cert))">{{
              certificateTypeLabel(cert)
            }}</span>
            <img :src="certificateThumbnail(cert)" :alt="cert.title" @click="showCertificatePreview(cert)" />
            <h4>{{ cert.title }}</h4>
            <p>{{ cert.issuer }} · {{ cert.date }}</p>
              <div class="cert-actions">
                <button class="doc-link doc-link-btn" @click="openCertOverlay(cert)">Ver aquí</button>
                <a :href="cert.url" target="_blank" rel="noopener noreferrer">Abrir en nueva pestaña</a>
               <a
                 :href="toDownloadUrl(cert.url)"
                 target="_blank"
                 rel="noopener noreferrer"
                 :download="`${(cert.title || 'certificado').replace(/\s+/g, '-').toLowerCase()}.pdf`"
                >
                  Descargar
                </a>
                <button
                  class="doc-link doc-link-btn"
                  @click="copyLink(cert.url, `Enlace de ${cert.title || 'certificado'} copiado`)">
                  Copiar enlace
                </button>
               </div>
             </article>

          <article v-if="selectedCertificate" class="cert-preview-panel">
            <div class="doc-head">
              <h4>Vista previa: {{ selectedCertificate.title }}</h4>
              <span class="format-badge" :class="badgeToneClass(selectedCertificateTypeLabel)">{{
                selectedCertificateTypeLabel
              }}</span>
            </div>
            <transition name="preview-fade" mode="out-in">
              <DocumentPdfPreview
                v-if="isSelectedCertificatePdf && selectedCertificatePreviewUrl"
                :key="`cert-pdf-${selectedCertificatePreviewUrl}`"
                :url="selectedCertificatePreviewUrl"
                :title="selectedCertificate.title"
                :max-height="460"
                @load="onSelectedCertificatePreviewLoaded"
                @error="onSelectedCertificatePreviewError"
              >
                <template #fallback-actions>
                  <a :href="selectedCertificate.url" target="_blank" rel="noopener noreferrer" class="doc-link">
                    Abrir en nueva pestaña
                  </a>
                  <a
                    :href="toDownloadUrl(selectedCertificate.url)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="doc-link"
                    :download="`${(selectedCertificate.title || 'certificado').replace(/\s+/g, '-').toLowerCase()}.pdf`"
                  >
                    Descargar
                  </a>
                </template>
              </DocumentPdfPreview>

              <img
                v-else-if="isSelectedCertificateImage"
                :key="`cert-image-${selectedCertificatePreviewUrl}`"
                class="doc-preview image"
                :class="{ 'is-loading': selectedCertificatePreviewLoading }"
                :src="selectedCertificatePreviewUrl"
                :alt="selectedCertificate.title"
                loading="lazy"
                @load="onSelectedCertificatePreviewLoaded"
              />

              <div v-else key="cert-unavailable" class="preview-unavailable">
                <p v-if="selectedCertificateInlineError" class="doc-meta">{{ selectedCertificateInlineError }}</p>
                <p class="doc-meta">No hay preview embebido para este certificado.</p>
                <p class="doc-empty">Puedes abrirlo en nueva pestaña o descargarlo desde aquí.</p>
              </div>
            </transition>

            <div class="doc-actions" v-if="selectedCertificate.url">
              <button class="doc-link doc-link-btn" @click="openCertOverlay(selectedCertificate)">
                Ver aquí
              </button>
              <a :href="selectedCertificate.url" target="_blank" rel="noopener noreferrer" class="doc-link">
                Abrir en nueva pestaña
              </a>
              <a
                :href="toDownloadUrl(selectedCertificate.url)"
                target="_blank"
                rel="noopener noreferrer"
                class="doc-link"
                :download="`${(selectedCertificate.title || 'certificado').replace(/\s+/g, '-').toLowerCase()}.pdf`"
              >
                Descargar
              </a>
              <button
                class="doc-link doc-link-btn"
                @click="copyLink(selectedCertificate.url, `Enlace de ${selectedCertificate.title} copiado`)">
                Copiar enlace
              </button>
            </div>
          </article>
        </div>

        <p v-else class="doc-empty empty-state-box">No hay certificados cargados por el momento.</p>
      </fieldset>

      <p v-if="actionFeedback.text" class="feedback-message" :class="actionFeedback.type">
        {{ actionFeedback.text }}
      </p>
    </main>
    </div>

    <Teleport to="body">
      <div
        v-if="viewerDocumentUrl"
        ref="viewerOverlayRef"
        class="viewer-overlay"
        role="dialog"
        :aria-label="`Vista previa: ${viewerDocumentTitle}`"
        @click.self="closeViewerOverlay"
      >
        <div class="viewer-modal">
          <div class="viewer-titlebar">
            <span class="viewer-title">{{ viewerDocumentTitle || 'Documento' }}</span>
            <div class="viewer-titlebar-controls">
              <button
                class="title-btn close-btn"
                @click="closeViewerOverlay"
                aria-label="Cerrar"
              >×</button>
            </div>
          </div>
          <div class="viewer-body">
            <p v-if="viewerError" class="preview-unavailable">
              <span class="doc-meta">{{ viewerError }}</span>
            </p>
            <DocumentPdfPreview
              v-else-if="viewerDocumentUrl"
              :key="`overlay-pdf-${viewerDocumentUrl}`"
              :url="viewerDocumentUrl"
              :title="viewerDocumentTitle"
              :max-height="600"
              @load="onViewerLoaded"
              @error="onViewerError"
            />
          </div>
          <div class="viewer-footer">
            <a
              :href="viewerDocumentUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="doc-link"
            >
              Abrir en nueva pestaña
            </a>
            <a
              :href="downloadUrl(viewerDocumentUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="doc-link"
              :download="(viewerDocumentTitle || 'documento').replace(/\s+/g, '-').toLowerCase()"
            >
              Descargar
            </a>
            <button class="doc-link doc-link-btn" @click="copyLink(viewerDocumentUrl, 'Enlace copiado')">
              Copiar enlace
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'
import { assetUrl, downloadUrl, isImageUrl, isPdfUrl, extractRawSupabaseUrl, isSupabaseStorageUrl, pdfProxyUrl } from '@/utils/assetUrl'
import DocumentPdfPreview from '@/components/apps/DocumentPdfPreview.vue'

const windowsStore = useWindowsStore()
const { documents, loadContent } = usePortfolioContent()
const address = ref('My Computer\\My Documents')
const previousAddress = ref('')
const searchQuery = ref('')
const certsRef = ref(null)
const cvPreviewRef = ref(null)
const addressRef = ref(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)
const showingCvPreview = ref(true)
const selectedCertificateKey = ref('')
const certificateFallbackThumbnail = assetUrl('icons/documents.svg')
const cvPreviewLoading = ref(true)
const cvInlineError = ref('')
const selectedCertificatePreviewLoading = ref(true)
const selectedCertificateInlineError = ref('')
const actionFeedback = ref({ type: '', text: '' })
const CERT_LAST_SELECTED_KEY = 'xp-documents-last-certificate'
const viewerDocumentUrl = ref('')
const viewerDocumentTitle = ref('')
const viewerError = ref('')
const viewerOverlayRef = ref(null)
let viewerCleanupTimer = null
let feedbackTimer = null

const addressSuggestions = computed(() => {
  const certTerms = (documents.value.certificates || []).map((cert) =>
    `My Computer\\My Documents\\${cert.title}`
  )

  const all = [
    'My Computer\\My Documents',
    'My Computer\\My Documents\\CV',
    'My Computer\\My Documents\\Certificates',
    'Internet Explorer\\Projects',
    ...certTerms,
  ]

  return buildAddressSuggestions(all, address.value, 8)
})

const filteredSuggestions = computed(() => addressSuggestions.value)

const filteredCertificates = computed(() => {
  const certs = documents.value.certificates || []
  if (!searchQuery.value.trim()) return certs

  const term = searchQuery.value.toLowerCase()
  return certs.filter((cert) => {
    const haystack = [cert.title, cert.issuer, cert.date].join(' ').toLowerCase()
    return haystack.includes(term)
  })
})

const cvRawUrl = computed(() => documents.value.cv?.url || '')
const cvPreviewUrl = computed(() => {
  const raw = resolveUrl(cvRawUrl.value)
  if (!raw) return ''
  if (isPdfUrl(raw)) return pdfProxyUrl(raw)
  return raw
})
const isCvPdf = computed(() => isPdfUrl(cvPreviewUrl.value))
const isCvImage = computed(() => isImageUrl(cvPreviewUrl.value))
const cvTypeLabel = computed(() => {
  if (isCvPdf.value) return 'PDF'
  if (isCvImage.value) return 'IMAGEN'
  return 'ARCHIVO'
})
const cvDownloadUrl = computed(() => downloadUrl(cvPreviewUrl.value))
const cvFileName = computed(
  () => `${(documents.value.cv?.title || 'cv').replace(/\s+/g, '-').toLowerCase()}.pdf`
)

const urlRecovery = new Map()

const validateUrl = async (url) => {
  if (!url || urlRecovery.has(url)) return
  urlRecovery.set(url, 'checking')
  try {
    const res = await fetch(url, { method: 'HEAD' })
    urlRecovery.set(url, res.ok ? 'raw' : 'failed')
  } catch {
    urlRecovery.set(url, 'failed')
  }
}

const resolveUrl = (url) => {
  if (!url) return ''
  const status = urlRecovery.get(url)
  if (status === 'failed') {
    const raw = extractRawSupabaseUrl(url)
    return raw || url
  }
  return url
}

const toDownloadUrl = (url) => downloadUrl(resolveUrl(url))

const certKey = (cert) => cert?.id || cert?.url || cert?.title || ''

const selectedCertificate = computed(() => {
  if (!filteredCertificates.value.length) return null
  return (
    filteredCertificates.value.find((cert) => certKey(cert) === selectedCertificateKey.value) ||
    filteredCertificates.value[0]
  )
})

const selectedCertificatePreviewUrl = computed(() => {
  const raw = selectedCertificate.value?.url || ''
  if (isPdfUrl(raw)) return pdfProxyUrl(raw)
  return raw
})
const isSelectedCertificatePdf = computed(() => isPdfUrl(selectedCertificatePreviewUrl.value))
const isSelectedCertificateImage = computed(() => isImageUrl(selectedCertificatePreviewUrl.value))
const selectedCertificateTypeLabel = computed(() => {
  if (isSelectedCertificatePdf.value) return 'PDF'
  if (isSelectedCertificateImage.value) return 'IMAGEN'
  return 'ARCHIVO'
})

const badgeToneClass = (label) => {
  if (label === 'PDF') return 'tone-pdf'
  if (label === 'IMAGEN') return 'tone-image'
  return 'tone-file'
}

const certificateThumbnail = (cert) => cert?.thumbnail || certificateFallbackThumbnail
const certificateTypeLabel = (cert) => {
  if (isPdfUrl(cert?.url)) return 'PDF'
  if (isImageUrl(cert?.url)) return 'IMAGEN'
  return 'ARCHIVO'
}

const showCvPreview = async () => {
  showingCvPreview.value = true
  await nextTick()
  cvPreviewRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const openCvOverlay = () => {
  const raw = cvRawUrl.value
  if (raw) {
    const resolved = isPdfUrl(raw) ? pdfProxyUrl(raw) : raw
    openViewerOverlay(resolved, documents.value.cv?.title || 'CV', isPdfUrl(raw) ? 'pdf' : 'image')
  }
}

const openCertOverlay = (cert) => {
  if (cert?.url) {
    const resolved = isPdfUrl(cert.url) ? pdfProxyUrl(cert.url) : cert.url
    openViewerOverlay(resolved, cert.title || 'Certificado', isPdfUrl(cert.url) ? 'pdf' : 'image')
  }
}

const onCvPreviewError = (msg) => {
  cvInlineError.value = msg
  cvPreviewLoading.value = false
}

const onSelectedCertificatePreviewError = (msg) => {
  selectedCertificateInlineError.value = msg
  selectedCertificatePreviewLoading.value = false
}

const showCertificatePreview = async (cert) => {
  if (!cert) return
  selectedCertificateKey.value = certKey(cert)
  selectedCertificatePreviewLoading.value = true
  await nextTick()
  certsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const onCvPreviewLoaded = () => {
  cvPreviewLoading.value = false
}

const onSelectedCertificatePreviewLoaded = () => {
  selectedCertificatePreviewLoading.value = false
}

const showFeedback = (text, type = 'success') => {
  actionFeedback.value = { type, text }
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => {
    actionFeedback.value = { type: '', text: '' }
  }, 2200)
}

const copyLink = async (url, successText) => {
  if (!url) {
    showFeedback('No hay enlace disponible para copiar.', 'error')
    return
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      showFeedback(successText || 'Enlace copiado.', 'success')
      return
    }

    throw new Error('clipboard-unavailable')
  } catch {
    showFeedback('No se pudo copiar automáticamente. Cópialo manualmente.', 'error')
  }
}

const copyActivePreviewLink = async () => {
  const activeCertificateUrl = selectedCertificate.value?.url
  if (activeCertificateUrl) {
    await copyLink(activeCertificateUrl, `Enlace de ${selectedCertificate.value?.title || 'certificado'} copiado`)
    return
  }

  await copyLink(documents.value.cv?.url, 'Enlace del CV copiado')
}

const handleKeydown = (event) => {
  const isCopyShortcut = (event.ctrlKey || event.metaKey) && event.key?.toLowerCase() === 'c'
  if (!isCopyShortcut) return

  const tag = event.target?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return

  event.preventDefault()
  copyActivePreviewLink()
}

const runSearch = () => {
  previousAddress.value = address.value
  showSuggestions.value = false
  const quickWindow = resolveWindowShortcut(address.value)
  if (quickWindow) {
    windowsStore.openWindow(quickWindow)
    return
  }

  const raw = address.value.replace(/^.*?\\/, '').trim()
  searchQuery.value = raw === 'My Documents' ? '' : raw
}

const clearSearch = () => {
  previousAddress.value = address.value
  searchQuery.value = ''
  address.value = 'My Computer\\My Documents'
}

const focusAddress = async () => {
  await nextTick()
  addressRef.value?.focus()
  addressRef.value?.select?.()
}

const moveSuggestion = (delta) => {
  if (!filteredSuggestions.value.length) return
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value + delta + filteredSuggestions.value.length) %
    filteredSuggestions.value.length
}

const completeWithHighlighted = () => {
  if (!showSuggestions.value || !filteredSuggestions.value.length) return
  const picked = filteredSuggestions.value[selectedSuggestionIndex.value]
  if (picked) {
    address.value = picked
  }
}

const pickSuggestion = (item) => {
  address.value = item
  showSuggestions.value = false
  runSearch()
}

const handleEnter = () => {
  if (showSuggestions.value && filteredSuggestions.value.length) {
    const picked = filteredSuggestions.value[selectedSuggestionIndex.value]
    if (picked) {
      pickSuggestion(picked)
      return
    }
  }

  runSearch()
}

const hideSuggestionsSoon = () => {
  window.setTimeout(() => {
    showSuggestions.value = false
  }, 100)
}

const openCv = () => {
  showCvPreview()
}

const focusCertificates = () => {
  previousAddress.value = address.value
  address.value = 'My Computer\\My Documents\\Certificates'
  certsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goBack = () => {
  if (!previousAddress.value) return
  const current = address.value
  address.value = previousAddress.value
  previousAddress.value = current
  runSearch()
}

const jumpToProjects = () => {
  windowsStore.openWindow('internet-explorer')
}

const openViewerOverlay = (url, title) => {
  viewerDocumentUrl.value = url
  viewerDocumentTitle.value = title
  viewerError.value = ''
  nextTick(() => {
    viewerOverlayRef.value?.classList.add('is-visible')
  })
}

const closeViewerOverlay = () => {
  viewerOverlayRef.value?.classList.remove('is-visible')
  viewerCleanupTimer = window.setTimeout(() => {
    viewerDocumentUrl.value = ''
    viewerDocumentTitle.value = ''
    viewerError.value = ''
  }, 300)
}

const onViewerLoaded = () => {}

const onViewerError = (msg) => {
  viewerError.value = msg || 'No se pudo cargar el documento.'
}

onMounted(() => {
  loadContent().then(() => {
    const urls = []
    if (documents.value.cv?.url) urls.push(documents.value.cv.url)
    ;(documents.value.certificates || []).forEach((cert) => {
      if (cert.url) urls.push(cert.url)
    })
    urls.forEach((url) => {
      if (isSupabaseStorageUrl(url)) validateUrl(url)
    })
  })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  if (viewerCleanupTimer) window.clearTimeout(viewerCleanupTimer)
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  filteredCertificates,
  (certs) => {
    if (!certs.length) {
      selectedCertificateKey.value = ''
      return
    }

    const savedKey = window.localStorage.getItem(CERT_LAST_SELECTED_KEY)
    if (savedKey && certs.some((cert) => certKey(cert) === savedKey)) {
      selectedCertificateKey.value = savedKey
      selectedCertificatePreviewLoading.value = true
      return
    }

    if (!certs.some((cert) => certKey(cert) === selectedCertificateKey.value)) {
      selectedCertificateKey.value = certKey(certs[0])
      selectedCertificatePreviewLoading.value = true
    }
  },
  { immediate: true }
)

watch(selectedCertificateKey, (value) => {
  if (!value) return
  window.localStorage.setItem(CERT_LAST_SELECTED_KEY, value)
})

watch(cvPreviewUrl, async () => {
  cvPreviewLoading.value = true
  if (!cvPreviewUrl.value || (!isCvPdf.value && !isCvImage.value)) {
    cvPreviewLoading.value = false
    return
  }
})

watch(selectedCertificatePreviewUrl, async () => {
  selectedCertificatePreviewLoading.value = true
  if (
    !selectedCertificatePreviewUrl.value ||
    (!isSelectedCertificatePdf.value && !isSelectedCertificateImage.value)
  ) {
    selectedCertificatePreviewLoading.value = false
    return
  }
})
</script>

<style scoped>
.documents-app {
  height: 100%;
}

.doc-section {
  padding: 8px;
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #eef5ff;
}

.doc-section legend {
  padding: 2px 8px;
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #ece9d8;
  font-size: 11px;
  font-weight: 700;
}

.doc-card {
  display: grid;
  gap: 6px;
}

.doc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.doc-head--prominent {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.doc-head--prominent .doc-head-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
}

.doc-head--prominent .doc-title {
  font-size: var(--font-lg);
  font-weight: 700;
}

.doc-head--prominent .format-badge {
  margin-left: auto;
}

.doc-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
}

.doc-meta {
  margin: 0;
  font-size: 10px;
  color: #475d7d;
}

.doc-meta.url {
  word-break: break-all;
}

.doc-link {
  width: fit-content;
}

.doc-link-btn {
  border: 1px solid #7f9db9;
  background: linear-gradient(180deg, #f5fbff, #dcecff);
  font: inherit;
  font-size: 10px;
  padding: 2px 6px;
  cursor: pointer;
}

.doc-link-btn:active {
  border-color: #4f6f96;
}

.format-badge {
  border: 1px solid #6b85ab;
  background: linear-gradient(180deg, #f9fdff, #dae9ff);
  color: #214a82;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.35px;
  padding: 2px 6px;
}

.format-badge.cert {
  justify-self: end;
}

.format-badge.tone-pdf {
  border-color: #9b6161;
  background: linear-gradient(180deg, #fff8f8, #ffdede);
  color: #8d2e2e;
}

.format-badge.tone-image {
  border-color: #5c8963;
  background: linear-gradient(180deg, #f8fff8, #dbffe0);
  color: #2a6b34;
}

.format-badge.tone-file {
  border-color: #6b85ab;
  background: linear-gradient(180deg, #f9fdff, #dae9ff);
  color: #214a82;
}

.doc-preview-shell {
  border: 1px solid #7f9db9;
  background: #fff;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-height: 480px;
  overflow: auto;
}

/* VuePDF .page llena el ancho del shell */
.doc-preview-shell :deep(.page) {
  display: block !important;
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}

.doc-preview {
  width: 100%;
  /* max-height limita el visor PDF al area proporcional dentro del card */
  max-height: 460px;
  border: 0;
  background: #fff;
}

.doc-preview.is-loading {
  opacity: 0;
}

.doc-preview.image {
  object-fit: contain;
}

.doc-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.doc-empty {
  margin: 0;
  font-size: 11px;
  color: #555;
}

.preview-unavailable {
  border: 1px dashed #7f9db9;
  background: #f8fbff;
  padding: 10px;
  display: grid;
  gap: 8px;
  min-height: 120px;
  align-items: center;
  justify-items: center;
}



.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.cert-card {
  border: 1px solid #a1b5d2;
  background: #f6faff;
  padding: 8px;
  display: grid;
  gap: 5px;
}

.cert-card:hover,
.cert-card--selected {
  border-color: #7f9db9;
  background: #eaf2fc;
}

.cert-card--selected {
  outline: 2px solid #2a68bf;
  outline-offset: 1px;
}

.cert-card img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border: 1px solid #7f9db9;
  cursor: pointer;
}

.cert-card h4 {
  margin: 0;
  font-size: 11px;
}

.cert-card p {
  margin: 0;
  font-size: 10px;
}

.cert-card a {
  font-size: 10px;
}

.cert-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cert-preview-panel {
  border: 1px solid #a1b5d2;
  background: #f6faff;
  padding: 10px;
  display: grid;
  gap: 8px;
  grid-column: 1 / -1;
}

.cert-preview-panel h4 {
  margin: 0;
  font-size: 11px;
}

.feedback-message {
  margin: 8px 0 0;
  font-size: 10px;
  border: 1px solid;
  padding: 4px 6px;
  width: fit-content;
}

.feedback-message.success {
  color: #1f6f36;
  border-color: #6fa67a;
  background: #e9f9ed;
}

.feedback-message.error {
  color: #9b2a2a;
  border-color: #bf7d7d;
  background: #ffe8e8;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
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

.empty-state-box {
  border: 1px dashed #7f9db9;
  background: #f8fbff;
  padding: 16px;
  text-align: center;
}

.viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.viewer-overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.viewer-modal {
  border: 2px solid;
  border-color: #fff #7f9db9 #7f9db9 #fff;
  background: var(--win-body-bg, #eef5ff);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
  width: min(90vw, 820px);
  max-height: 90vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.viewer-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 10px;
  height: 28px;
  background: linear-gradient(90deg, #7f94ad 0%, #9aacc3 45%, #8ea1b9 100%);
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.25) rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.viewer-title {
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.45);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.viewer-titlebar-controls {
  display: flex;
  align-items: center;
  gap: 2px;
}

.viewer-titlebar-controls .title-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 20px;
  border-radius: 2px;
  border: 2px solid;
  border-color: #fff #7f9db9 #7f9db9 #fff;
  cursor: pointer;
  background: linear-gradient(180deg, #6ea6ff 0%, #2e6bdd 45%, #1d49b5 100%);
  color: #fff;
}

.viewer-titlebar-controls .close-btn::before {
  display: none;
}

.viewer-titlebar-controls .close-btn {
  font-size: 13px;
  line-height: 1;
  font-weight: 400;
  color: #fff;
  flex-shrink: 0;
  width: 22px;
  height: 20px;
}

.viewer-titlebar-controls .title-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.viewer-titlebar-controls .title-btn:active:not(:disabled) {
  box-shadow: inset -2px -2px 0 rgba(255, 255, 255, 0.25), inset 2px 2px 0 rgba(0, 0, 0, 0.4);
}

.viewer-titlebar-controls .title-btn::before {
  content: '';
  width: 8px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
}

.viewer-body {
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  background: #fff;
  min-height: 0;
}

.viewer-pdf-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.viewer-pdf-wrap :deep(.page) {
  display: block !important;
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}

.viewer-pdf-viewer {
  display: block;
  max-width: 100%;
  object-fit: contain;
}

.viewer-page-info {
  font-size: 10px;
  color: #475d7d;
}

.viewer-footer {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px;
  border-top: 1px solid #7f9db9;
  background: #eef5ff;
  flex-shrink: 0;
}
</style>
