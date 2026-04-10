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

        <div class="doc-card">
          <p class="doc-title">{{ documents.cv?.title || 'CV' }}</p>
          <p class="doc-meta" v-if="documents.cv?.updatedAt">Actualizado: {{ documents.cv.updatedAt }}</p>

          <a
            v-if="documents.cv?.url"
            :href="documents.cv.url"
            target="_blank"
            rel="noopener noreferrer"
            class="doc-link"
          >
            Abrir CV
          </a>
          <p v-else class="doc-empty">Aún no hay CV publicado.</p>
        </div>
      </fieldset>

      <fieldset class="doc-section">
        <legend>Certificados</legend>

        <div v-if="filteredCertificates.length" class="cert-grid" ref="certsRef">
          <article v-for="cert in filteredCertificates" :key="cert.id || cert.url" class="cert-card">
            <img v-if="cert.thumbnail" :src="cert.thumbnail" :alt="cert.title" />
            <h4>{{ cert.title }}</h4>
            <p>{{ cert.issuer }} · {{ cert.date }}</p>
            <a :href="cert.url" target="_blank" rel="noopener noreferrer">Ver certificado</a>
          </article>
        </div>

        <p v-else class="doc-empty">No hay certificados cargados por el momento.</p>
      </fieldset>
    </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'

const windowsStore = useWindowsStore()
const { documents, loadContent } = usePortfolioContent()
const address = ref('My Computer\\My Documents')
const previousAddress = ref('')
const searchQuery = ref('')
const certsRef = ref(null)
const addressRef = ref(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)

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
  if (documents.value.cv?.url) {
    window.open(documents.value.cv.url, '_blank', 'noopener,noreferrer')
  }
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

.doc-link {
  width: fit-content;
}

.doc-empty {
  margin: 0;
  font-size: 11px;
  color: #555;
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
</style>
