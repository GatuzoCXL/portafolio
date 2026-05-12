<template>
  <div class="mobile-forum">
    <template v-if="view === 'home'">

      <header class="forum-chrome">
        <div class="forum-chrome-brand">
          <div class="forum-chrome-icon">A</div>
          <div>
            <div class="forum-chrome-title">Archivo de Proyectos</div>
            <div class="forum-chrome-domain">archivo.portafolio.local</div>
          </div>
        </div>
        <div class="forum-chrome-hint">
          Proyecto personal. Documentación tardía de aplicaciones, bots y otros experimentos digitales.
        </div>
      </header>

      <nav class="forum-breadcrumb">
        <span class="crumb">Inicio</span>
        <span class="crumb-sep">&raquo;</span>
        <span class="crumb">Archivo del Portfolio</span>
        <span class="crumb-sep">&raquo;</span>
        <span class="crumb crumb--current">Página principal</span>
      </nav>

      <section v-if="loading && !projects.length" class="forum-panel">
        <p class="forum-empty">Cargando archivo...</p>
      </section>

      <section v-else-if="error && !projects.length" class="forum-panel">
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">Error de carga</div>
          <div class="empty-state-text">No se pudo cargar el archivo. Intenta de nuevo más tarde.</div>
        </div>
      </section>

      <template v-else-if="projects.length">
        <section class="forum-panel">
          <div class="panel-header">
            <span class="panel-header-title">Categorías</span>
          </div>
          <div class="board-list">
            <button
              v-for="section in boardSections"
              :key="section.id"
              type="button"
              class="board-row"
              :class="{ active: activeCategoryId === section.id }"
              @click="toggleCategory(section.id)"
            >
              <div class="board-row-main">
                <span class="board-row-name">{{ section.name }}</span>
                <span class="board-row-count">{{ section.threadCount }} temas</span>
              </div>
              <div class="board-row-meta">{{ section.latestTitle }}</div>
            </button>
          </div>
        </section>

        <section class="forum-panel">
          <div class="panel-header">
            <span class="panel-header-title">Temas</span>
          </div>
          <div v-if="filteredThreads.length" class="thread-list">
            <div class="thread-list-header">
              <span class="th-col-topic">Tema</span>
              <span class="th-col-stats">R / V</span>
            </div>
            <button
              v-for="(thread, index) in filteredThreads"
              :key="thread.id"
              type="button"
              class="thread-row"
              :class="{ alt: index % 2 === 1, sticky: thread.isSticky }"
              @click="goToThread(thread.id)"
            >
              <div class="thread-row-main">
                <span class="thread-flag">{{ thread.flag }}</span>
                <div class="thread-row-info">
                  <span class="thread-row-title">{{ thread.title }}</span>
                  <span class="thread-row-category">{{ thread.categoryName }}</span>
                </div>
              </div>
              <div class="thread-row-meta">
                <span class="thread-row-author">{{ thread.author }}</span>
                <span class="thread-row-stats">{{ thread.replies }} / {{ thread.views }}</span>
              </div>
              <div class="thread-row-last">
                <span class="last-message-meta">
                  <span>{{ getThreadLastMessageDate(thread) }}</span>
                  <span
                    v-if="isThreadSyncedWithGithub(thread)"
                    class="last-message-badge"
                    title="Sincronizado con el último commit real en GitHub"
                  >
                    GitHub
                  </span>
                  <span
                    v-else-if="isThreadPrivateLike(thread)"
                    class="last-message-badge last-message-badge--private"
                    title="Repositorio privado o inaccesible desde el cliente"
                  >
                    Pr1v4d0
                  </span>
                </span>
              </div>
            </button>
          </div>
          <div v-else-if="allThreads.length === 0" class="empty-state">
            <div class="empty-state-icon">📂</div>
            <div class="empty-state-title">Archivo vacío</div>
            <div class="empty-state-text">Aún no se ha subido nada a esta sección del archivo.</div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-state-icon">📂</div>
            <div class="empty-state-title">Sin entradas en esta categoría</div>
            <div class="empty-state-text">
              No se encontraron proyectos en esta categoría del archivo. Prueba seleccionando otra categoría.
            </div>
          </div>
        </section>
      </template>

      <section v-else class="forum-panel">
        <div class="empty-state">
          <div class="empty-state-icon">📂</div>
          <div class="empty-state-title">Archivo vacío</div>
          <div class="empty-state-text">Aún no se ha subido nada a esta sección del archivo.</div>
        </div>
      </section>
    </template>

    <template v-else-if="view === 'thread' && activeThread">
      <div class="thread-detail">
        <div class="thread-detail-topbar">
          <button type="button" class="back-link" @click="backToHome">
            &laquo; Volver al foro
          </button>
          <div class="thread-detail-crumbs">
            <span class="crumb">Inicio</span>
            <span class="crumb-sep">&raquo;</span>
            <span class="crumb">{{ activeThread.categoryName }}</span>
            <span class="crumb-sep">&raquo;</span>
            <span class="crumb crumb--current" :title="activeThread.title">{{ activeThread.title }}</span>
          </div>
        </div>

        <article class="thread-page-card">
          <header class="thread-page-header">
            <div class="thread-page-badge">{{ activeThread.flag }}</div>
            <div class="thread-page-titleblock">
              <h2 class="thread-page-title">{{ activeThread.title }}</h2>
              <p class="thread-page-desc">
                {{ activeProject?.fullDescription || activeProject?.description || 'Este hilo no tiene una ficha asociada todavía.' }}
              </p>
            </div>
            <div class="thread-page-meta-compact">
              <span>Autor: {{ activeThread.author }}</span>
              <span>Resp.: {{ activeThread.replies }}</span>
              <span>Vis.: {{ activeThread.views }}</span>
              <span class="last-message-meta">
                <span>{{ getThreadLastMessageDate(activeThread) }}</span>
                <span
                  v-if="isThreadSyncedWithGithub(activeThread)"
                  class="last-message-badge"
                  title="Sincronizado con el último commit real en GitHub"
                >
                  GitHub
                </span>
                <span
                  v-else-if="isThreadPrivateLike(activeThread)"
                  class="last-message-badge last-message-badge--private"
                  title="Repositorio privado o inaccesible desde el cliente"
                >
                  Pr1v4d0
                </span>
              </span>
            </div>
          </header>

          <div class="thread-page-body">
            <section class="thread-post">
              <div class="post-head">
                <strong>{{ activeThread.title }}</strong>
                <span class="post-head-meta">
                  Publicado por {{ activeThread.author }} ·
                  <span class="last-message-meta">
                    <span>{{ getThreadLastMessageDate(activeThread) }}</span>
                    <span
                      v-if="isThreadSyncedWithGithub(activeThread)"
                      class="last-message-badge"
                      title="Sincronizado con el último commit real en GitHub"
                    >
                      GitHub
                    </span>
                    <span
                      v-else-if="isThreadPrivateLike(activeThread)"
                      class="last-message-badge last-message-badge--private"
                      title="Repositorio privado o inaccesible desde el cliente"
                    >
                      Pr1v4d0
                    </span>
                  </span>
                </span>
              </div>

              <div class="post-intro">
                <p class="post-copy">
                  {{ activeProject?.description || 'Sin descripción disponible.' }}
                </p>
                <div v-if="activeProject && (activeProject.github || activeProject.demo || activeProject.release)" class="post-links">
                  <a
                    v-if="activeProject.github"
                    :href="activeProject.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="detail-link"
                  >
                    Repositorio
                  </a>
                  <a
                    v-if="activeProject.demo"
                    :href="activeProject.demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="detail-link"
                  >
                    Live
                  </a>
                  <a
                    v-if="activeProject.release"
                    :href="activeProject.release"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="detail-link"
                  >
                    Descarga
                  </a>
                </div>
              </div>

              <div v-if="activeProject?.tech?.length" class="thread-page-tech">
                <span
                  v-for="tech in activeProject.tech"
                  :key="tech"
                  class="thread-tech-chip"
                >
                  {{ tech }}
                </span>
              </div>

              <div v-if="activeProject?.screenshots?.length" class="thread-page-gallery">
                <button
                  v-for="(screenshot, index) in activeProject.screenshots"
                  :key="`${activeProject.id}-shot-${index}`"
                  type="button"
                  class="forum-shot"
                  @click="openImageViewer(index)"
                >
                  <img :src="screenshot" :alt="`${activeProject.name} captura ${index + 1}`" />
                </button>
              </div>
            </section>
          </div>
        </article>

        <button type="button" class="back-link back-link--bottom" @click="backToHome">
          &laquo; Volver al foro
        </button>
      </div>
    </template>

    <Teleport v-if="currentScreenshot" to="body">
      <div class="image-viewer" @click="closeImageViewer">
        <div class="image-viewer-content" @click.stop>
          <button type="button" class="viewer-close" @click="closeImageViewer" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button type="button" class="viewer-nav viewer-nav--prev" @click="showPreviousImage" aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="24" height="24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <img
            :src="currentScreenshot"
            :alt="`${activeProject?.name || 'Captura del foro'} captura ${selectedImageIndex + 1}`"
            class="viewer-image"
          />

          <button type="button" class="viewer-nav viewer-nav--next" @click="showNextImage" aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="24" height="24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <p class="viewer-counter">
            Imagen {{ selectedImageIndex + 1 }} de {{ activeProject?.screenshots?.length || 0 }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'

const { projects, loadContent, loading, error } = usePortfolioContent()

const view = ref('home')
const activeCategoryId = ref(null)
const selectedThreadId = ref(null)
const selectedImageIndex = ref(null)
const latestCommitByProjectId = ref({})

const categories = [
  { id: 'announcements', name: 'Anuncios', description: 'Avisos del portal, mantenimiento y mensajes importantes.' },
  { id: 'web', name: 'Desarrollo Web', description: 'Sitios, interfaces y experimentos visuales.' },
  { id: 'personal', name: 'Proyectos Personales', description: 'Ideas raras, utilidades y demos hechas por gusto.' },
  { id: 'bots', name: 'Bots & Automatización', description: 'Bots, scripts y rutinas automáticas.' },
  { id: 'uiux', name: 'UI/UX', description: 'Detalles visuales, flujo y presentación.' },
]

const techToCategory = {
  React: 'web',
  'React Native': 'web',
  Vue: 'web',
  Angular: 'web',
  'Node.js': 'web',
  HTML5: 'web',
  CSS3: 'web',
  JavaScript: 'web',
  'Discord.js': 'bots',
  Electron: 'personal',
  'Canvas API': 'personal',
  MongoDB: 'personal',
  Firebase: 'web',
  'Google Maps API': 'web',
  'YouTube API': 'bots',
}

const hashString = (value) => {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

const numberFromSeed = (seed, min, max) => {
  const range = max - min + 1
  return min + (hashString(seed) % range)
}

const getCategoryForProject = (project) => {
  if (!project.tech?.length) {
    return categories.find(category => category.id === 'personal')
  }

  for (const tech of project.tech) {
    const categoryId = techToCategory[tech]
    if (categoryId) {
      return categories.find(category => category.id === categoryId)
    }
  }

  return categories.find(category => category.id === 'personal')
}

const pinnedThreads = computed(() => [
  {
    id: 'sticky-welcome',
    title: 'Leeme antes de entrar al sótano',
    author: 'Moderación',
    date: '04/12/2001 03:33 AM',
    replies: 12,
    views: 968,
    categoryId: 'announcements',
    categoryName: 'Anuncios',
    flag: 'fijado',
    isSticky: true,
  },
  {
    id: 'sticky-rules',
    title: 'No alimentes al ruido de la pantalla',
    author: 'KingPantera',
    date: '04/12/2001 03:31 AM',
    replies: 6,
    views: 412,
    categoryId: 'announcements',
    categoryName: 'Anuncios',
    flag: 'alerta',
    isSticky: true,
  },
])

const threads = computed(() => {
  return projects.value.map((project, index) => {
    const category = getCategoryForProject(project)
    const baseSeed = `${project.id}:${project.name}:${index}`

    return {
      id: project.id,
      title: project.name,
      author: 'Gasut',
      projectId: project.id,
      date: `24/04/2025 ${String(3 + (hashString(baseSeed) % 9)).padStart(2, '0')}:${String(hashString(`${baseSeed}:minute`) % 60).padStart(2, '0')} AM`,
      replies: numberFromSeed(baseSeed, 0, 18),
      views: numberFromSeed(`${baseSeed}:views`, 84, 640),
      categoryId: category.id,
      categoryName: category.name,
      flag: index === 0 ? 'nuevo' : 'proyecto',
      isSticky: false,
    }
  })
})

const allThreads = computed(() => [...pinnedThreads.value, ...threads.value])

const filteredThreads = computed(() => {
  if (activeCategoryId.value === null) {
    return allThreads.value
  }
  return allThreads.value.filter(thread => thread.categoryId === activeCategoryId.value)
})

const boardSections = computed(() => {
  return categories.map((category) => {
    const categoryThreads = allThreads.value.filter(thread => thread.categoryId === category.id)
    const latestThread = categoryThreads[0]

    return {
      ...category,
      threadCount: categoryThreads.length,
      latestTitle: latestThread?.title ?? 'Sin actividad',
    }
  })
})

const selectedThread = computed(() => {
  if (!selectedThreadId.value) return null
  return allThreads.value.find(thread => thread.id === selectedThreadId.value) || null
})

const activeThread = computed(() => selectedThread.value)

const activeProject = computed(() => {
  if (!activeThread.value?.projectId) return null
  return projects.value.find(project => project.id === activeThread.value.projectId) || null
})

const currentScreenshot = computed(() => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) {
    return null
  }
  return activeProject.value.screenshots[selectedImageIndex.value] || null
})

const glitchSignatures = [
  ':://??__n0-s1gn4l__??//::',
  '[0xPR1V8]::{d3-sync}//??',
  '<<::n0-t1m3-st4mp::>>',
  '##/cryptic-feed/??/null##',
  '~~[t3mp0r4l-r3d4ct3d]~~',
  '::gh0st-cl0ck::--:--::',
]

const getThreadDistortedDate = (thread) => {
  const seed = hashString(`${thread.id}:${thread.title}`)
  const signature = glitchSignatures[seed % glitchSignatures.length]
  const shard = ((seed ^ 0xa5a5a5a5) >>> 0).toString(16).slice(0, 6)
  return `${signature} [${shard}]`
}

const parseGithubRepo = (url) => {
  if (!url) return null
  const match = String(url).trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i)
  if (!match) return null
  return { owner: match[1], repo: match[2] }
}

const formatForumDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours24 = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const meridiem = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12
  return `${day}/${month}/${year} ${String(hours12).padStart(2, '0')}:${minutes} ${meridiem}`
}

const fetchLatestCommitDate = async (owner, repo) => {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`github ${response.status}`)
  const commits = await response.json()
  return commits?.[0]?.commit?.committer?.date || null
}

const loadLatestCommitDates = async (projectItems) => {
  const entries = await Promise.all(
    (projectItems || []).map(async (project) => {
      const repoData = parseGithubRepo(project.github)
      if (!repoData) return [project.id, null]
      try {
        const commitDate = await fetchLatestCommitDate(repoData.owner, repoData.repo)
        return [project.id, commitDate]
      } catch {
        return [project.id, null]
      }
    }),
  )
  latestCommitByProjectId.value = Object.fromEntries(entries)
}

const getThreadLastMessageDate = (thread) => {
  if (!thread?.projectId) return thread?.date || ''
  const commitDate = latestCommitByProjectId.value[thread.projectId]
  if (!commitDate) {
    if (isThreadPrivateLike(thread)) return getThreadDistortedDate(thread)
    return thread.date
  }
  return formatForumDateTime(commitDate) || thread.date
}

const isThreadSyncedWithGithub = (thread) => {
  if (!thread?.projectId) return false
  return Boolean(latestCommitByProjectId.value[thread.projectId])
}

const isThreadPrivateLike = (thread) => {
  if (!thread?.projectId) return false
  const relatedProject = projects.value.find(project => project.id === thread.projectId)
  if (!relatedProject) return false
  if (!relatedProject.github) return true
  return !latestCommitByProjectId.value[thread.projectId]
}

const toggleCategory = (categoryId) => {
  if (activeCategoryId.value === categoryId) {
    activeCategoryId.value = null
  } else {
    activeCategoryId.value = categoryId
  }
}

const goToThread = (threadId) => {
  selectedThreadId.value = threadId
  view.value = 'thread'
  selectedImageIndex.value = null
}

const backToHome = () => {
  view.value = 'home'
  selectedThreadId.value = null
  selectedImageIndex.value = null
}

const openImageViewer = (index) => {
  selectedImageIndex.value = index
}

const closeImageViewer = () => {
  selectedImageIndex.value = null
}

const showNextImage = () => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) return
  selectedImageIndex.value = (selectedImageIndex.value + 1) % activeProject.value.screenshots.length
}

const showPreviousImage = () => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) return
  selectedImageIndex.value = (selectedImageIndex.value - 1 + activeProject.value.screenshots.length) % activeProject.value.screenshots.length
}

const handleViewerKeyboard = (event) => {
  if (selectedImageIndex.value === null) return
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

let commitSyncInterval = null
const COMMIT_SYNC_INTERVAL_MS = 10 * 60_000

onMounted(() => {
  loadContent()
  watch(
    projects,
    (items) => {
      void loadLatestCommitDates(items)
    },
    { immediate: true },
  )
  commitSyncInterval = window.setInterval(() => {
    void loadLatestCommitDates(projects.value)
  }, COMMIT_SYNC_INTERVAL_MS)
  window.addEventListener('keydown', handleViewerKeyboard)
})

onUnmounted(() => {
  if (commitSyncInterval) {
    clearInterval(commitSyncInterval)
    commitSyncInterval = null
  }
  window.removeEventListener('keydown', handleViewerKeyboard)
})
</script>

<style scoped>
.mobile-forum {
  position: relative;
  min-height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background:
    radial-gradient(circle at top, rgba(137, 23, 23, 0.28), transparent 44%),
    linear-gradient(180deg, #09090c 0%, #191113 48%, #0b0b0f 100%);
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  color: #e8e1de;
}

.mobile-forum::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0,
      rgba(255, 255, 255, 0.015) 2px,
      transparent 4px,
      transparent 6px
    );
  mix-blend-mode: screen;
  opacity: 0.28;
}

.forum-chrome {
  position: relative;
  padding: 12px;
  border: 1px solid #53111b;
  background: linear-gradient(180deg, rgba(41, 14, 20, 0.96) 0%, rgba(14, 10, 13, 0.95) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.28);
}

.forum-chrome-brand {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.forum-chrome-icon {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: linear-gradient(180deg, #7c2430 0%, #4b1019 100%);
  color: #ffe3df;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.forum-chrome-title {
  font-size: 15px;
  font-weight: 700;
  color: #f6c9c4;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.forum-chrome-domain {
  font-size: 11px;
  color: #d3b1ab;
  margin-top: 1px;
}

.forum-chrome-hint {
  font-size: 11px;
  color: #9a7872;
  line-height: 1.4;
}

.forum-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  background: linear-gradient(180deg, #e8e8d8 0%, #d4d0c0 100%);
  color: #333;
  font-size: 11px;
  border-bottom: 1px solid #a8a8a8;
}

.crumb {
  color: #6b5258;
}

.crumb-sep {
  color: #8d7c81;
}

.crumb--current {
  color: #333;
  font-weight: 600;
}

.forum-panel {
  position: relative;
  border: 1px solid #4d2a2e;
  background: linear-gradient(180deg, #d7d8dd 0%, #aeb4be 100%);
  color: #231b1d;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.panel-header {
  padding: 6px 10px;
  border-bottom: 1px solid #6f2f39;
  background: linear-gradient(180deg, #7c2430 0%, #4b1019 100%);
  color: #ffe3df;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
}

.board-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  text-align: left;
  color: inherit;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.board-row:active {
  background: linear-gradient(180deg, #fff1d8 0%, #e8d5c0 100%);
}

.board-row.active {
  border-color: #7f3040;
  background: linear-gradient(180deg, #f2d5d8 0%, #e0b8bd 100%);
}

.board-row-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.board-row-name {
  font-size: 13px;
  font-weight: 700;
  color: #4a151d;
}

.board-row-count {
  font-size: 10px;
  color: #7b666a;
  white-space: nowrap;
}

.board-row-meta {
  font-size: 11px;
  color: #5b4a4d;
  line-height: 1.35;
}

.thread-list {
  display: flex;
  flex-direction: column;
}

.thread-list-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 6px 10px;
  background: linear-gradient(180deg, #d4d0c0 0%, #c0bcb0 100%);
  color: #491017;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  border-bottom: 1px solid #6d444d;
}

.th-col-topic {
  min-width: 0;
}

.th-col-stats {
  text-align: right;
  white-space: nowrap;
}

.thread-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border-bottom: 1px solid #b3a8ab;
  background: #f7f6f8;
  text-align: left;
  color: inherit;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.thread-row.alt {
  background: #ebe6e8;
}

.thread-row.sticky {
  background: #f2d5d8;
}

.thread-row:active {
  background: #fff1d8;
}

.thread-row-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.thread-flag {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border: 1px solid #7f3040;
  border-radius: 999px;
  background: rgba(122, 26, 43, 0.12);
  color: #721828;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  margin-top: 2px;
}

.thread-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.thread-row-title {
  font-size: 13px;
  font-weight: 700;
  color: #002e68;
  line-height: 1.35;
  word-break: break-word;
}

.thread-row-category {
  font-size: 10px;
  color: #6c5c60;
}

.thread-row-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: #6e6e6e;
}

.thread-row-author {
  color: #755f64;
}

.thread-row-stats {
  white-space: nowrap;
  color: #7b666a;
}

.thread-row-last {
  font-size: 10px;
  color: #755f64;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 12px;
  text-align: center;
}

.empty-state-icon {
  font-size: 28px;
  line-height: 1;
  opacity: 0.7;
}

.empty-state-title {
  font-size: 13px;
  font-weight: 700;
  color: #5f4a4f;
}

.empty-state-text {
  font-size: 11px;
  color: #8d7c81;
  line-height: 1.6;
  max-width: 280px;
}

.forum-empty {
  margin: 0;
  font-size: 12px;
  color: #6d5c60;
  text-align: center;
  padding: 20px 0;
}

.last-message-meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.last-message-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid #6a5aa2;
  border-radius: 2px;
  background: linear-gradient(180deg, #efeaff 0%, #d8d0ff 100%);
  color: #3f3368;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.last-message-badge--private {
  border-color: #6a3f59;
  background: linear-gradient(180deg, #ffeef6 0%, #f3d4e4 100%);
  color: #5f2443;
}

.thread-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thread-detail-topbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid #4d2a2e;
  background: linear-gradient(180deg, #d7d8dd 0%, #aeb4be 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.thread-detail-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  color: #6b5258;
  font-size: 10px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: 1px solid #9e8b91;
  background: linear-gradient(180deg, #fffefc 0%, #e8dde1 100%);
  color: #4c1c24;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
}

.back-link:active {
  background: linear-gradient(180deg, #f3eaee 0%, #d9cdd2 100%);
}

.back-link--bottom {
  align-self: flex-start;
}

.thread-page-card {
  border: 1px solid #b79ea5;
  background: linear-gradient(180deg, #fffefe 0%, #efe5e9 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  color: #231b1d;
}

.thread-page-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #c7b1b8;
  background: linear-gradient(180deg, #fffdfd 0%, #f3eaee 100%);
}

.thread-page-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  min-width: 52px;
  padding: 3px 8px;
  border: 1px solid #8f6f77;
  background: linear-gradient(180deg, #fffefe 0%, #ded1d6 100%);
  color: #4c3138;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.thread-page-title {
  margin: 0;
  color: #3d2931;
  font-size: 15px;
  line-height: 1.35;
  word-break: break-word;
}

.thread-page-desc {
  margin: 6px 0 0;
  color: #5f4950;
  line-height: 1.5;
  font-size: 12px;
}

.thread-page-meta-compact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  padding: 8px;
  border: 1px solid #b9a4ab;
  background: linear-gradient(180deg, #fffefe 0%, #efe5e9 100%);
  color: #4d383f;
  font-size: 10px;
}

.thread-page-body {
  padding: 12px;
}

.thread-post {
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #fffdfd 0%, #f1eaed 100%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 10px;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 2px;
  border-bottom: 1px dashed #c1afb5;
  color: #5e4750;
  font-size: 10px;
}

.post-head-meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.post-copy {
  margin: 0;
  color: #3d3034;
  line-height: 1.6;
  font-size: 12px;
}

.post-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  min-height: 44px;
  padding: 6px 10px;
  border: 1px solid #7f3040;
  background: linear-gradient(180deg, #fff7f8 0%, #e4cfd4 100%);
  color: #5a1520;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  transition: background 0.15s;
}

.detail-link:active {
  background: linear-gradient(180deg, #ffffff 0%, #efdfe2 100%);
}

.thread-page-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.thread-tech-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border: 1px solid #9a8a90;
  background: linear-gradient(180deg, #fffefe 0%, #e6dce0 100%);
  color: #4b3940;
  font-size: 10px;
  font-weight: 700;
}

.thread-page-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
}

.forum-shot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid;
  border-color: #ffffff #80747a #80747a #ffffff;
  background: #f0f0f0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 90px;
}

.forum-shot:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.forum-shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.image-viewer-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.viewer-image {
  max-width: 100%;
  max-height: 80vh;
  border: 3px solid #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.viewer-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
}

.viewer-close:active {
  background: rgba(255, 255, 255, 0.2);
}

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
}

.viewer-nav:active {
  background: rgba(255, 255, 255, 0.2);
}

.viewer-nav--prev {
  left: 8px;
}

.viewer-nav--next {
  right: 8px;
}

.viewer-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 11px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 12px;
}
</style>
