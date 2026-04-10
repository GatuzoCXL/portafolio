<template>
  <div class="music-app xp-window-frame">
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
        <button class="xp-tool-btn go-btn" @click="runAddressAction">Go</button>
        <button class="xp-tool-btn xp-address-jump" @click="jumpToDocuments">Docs</button>
      </div>
    </div>

    <div class="xp-page-shell">
    <aside class="xp-sidebar-panel">
      <section class="xp-task-group">
        <div class="xp-task-title">Player Tasks</div>
        <ul>
          <li><button class="xp-task-link" @click="focusControls">Controlar reproducción</button></li>
          <li><button class="xp-task-link" @click="toggleWidget">Mostrar/ocultar widget</button></li>
          <li><button class="xp-task-link" @click="focusPersonalization">Configurar skin y ecualizador</button></li>
        </ul>
      </section>

      <section class="xp-task-group">
        <div class="xp-task-title">Now Playing</div>
        <ul>
          <li>{{ musicStore.nowPlayingTitle }}</li>
        </ul>
      </section>
    </aside>

    <main class="xp-main-panel music-main">
    <fieldset class="group" ref="controlsRef">
      <legend>Controles del reproductor</legend>

      <div class="controls-row">
        <button @click="send('prev')">⏮ Anterior</button>
        <button @click="send('toggle-play')">{{ musicStore.isPlaying ? '⏸ Pausar' : '▶ Reproducir' }}</button>
        <button @click="send('stop')">⏹ Detener</button>
        <button @click="send('next')">⏭ Siguiente</button>
      </div>

      <div class="widget-toggle">
        <button class="widget-visibility-btn" @click="musicStore.widgetVisible = !musicStore.widgetVisible">
          {{ musicStore.widgetVisible ? 'Ocultar widget del escritorio' : 'Mostrar widget en escritorio' }}
        </button>
      </div>
    </fieldset>

    <fieldset class="group" ref="personalizationRef">
      <legend>Personalización</legend>

      <div class="setting">
        <label>Skin</label>
        <select v-model="musicStore.skin">
          <option v-for="skin in musicStore.availableSkins" :key="skin.id" :value="skin.id">
            {{ skin.label }}
          </option>
        </select>
      </div>

      <div class="setting">
        <label>Barras ecualizador: {{ musicStore.eqBars }}</label>
        <input type="range" min="10" max="40" v-model.number="musicStore.eqBars" />
      </div>

      <div class="setting">
        <label>Brillo ecualizador: {{ musicStore.eqGlow.toFixed(2) }}</label>
        <input type="range" min="0.2" max="1" step="0.05" v-model.number="musicStore.eqGlow" />
      </div>

      <div class="setting">
        <label>Volumen global: {{ musicStore.volume }}</label>
        <input type="range" min="0" max="100" v-model.number="musicStore.volume" />
      </div>
    </fieldset>

    <fieldset class="group status">
      <legend>Estado en vivo</legend>
      <p><strong>Reproduciendo:</strong> {{ musicStore.nowPlayingTitle }}</p>
      <p><strong>Canal:</strong> {{ musicStore.nowPlayingChannel || 'N/A' }}</p>
      <p><strong>Estado:</strong> {{ musicStore.isPlaying ? 'Reproduciendo' : 'Pausado/Detenido' }}</p>
    </fieldset>
    </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'

const musicStore = useMusicStore()
const windowsStore = useWindowsStore()
const address = ref('Music Studio\\Player')
const previousAddress = ref('')
const addressRef = ref(null)
const controlsRef = ref(null)
const personalizationRef = ref(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)

const addressSuggestions = [
  'Music Studio\\Player',
  'Music Studio\\Player\\Controls',
  'Music Studio\\Player\\Personalization',
  'Music Studio\\Player\\Widget',
  'Music Studio\\Player\\Skins',
  'Music Studio\\Player\\Equalizer',
  'My Computer\\My Documents',
  'MSN Messenger\\Contact',
  'Internet Explorer\\Projects',
]

const filteredSuggestions = computed(() => buildAddressSuggestions(addressSuggestions, address.value, 8))

const send = (type) => {
  musicStore.sendCommand(type)
}

const setAddress = (value) => {
  previousAddress.value = address.value
  address.value = value
}

const focusAddress = async () => {
  await nextTick()
  addressRef.value?.focus()
  addressRef.value?.select?.()
}

const focusControls = () => {
  setAddress('Music Studio\\Player\\Controls')
  controlsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const focusPersonalization = () => {
  setAddress('Music Studio\\Player\\Personalization')
  personalizationRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const toggleWidget = () => {
  setAddress('Music Studio\\Player\\Widget')
  musicStore.widgetVisible = !musicStore.widgetVisible
}

const runAddressAction = () => {
  previousAddress.value = address.value
  showSuggestions.value = false
  const term = address.value.toLowerCase()

  const quickWindow = resolveWindowShortcut(address.value)
  if (quickWindow) {
    windowsStore.openWindow(quickWindow)
    return
  }

  if (term.includes('control')) {
    focusControls()
    return
  }

  if (term.includes('personal') || term.includes('skin') || term.includes('equalizer')) {
    focusPersonalization()
    return
  }

  if (term.includes('widget')) {
    toggleWidget()
  }
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
  runAddressAction()
}

const handleEnter = () => {
  if (showSuggestions.value && filteredSuggestions.value.length) {
    const picked = filteredSuggestions.value[selectedSuggestionIndex.value]
    if (picked) {
      pickSuggestion(picked)
      return
    }
  }

  runAddressAction()
}

const hideSuggestionsSoon = () => {
  window.setTimeout(() => {
    showSuggestions.value = false
  }, 100)
}

const goBack = () => {
  if (!previousAddress.value) return
  const current = address.value
  address.value = previousAddress.value
  previousAddress.value = current
}

const jumpToDocuments = () => {
  windowsStore.openWindow('documents')
}
</script>

<style scoped>
.music-app {
  height: 100%;
}

.music-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group {
  padding: 8px;
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #eef5ff;
}

.group legend {
  padding: 2px 8px;
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #ece9d8;
  font-size: 11px;
  font-weight: 700;
}

.controls-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.controls-row button,
.widget-visibility-btn {
  padding: 6px 8px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  background: #dfeaf8;
  font-size: 11px;
  text-align: center;
}

.controls-row button:hover,
.widget-visibility-btn:hover {
  background: #ecf4ff;
}

.controls-row button:active,
.widget-visibility-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.widget-toggle {
  margin-top: 8px;
  font-size: 11px;
}

.widget-visibility-btn {
  width: 100%;
}

.setting {
  display: grid;
  gap: 4px;
  margin-bottom: 8px;
}

.setting select,
.setting input[type='range'] {
  border: 1px solid #7f9db9;
  background: #fff;
}

.setting select {
  min-height: 22px;
  color: #12355f;
  padding: 2px 6px;
}

.setting select:focus,
.setting select:active {
  color: #12355f;
  background: #fff;
  outline: 1px solid #2a68bf;
  outline-offset: 0;
}

.setting select option {
  color: #12355f;
  background: #fff;
}

.status p {
  margin: 4px 0;
  font-size: 11px;
}
</style>
