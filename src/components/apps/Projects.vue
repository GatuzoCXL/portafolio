<template>
  <div class="projects xp-window-frame">
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
        <button class="xp-tool-btn xp-address-jump" @click="jumpToDocuments">Docs</button>
      </div>
    </div>

    <div class="xp-page-shell">
    <aside class="xp-sidebar-panel">
      <section class="xp-task-group">
        <div class="xp-task-title">Project Tasks</div>
        <ul>
          <li><button class="xp-task-link" @click="focusFirstProject">Abrir demo detallada</button></li>
          <li><button class="xp-task-link" @click="openFirstGithub">Ir al repositorio</button></li>
          <li><button class="xp-task-link" @click="clearSearch">Ver stack tecnológico</button></li>
        </ul>
      </section>

      <section class="xp-task-group">
        <div class="xp-task-title">Other Places</div>
        <ul>
          <li>Mis Documentos</li>
          <li>MSN Messenger</li>
          <li>Music Studio</li>
        </ul>
      </section>
    </aside>

    <main class="xp-main-panel">
      <p v-if="searchQuery" class="results-count">Resultados para "{{ searchQuery }}": {{ filteredProjects.length }}</p>
      <div class="projects-container">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        @click="openProjectDetail(project.id)"
      >
        <div class="card-thumbnail">
          <img :src="project.screenshots?.[0] || project.icon" :alt="project.name" />
          <span class="category-badge">{{ project.category || 'Project' }}</span>
        </div>
        <div class="card-content">
          <h3 class="project-title">{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="tech-chips">
            <span
              v-for="tech in project.tech"
              :key="tech"
              class="chip"
              :style="getChipStyle(tech)"
            >
              {{ tech }}
            </span>
          </div>
          <div class="card-actions">
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="action-link"
              @click.stop
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="action-link demo-link"
              @click.stop
            >
              Demo
            </a>
          </div>
        </div>
      </div>
      </div>
    </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'

const windowsStore = useWindowsStore()
const { projects, loadContent } = usePortfolioContent()

const chipColors = {
  frontend: { bg: '#1d4ed8', text: '#fff' },
  backend: { bg: '#047857', text: '#fff' },
  mobile: { bg: '#d97706', text: '#fff' },
  bots: { bg: '#6d28d9', text: '#fff' },
  other: { bg: '#4b5563', text: '#fff' },
}

const techToChipCategory = {
  React: 'frontend',
  Vue: 'frontend',
  Angular: 'frontend',
  'HTML5': 'frontend',
  'CSS3': 'frontend',
  JavaScript: 'frontend',
  'Node.js': 'backend',
  Python: 'backend',
  Go: 'backend',
  'React Native': 'mobile',
  'Discord.js': 'bots',
  Electron: 'bots',
  MongoDB: 'other',
  Firebase: 'other',
  Git: 'other',
}

const getTechCategory = (tech) => {
  return techToChipCategory[tech] || 'other'
}

const getChipStyle = (tech) => {
  const category = getTechCategory(tech)
  const colors = chipColors[category] || chipColors.other
  return {
    background: colors.bg,
    color: colors.text,
  }
}
const searchQuery = ref('')
const address = ref('Internet Explorer\\Projects')
const previousAddress = ref('')
const addressRef = ref(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)

const addressSuggestions = computed(() => {
  const base = [
    'Internet Explorer\\Projects',
    'Internet Explorer\\Projects\\GitHub',
    'Internet Explorer\\Projects\\Demo',
    'My Computer\\My Documents',
  ]

  const projectTerms = (projects.value || []).flatMap((project) => [
    `Internet Explorer\\Projects\\${project.name}`,
    project.name,
  ])

  const all = [...base, ...projectTerms]
  return buildAddressSuggestions(all, address.value, 8)
})

const filteredSuggestions = computed(() => addressSuggestions.value)

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) return projects.value

  const term = searchQuery.value.toLowerCase()
  return projects.value.filter((project) => {
    const haystack = [project.name, project.description, ...(project.tech || [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
})

onMounted(() => {
  loadContent()
})

const openProjectDetail = (projectId) => {
  windowsStore.openProjectDetail(projectId)
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
  searchQuery.value = raw === 'Projects' ? '' : raw
}

const clearSearch = () => {
  previousAddress.value = address.value
  searchQuery.value = ''
  address.value = 'Internet Explorer\\Projects'
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

const jumpToDocuments = () => {
  windowsStore.openWindow('documents')
}

const goBack = () => {
  if (!previousAddress.value) return
  const current = address.value
  address.value = previousAddress.value
  previousAddress.value = current
  runSearch()
}

const focusFirstProject = () => {
  const project = filteredProjects.value[0]
  if (project) {
    openProjectDetail(project.id)
  }
}

const openFirstGithub = () => {
  const project = filteredProjects.value.find((item) => item.github)
  if (project?.github) {
    window.open(project.github, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.projects {
  height: 100%;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  background: linear-gradient(180deg, #eef4fd 0%, #dbe8fa 100%);
  padding: 8px;
}

.results-count {
  margin: 0 0 8px;
  font-size: 11px;
  color: #2a4d83;
}

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.project-card {
  background: linear-gradient(180deg, #fbfdff 0%, #e3ecf8 100%);
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: transform 150ms ease, box-shadow 150ms ease;
  cursor: pointer;
}

.project-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #ffffff #5679a4 #5679a4 #ffffff;
}

.card-thumbnail {
  position: relative;
  height: 80px;
  overflow: hidden;
  border-bottom: 1px solid #a8a8a8;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 2px;
  text-transform: capitalize;
}

.card-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.project-title {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

.project-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: #24364d;
  flex: 1;
}

.tech-chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.chip {
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 3px;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 6px;
  margin-top: auto;
}

.action-link {
  flex: 1;
  padding: 4px 8px;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  text-decoration: none;
  color: #14355f;
  font-size: 11px;
  text-align: center;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.1s;
}

.action-link:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ebf2fb 100%);
}

.action-link:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}

.demo-link {
  font-weight: 700;
}

@media (max-width: 480px) {
  .projects-container {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-link {
    min-width: 100%;
  }
}
</style>
