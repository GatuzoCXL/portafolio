<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="runStore.isOpen" class="run-overlay" @click="runStore.close()">
        <div class="run-window" @click.stop>
          <div class="run-titlebar">Run</div>
          <div class="run-body">
            <p>Type the name of a program, folder, document, or Internet resource.</p>

            <div class="run-row">
              <label>Open:</label>
              <input
                ref="inputRef"
                v-model="query"
                class="run-input"
                type="text"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="executeSelected"
                @keydown.tab.prevent="completeWithHighlighted"
                @keydown.esc.prevent="runStore.close()"
              />
            </div>

            <div v-if="suggestions.length" class="run-suggestions">
              <button
                v-for="(item, idx) in suggestions"
                :key="item.id"
                class="run-suggestion"
                :class="{ active: idx === selected }"
                @mousedown.prevent="execute(item)"
              >
                {{ item.label }}
              </button>
            </div>

            <div class="run-actions">
              <button @click="executeSelected">OK</button>
              <button @click="runStore.close()">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRunLauncherStore } from '@/stores/runLauncher'
import { useWindowsStore } from '@/stores/windows'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { buildAddressSuggestions } from '@/utils/addressSuggestions'

const runStore = useRunLauncherStore()
const windowsStore = useWindowsStore()
const { documents, loadContent } = usePortfolioContent()

const inputRef = ref(null)
const query = ref('')
const selected = ref(0)

const commands = [
  { id: 'documents', label: 'documents', action: () => windowsStore.openWindow('documents') },
  { id: 'cv', label: 'cv', action: () => openCv() },
  { id: 'projects', label: 'projects', action: () => windowsStore.openWindow('internet-explorer') },
  { id: 'internet', label: 'internet explorer', action: () => windowsStore.openWindow('internet-explorer') },
  { id: 'contact', label: 'contact', action: () => windowsStore.openWindow('messenger') },
  { id: 'music', label: 'music', action: () => windowsStore.openWindow('music-player') },
  { id: 'my-pc', label: 'my computer', action: () => windowsStore.openWindow('my-pc') },
  { id: 'games', label: 'games', action: () => windowsStore.openWindow('games-folder') },
]

const openCv = async () => {
  await loadContent()
  windowsStore.openWindow('documents')
  if (documents.value?.cv?.url) {
    window.open(documents.value.cv.url, '_blank', 'noopener,noreferrer')
  }
}

const suggestions = computed(() => {
  const labels = commands.map((item) => item.label)
  const items = buildAddressSuggestions(labels, query.value, 8)
  return items.map((label) => commands.find((cmd) => cmd.label === label)).filter(Boolean)
})

const move = (delta) => {
  if (!suggestions.value.length) return
  selected.value = (selected.value + delta + suggestions.value.length) % suggestions.value.length
}

const completeWithHighlighted = () => {
  if (!suggestions.value.length) return
  const picked = suggestions.value[selected.value]
  if (picked?.label) {
    query.value = picked.label
  }
}

const execute = (item) => {
  item?.action?.()
  runStore.close()
}

const executeSelected = () => {
  if (suggestions.value.length) {
    execute(suggestions.value[selected.value])
    return
  }

  const raw = query.value.toLowerCase()
  const fallback = commands.find((cmd) => raw.includes(cmd.label))
  if (fallback) execute(fallback)
}

watch(
  () => runStore.isOpen,
  async (open) => {
    if (!open) {
      query.value = ''
      selected.value = 0
      return
    }

    await nextTick()
    inputRef.value?.focus()
  }
)
</script>

<style scoped>
.run-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 21000;
  display: grid;
  place-items: center;
}

.run-window {
  width: min(420px, calc(100vw - 20px));
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #ece9d8;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.35);
}

.run-titlebar {
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(90deg, #0a4ca0 0%, #2f7ad2 45%, #2a67be 100%);
}

.run-body {
  padding: 10px;
  font-size: 11px;
}

.run-body p {
  margin: 0 0 10px;
}

.run-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
}

.run-input {
  height: 22px;
  border: 1px solid #7f9db9;
  padding: 0 6px;
}

.run-suggestions {
  margin-top: 6px;
  border: 1px solid #7f9db9;
  background: #fff;
  max-height: 130px;
  overflow: auto;
}

.run-suggestion {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 4px 6px;
}

.run-suggestion:hover,
.run-suggestion.active {
  background: linear-gradient(90deg, #2a68bf, #3b89dd);
  color: #fff;
}

.run-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
