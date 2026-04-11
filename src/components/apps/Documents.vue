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
        <header class="xp-task-title">Other Places</header>
        <ul>
          <li>Mi PC</li>
          <li>Internet Explorer</li>
          <li>MSN Messenger</li>
        </ul>
      </section>

      <section class="xp-task-group">
        <header class="xp-task-title">Details</header>
        <ul>
          <li>Formato: PDF / Imagen</li>
          <li>Origen: Supabase / Cloudinary</li>
        </ul>
      </section>
    </aside>

    <main class="xp-main-panel">
      <fieldset class="doc-section">
        <legend>Curriculum Vitae</legend>

        <div class="doc-card" ref="cvPreviewRef">
          <div class="doc-head">
            <p class="doc-title">{{ documents.cv?.title || 'CV' }}</p>
            <span class="format-badge" :class="badgeToneClass(cvTypeLabel)">{{ cvTypeLabel }}</span>
          </div>
          <p class="doc-meta" v-if="documents.cv?.updatedAt">Actualizado: {{ documents.cv.updatedAt }}</p>
          <div v-if="showingCvPreview && cvPreviewUrl" class="doc-preview-shell">
            <div v-if="cvPreviewLoading" class="preview-skeleton" aria-hidden="true"></div>
            <transition name="preview-fade" mode="out-in">
              <iframe
                v-if="isCvPdf && cvEmbedUrl"
                :key="`cv-pdf-${cvEmbedUrl}`"
                class="doc-preview"
                :class="{ 'is-loading': cvPreviewLoading }"
                :src="cvEmbedUrl"
                title="Vista previa de CV"
                loading="lazy"
                @load="onCvPreviewLoaded"
              ></iframe>
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
            <button class="doc-link doc-link-btn" @click="showCvPreview">Ver aquí</button>
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
          <p v-else class="doc-empty">Aún no hay CV publicado.</p>
        </div>
      </fieldset>

      <fieldset class="doc-section">
        <legend>Certificados</legend>

        <div v-if="filteredCertificates.length" class="cert-grid" ref="certsRef">
          <article v-for="cert in filteredCertificates" :key="cert.id || cert.url" class="cert-card">
            <span class="format-badge cert" :class="badgeToneClass(certificateTypeLabel(cert))">{{
              certificateTypeLabel(cert)
            }}</span>
            <img :src="certificateThumbnail(cert)" :alt="cert.title" @click="showCertificatePreview(cert)" />
            <h4>{{ cert.title }}</h4>
            <p>{{ cert.issuer }} · {{ cert.date }}</p>
              <div class="cert-actions">
                <button class="doc-link doc-link-btn" @click="showCertificatePreview(cert)">Ver aquí</button>
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
            <div v-if="selectedCertificatePreviewLoading" class="preview-skeleton" aria-hidden="true"></div>

            <transition name="preview-fade" mode="out-in">
              <iframe
                v-if="isSelectedCertificatePdf && selectedCertificateEmbedUrl"
                :key="`cert-pdf-${selectedCertificateEmbedUrl}`"
                class="doc-preview"
                :class="{ 'is-loading': selectedCertificatePreviewLoading }"
                :src="selectedCertificateEmbedUrl"
                :title="`Vista previa de ${selectedCertificate.title}`"
                loading="lazy"
                @load="onSelectedCertificatePreviewLoaded"
              ></iframe>

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
                <p class="doc-empty">Podés abrirlo en nueva pestaña o descargarlo desde acá.</p>
              </div>
            </transition>

            <div class="doc-actions" v-if="selectedCertificate.url">
              <button class="doc-link doc-link-btn" @click="showCertificatePreview(selectedCertificate)">
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

        <p v-else class="doc-empty">No hay certificados cargados por el momento.</p>
      </fieldset>

      <p v-if="actionFeedback.text" class="feedback-message" :class="actionFeedback.type">
        {{ actionFeedback.text }}
      </p>
    </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'
import { assetUrl, downloadUrl, isImageUrl, isPdfUrl } from '@/utils/assetUrl'

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
const cvEmbedUrl = ref('')
const cvInlineError = ref('')
const selectedCertificatePreviewLoading = ref(true)
const selectedCertificateEmbedUrl = ref('')
const selectedCertificateInlineError = ref('')
const actionFeedback = ref({ type: '', text: '' })
const CERT_LAST_SELECTED_KEY = 'xp-documents-last-certificate'
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

const cvPreviewUrl = computed(() => documents.value.cv?.url || '')
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

const toDownloadUrl = (url) => downloadUrl(url)

const revokeCvEmbedUrl = () => {
  if (cvEmbedUrl.value) {
    URL.revokeObjectURL(cvEmbedUrl.value)
    cvEmbedUrl.value = ''
  }
}

const resolveCvEmbedUrl = async () => {
  if (!cvPreviewUrl.value || !isCvPdf.value) {
    revokeCvEmbedUrl()
    cvInlineError.value = ''
    return
  }

  cvInlineError.value = ''

  try {
    const response = await fetch(cvPreviewUrl.value)
    if (!response.ok) throw new Error(`No se pudo cargar el PDF (${response.status}).`)

    const blob = await response.blob()
    const pdfBlob = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' })

    revokeCvEmbedUrl()
    cvEmbedUrl.value = URL.createObjectURL(pdfBlob)
  } catch {
    revokeCvEmbedUrl()
    cvInlineError.value = 'No se pudo generar vista previa embebida para este PDF.'
  }
}

const revokeSelectedCertificateEmbedUrl = () => {
  if (selectedCertificateEmbedUrl.value) {
    URL.revokeObjectURL(selectedCertificateEmbedUrl.value)
    selectedCertificateEmbedUrl.value = ''
  }
}

const resolveSelectedCertificateEmbedUrl = async () => {
  if (!selectedCertificatePreviewUrl.value || !isSelectedCertificatePdf.value) {
    revokeSelectedCertificateEmbedUrl()
    selectedCertificateInlineError.value = ''
    return
  }

  selectedCertificateInlineError.value = ''

  try {
    const response = await fetch(selectedCertificatePreviewUrl.value)
    if (!response.ok) throw new Error(`No se pudo cargar el PDF (${response.status}).`)

    const blob = await response.blob()
    const pdfBlob = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' })

    revokeSelectedCertificateEmbedUrl()
    selectedCertificateEmbedUrl.value = URL.createObjectURL(pdfBlob)
  } catch {
    revokeSelectedCertificateEmbedUrl()
    selectedCertificateInlineError.value = 'No se pudo generar vista previa embebida para este certificado.'
  }
}

const certKey = (cert) => cert?.id || cert?.url || cert?.title || ''

const selectedCertificate = computed(() => {
  if (!filteredCertificates.value.length) return null
  return (
    filteredCertificates.value.find((cert) => certKey(cert) === selectedCertificateKey.value) ||
    filteredCertificates.value[0]
  )
})

const selectedCertificatePreviewUrl = computed(() => selectedCertificate.value?.url || '')
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
  cvPreviewLoading.value = true
  await resolveCvEmbedUrl()
  if (isCvPdf.value && !cvEmbedUrl.value) {
    cvPreviewLoading.value = false
  }
  await nextTick()
  cvPreviewRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    showFeedback('No se pudo copiar automáticamente. Copialo manualmente.', 'error')
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

onMounted(() => {
  loadContent()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (feedbackTimer) window.clearTimeout(feedbackTimer)
  revokeCvEmbedUrl()
  revokeSelectedCertificateEmbedUrl()
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
  await resolveCvEmbedUrl()
  if (!cvPreviewUrl.value || (!isCvPdf.value && !isCvImage.value)) {
    cvPreviewLoading.value = false
    return
  }

  if (isCvPdf.value && !cvEmbedUrl.value) {
    cvPreviewLoading.value = false
  }
})

watch(selectedCertificatePreviewUrl, async () => {
  selectedCertificatePreviewLoading.value = true
  await resolveSelectedCertificateEmbedUrl()
  if (
    !selectedCertificatePreviewUrl.value ||
    (!isSelectedCertificatePdf.value && !isSelectedCertificateImage.value)
  ) {
    selectedCertificatePreviewLoading.value = false
    return
  }

  if (isSelectedCertificatePdf.value && !selectedCertificateEmbedUrl.value) {
    selectedCertificatePreviewLoading.value = false
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
}

.doc-preview {
  width: 100%;
  min-height: 320px;
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
}

.preview-skeleton {
  width: 100%;
  min-height: 320px;
  border: 1px solid #a9bdd8;
  background: linear-gradient(110deg, #eef5ff 10%, #dbe8fb 30%, #eef5ff 45%);
  background-size: 220% 100%;
  animation: shimmer 1.2s linear infinite;
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
</style>
