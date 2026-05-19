<template>
  <div class="projects xp-window-frame">
    <ExplorerChrome
      :address="address"
      :suggestions="addressSuggestions"
      :can-go-back="Boolean(previousAddress)"
      @update:address="address = $event"
      @back="goBack"
      @go="runSearch"
      @pick-suggestion="runSearch"
    >
      <template #toolbar-extras>
        <button class="xp-tool-btn xp-address-jump" @click="jumpToDocuments">Docs</button>
      </template>
      <template #sidebar>
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
      </template>
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
    </ExplorerChrome>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ExplorerChrome from '@/components/os/ExplorerChrome.vue'
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
  background: linear-gradient(180deg, #f6f9fe 0%, #e6effa 100%);
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
  background: linear-gradient(180deg, #ffffff 0%, #eef4fb 100%);
  border: 1px solid #9bb6d8;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.68);
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
  cursor: pointer;
}

.project-card:hover {
  background: linear-gradient(180deg, #ffffff 0%, #e8f0fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.82), 0 2px 6px rgba(47, 84, 147, 0.14);
  border-color: #7f9db9;
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
  color: #183d75;
  border-bottom: 1px solid #a8bdd8;
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
  background: linear-gradient(180deg, #ffffff 0%, #e4eef8 100%);
  border: 1px solid #8ea8c9;
  text-decoration: none;
  color: #14355f;
  font-size: 11px;
  text-align: center;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background 0.1s ease, border-color 0.1s ease;
}

.action-link:hover {
  background: linear-gradient(180deg, #ffffff 0%, #edf4fb 100%);
  border-color: #7f9db9;
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
