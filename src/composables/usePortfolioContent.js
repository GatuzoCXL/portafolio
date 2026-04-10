import { computed, ref } from 'vue'
import { defaultContent } from '@/content/defaultContent'

const clone = (value) => JSON.parse(JSON.stringify(value))

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

  loadPromise = fetch('/api/content')
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
