<template>
  <div class="music-app">
    <ExplorerChrome
      v-model:address="address"
      :suggestions="filteredSuggestions"
      :show-navigation-buttons="true"
      :can-go-back="!!previousAddress"
      :can-go-forward="false"
      @back="goBack"
      @forward="goForward"
      @go="runAddressAction"
      @pick-suggestion="pickSuggestion"
    >
      <template #sidebar>
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
          <div class="xp-item-list">
            <div class="xp-item-row">
              <span class="xp-item-icon">♪</span>
              <span class="xp-item-label">{{ musicStore.nowPlayingTitle || 'Sin reproducción' }}</span>
            </div>
            <div class="xp-item-row">
              <span class="xp-item-icon">{{ musicStore.isPlaying ? '▶' : '⏸' }}</span>
              <span class="xp-item-label">{{ musicStore.isPlaying ? 'Reproduciendo' : 'Pausado' }}</span>
            </div>
          </div>
        </section>
      </template>

      <div class="music-main">
        <div class="xp-content-area">
          <div class="xp-section" ref="controlsRef">
            <div class="xp-section-header">Reproducción</div>
            <div class="xp-control-strip">
              <button @click="send('prev')">⏮ Anterior</button>
              <button @click="send('toggle-play')">{{ musicStore.isPlaying ? '⏸ Pausar' : '▶ Reproducir' }}</button>
              <button @click="send('stop')">⏹ Detener</button>
              <button @click="send('next')">⏭ Siguiente</button>
              <span class="xp-sep"></span>
              <button class="widget-visibility-btn" @click="musicStore.widgetVisible = !musicStore.widgetVisible">
                {{ musicStore.widgetVisible ? 'Ocultar widget' : 'Mostrar widget' }}
              </button>
              <span class="xp-sep"></span>
              <span class="xp-status-text">
                Volumen: {{ musicStore.volume }} — {{ musicStore.nowPlayingTitle || 'Sin reproducción' }}
              </span>
            </div>
          </div>

          <div class="xp-section" ref="personalizationRef">
            <div class="xp-section-header">Configuración</div>
            <div class="xp-setting-row">
              <label>Skin</label>
              <select v-model="musicStore.skin">
                <option v-for="skin in musicStore.availableSkins" :key="skin.id" :value="skin.id">
                  {{ skin.label }}
                </option>
              </select>
            </div>

            <div class="xp-setting-row">
              <label>Barras ecualizador: {{ musicStore.eqBars }}</label>
              <input type="range" min="10" max="40" v-model.number="musicStore.eqBars" />
            </div>

            <div class="xp-setting-row">
              <label>Brillo ecualizador: {{ musicStore.eqGlow.toFixed(2) }}</label>
              <input type="range" min="0.2" max="1" step="0.05" v-model.number="musicStore.eqGlow" />
            </div>

            <div class="xp-setting-row">
              <label>Volumen global: {{ musicStore.volume }}</label>
              <input type="range" min="0" max="100" v-model.number="musicStore.volume" />
            </div>
          </div>

          <div class="xp-section">
            <div class="xp-section-header">Estado</div>
            <div class="xp-status-line">
              <span><strong>Reproduciendo:</strong> {{ musicStore.nowPlayingTitle }}</span>
              <span><strong>Canal:</strong> {{ musicStore.nowPlayingChannel || 'N/A' }}</span>
              <span><strong>Estado:</strong> {{ musicStore.isPlaying ? 'Reproduciendo' : 'Pausado/Detenido' }}</span>
            </div>
          </div>
        </div>
      </div>
    </ExplorerChrome>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'
import ExplorerChrome from '@/components/os/ExplorerChrome.vue'

const musicStore = useMusicStore()
const windowsStore = useWindowsStore()
const address = ref('Music Studio\\Player')
const previousAddress = ref('')
const controlsRef = ref(null)
const personalizationRef = ref(null)

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

const pickSuggestion = () => {
  runAddressAction()
}

const goBack = () => {
  if (!previousAddress.value) return
  const current = address.value
  address.value = previousAddress.value
  previousAddress.value = current
}

const goForward = () => {}

const jumpToDocuments = () => {
  windowsStore.openWindow('documents')
}
</script>

<style scoped>
.music-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.music-main {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

.xp-content-area {
  display: flex;
  flex-direction: column;
}

.xp-section {
  margin-bottom: 8px;
}

.xp-section:last-child {
  margin-bottom: 0;
}

.xp-section-header {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 0 3px;
  border-bottom: 1px solid #7f9db9;
  margin-bottom: 4px;
}

.xp-control-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

.xp-control-strip button,
.widget-visibility-btn {
  padding: 4px 8px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  background: #dfeaf8;
  font-size: 11px;
  text-align: center;
}

.xp-control-strip button:hover,
.widget-visibility-btn:hover {
  background: #ecf4ff;
}

.xp-control-strip button:active,
.widget-visibility-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.xp-sep {
  width: 1px;
  height: 16px;
  background: #7f9db9;
  margin: 0 4px;
}

.xp-status-text {
  font-size: 11px;
  color: #12355f;
}

.xp-setting-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 2px 0;
  margin-bottom: 4px;
}

.xp-setting-row:last-child {
  margin-bottom: 0;
}

.xp-setting-row label {
  font-size: 11px;
  min-width: 140px;
  white-space: nowrap;
}

.xp-setting-row select,
.xp-setting-row input[type='range'] {
  border: 1px solid #7f9db9;
  background: #fff;
  flex: 1;
}

.xp-setting-row select {
  min-height: 22px;
  color: #12355f;
  padding: 2px 6px;
}

.xp-setting-row select:focus,
.xp-setting-row select:active {
  color: #12355f;
  background: #fff;
  outline: 1px solid #2a68bf;
  outline-offset: 0;
}

.xp-setting-row select option {
  color: #12355f;
  background: #fff;
}

.xp-status-line {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11px;
  padding-top: 4px;
}

.xp-item-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.xp-item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 11px;
}

.xp-item-icon {
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.xp-item-label {
  color: #12355f;
}
</style>
