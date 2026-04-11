import { computed, ref } from 'vue'
import { defaultContent } from '@/content/defaultContent'
import { normalizeAppAssetPath, normalizeStoragePublicUrl } from '@/utils/assetUrl'

const clone = (value) => JSON.parse(JSON.stringify(value))

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const CONTENT_URL = `${API_BASE}/api/content`

const content = ref(clone(defaultContent))
const loading = ref(false)
const loaded = ref(false)
const error = ref('')

let loadPromise = null

const mergeContent = (incoming) => {
  const next = {
    ...clone(defaultContent),
    ...(incoming || {}),
  }

  if (!Array.isArray(next.projects) || !next.projects.length) {
    next.projects = clone(defaultContent.projects)
  }

  if (!next.documents) {
    next.documents = clone(defaultContent.documents)
  }

  next.projects = (next.projects || []).map((project) => ({
    ...project,
    icon: normalizeAppAssetPath(project.icon),
  }))

  if (next.documents?.cv) {
    const normalizedUrl = normalizeStoragePublicUrl(next.documents.cv.url)
    next.documents.cv = {
      ...next.documents.cv,
      url: normalizedUrl,
    }
  }

  if (Array.isArray(next.documents?.certificates)) {
    next.documents.certificates = next.documents.certificates.map((cert) => ({
      ...cert,
      url: normalizeStoragePublicUrl(cert.url),
      thumbnail: normalizeStoragePublicUrl(cert.thumbnail),
    }))
  }

  content.value = next
}

const loadContent = async () => {
  if (loaded.value) {
    return content.value
  }

  if (loadPromise) {
    return loadPromise
  }

  loading.value = true
  error.value = ''

  loadPromise = fetch(CONTENT_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`content ${response.status}`)
      }

      const payload = await response.json()
      mergeContent(payload)
      loaded.value = true
      return content.value
    })
    .catch(() => {
      // Keep local fallback content
      mergeContent(defaultContent)
      error.value = 'No se pudo cargar contenido remoto, usando contenido local.'
      return content.value
    })
    .finally(() => {
      loading.value = false
      loadPromise = null
    })

  return loadPromise
}

const getProjectById = (projectId) =>
  content.value.projects.find((project) => project.id === projectId) || null

export const usePortfolioContent = () => {
  return {
    content,
    loading,
    loaded,
    error,
    projects: computed(() => content.value.projects || []),
    documents: computed(() => content.value.documents || defaultContent.documents),
    loadContent,
    getProjectById,
  }
}
