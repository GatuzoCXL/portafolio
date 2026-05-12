<script setup>
import { ref, computed } from 'vue'

const PADS = [
  { color: '#2ecc71', activeColor: '#4ef68d', tone: 329.63 },
  { color: '#e74c3c', activeColor: '#ff6b6b', tone: 261.63 },
  { color: '#f1c40f', activeColor: '#ffe135', tone: 220.00 },
  { color: '#3498db', activeColor: '#5dade2', tone: 164.81 },
]

const sequence = ref([])
const playerIndex = ref(0)
const round = ref(0)
const activePad = ref(null)
const isPlaying = ref(false)
const gameOver = ref(false)
const started = ref(false)
const statusLabel = ref('')

let audioCtx = null
let playbackTimeouts = []
let playbackResolvers = []
let roundTimeout = null
let stopPlaybackFlag = false

const baseDuration = 400
const userClickDuration = 220

const playbackDuration = computed(() => {
  const speedUp = Math.floor((round.value - 1) / 3) * 60
  return Math.max(180, baseDuration - speedUp)
})

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

function playTone(freq, duration = 300) {
  ensureAudio()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  const now = audioCtx.currentTime
  gain.gain.setValueAtTime(0.15, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000)
  osc.start(now)
  osc.stop(now + duration / 1000)
}

function clearPendingTimers() {
  playbackTimeouts.forEach(clearTimeout)
  playbackTimeouts = []
  playbackResolvers.forEach((resolve) => resolve())
  playbackResolvers = []
  if (roundTimeout) {
    clearTimeout(roundTimeout)
    roundTimeout = null
  }
}

function stopPlayback() {
  stopPlaybackFlag = true
  clearPendingTimers()
  activePad.value = null
  isPlaying.value = false
}

function highlightPad(index, duration = 400) {
  activePad.value = index
  playTone(PADS[index].tone, duration)
  return new Promise((resolve) => {
    playbackResolvers.push(resolve)
    const t1 = setTimeout(() => {
      if (!stopPlaybackFlag) {
        activePad.value = null
      }
      const t2 = setTimeout(() => {
        resolve()
      }, Math.max(80, duration * 0.35))
      playbackTimeouts.push(t2)
    }, duration)
    playbackTimeouts.push(t1)
  })
}

async function playSequence() {
  stopPlaybackFlag = false
  isPlaying.value = true
  statusLabel.value = 'Observa'
  const gap = Math.max(100, playbackDuration.value * 0.3)
  for (let i = 0; i < sequence.value.length; i++) {
    if (stopPlaybackFlag) break
    await highlightPad(sequence.value[i], playbackDuration.value)
    if (stopPlaybackFlag) break
    if (i < sequence.value.length - 1) {
      await new Promise((resolve) => {
        playbackResolvers.push(resolve)
        const t = setTimeout(() => resolve(), gap)
        playbackTimeouts.push(t)
      })
    }
  }
  if (!stopPlaybackFlag) {
    statusLabel.value = 'Tu turno'
    isPlaying.value = false
  }
}

function getNextPad() {
  if (sequence.value.length === 0) {
    return Math.floor(Math.random() * 4)
  }
  const last = sequence.value[sequence.value.length - 1]
  let next = Math.floor(Math.random() * 4)
  let attempts = 0
  while (next === last && attempts < 2) {
    next = Math.floor(Math.random() * 4)
    attempts++
  }
  return next
}

function addStep() {
  sequence.value.push(getNextPad())
  round.value = sequence.value.length
}

function startGame() {
  stopPlayback()
  sequence.value = []
  playerIndex.value = 0
  round.value = 0
  gameOver.value = false
  started.value = true
  statusLabel.value = ''
  addStep()
  playSequence()
}

function resetGame() {
  stopPlayback()
  started.value = false
  gameOver.value = false
  sequence.value = []
  playerIndex.value = 0
  round.value = 0
  statusLabel.value = ''
}

function closeOverlay() {
  gameOver.value = false
}

async function handlePad(index) {
  if (isPlaying.value || !started.value || gameOver.value) return
  ensureAudio()

  await highlightPad(index, userClickDuration)

  if (sequence.value[playerIndex.value] !== index) {
    stopPlayback()
    gameOver.value = true
    started.value = false
    statusLabel.value = 'Fallaste'
    playTone(110, 600)
    return
  }

  playerIndex.value++

  if (playerIndex.value >= sequence.value.length) {
    playerIndex.value = 0
    statusLabel.value = 'Bien'
    roundTimeout = setTimeout(() => {
      addStep()
      playSequence()
    }, 700)
  }
}
</script>

<template>
  <div class="simon-game">
    <div class="simon-header">
      <div class="simon-meta">
        <span class="simon-round">Ronda: {{ round }}</span>
        <span v-if="statusLabel" class="simon-status" :class="{ 'status-bad': statusLabel === 'Fallaste' }">
          {{ statusLabel }}
        </span>
      </div>
      <button
        class="simon-btn"
        :class="{ 'simon-btn--reset': started }"
        @click="started ? resetGame() : startGame()"
      >
        {{ started ? 'Reiniciar' : 'Iniciar' }}
      </button>
    </div>

    <div class="simon-board">
      <button
        v-for="(pad, i) in PADS"
        :key="i"
        class="simon-pad"
        :class="{ 'simon-pad--active': activePad === i }"
        :style="{
          background: activePad === i ? pad.activeColor : pad.color,
          boxShadow: activePad === i ? `0 0 28px ${pad.activeColor}` : 'none',
          transform: activePad === i ? 'scale(1.06)' : 'scale(1)'
        }"
        :aria-label="`Pad ${i + 1}`"
        @click="handlePad(i)"
      ></button>
    </div>

    <div v-if="gameOver" class="simon-overlay">
      <div class="simon-dialog">
        <p class="simon-dialog-title">Juego terminado</p>
        <p class="simon-dialog-score">Rondas completadas: {{ round }}</p>
        <button class="simon-btn" @click="closeOverlay">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simon-game {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: #1a1a1a;
  box-sizing: border-box;
}

.simon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
}

.simon-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.simon-round {
  font-size: 14px;
  font-weight: 600;
  color: #8ecf32;
}

.simon-status {
  font-size: 12px;
  font-weight: 600;
  color: #c4c4c4;
  min-height: 16px;
}

.simon-status.status-bad {
  color: #e74c3c;
}

.simon-btn {
  padding: 10px 20px;
  background: #8ecf32;
  border: none;
  border-radius: 10px;
  color: #0d1a06;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  min-width: 92px;
  transition: opacity 0.15s, transform 0.1s;
}

.simon-btn--reset {
  background: #2d2d2d;
  border: none;
  color: #f2eef7;
}

.simon-btn:active {
  opacity: 0.85;
  transform: scale(0.97);
}

.simon-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 340px;
  aspect-ratio: 1;
}

.simon-pad {
  border: none;
  border-radius: 16px;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
  transition: background 0.08s, box-shadow 0.08s, transform 0.08s;
}

.simon-pad--active {
  z-index: 1;
}

.simon-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-items: center;
  padding: 16px;
}

.simon-dialog {
  background: #252525;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  width: 100%;
  max-width: 280px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

.simon-dialog-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #f2eef7;
}

.simon-dialog-score {
  margin: 0;
  font-size: 14px;
  color: #a0a0a0;
}
</style>
