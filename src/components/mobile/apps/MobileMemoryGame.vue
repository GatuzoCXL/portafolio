<script setup>
import { ref } from 'vue'

const PAIRS = 8
const SYMBOLS = ['♥', '♦', '♣', '♠', '★', '●', '▲', '◆']

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildDeck() {
  const symbols = SYMBOLS.slice(0, PAIRS)
  const cards = symbols.flatMap((symbol, pairId) => [
    { id: `${pairId}-a`, pairId, symbol, isFlipped: false, isMatched: false },
    { id: `${pairId}-b`, pairId, symbol, isFlipped: false, isMatched: false },
  ])
  return shuffle(cards)
}

const deck = ref(buildDeck())
const flippedIndices = ref([])
const moves = ref(0)
const isWon = ref(false)
const isLocked = ref(false)

function flipCard(index) {
  if (isLocked.value) return
  const card = deck.value[index]
  if (card.isFlipped || card.isMatched) return
  if (flippedIndices.value.length >= 2) return

  card.isFlipped = true
  flippedIndices.value.push(index)

  if (flippedIndices.value.length === 2) {
    moves.value++
    checkMatch()
  }
}

function checkMatch() {
  const [i1, i2] = flippedIndices.value
  const c1 = deck.value[i1]
  const c2 = deck.value[i2]

  if (c1.pairId === c2.pairId) {
    c1.isMatched = true
    c2.isMatched = true
    flippedIndices.value = []

    if (deck.value.every((c) => c.isMatched)) {
      isWon.value = true
    }
  } else {
    isLocked.value = true
    setTimeout(() => {
      c1.isFlipped = false
      c2.isFlipped = false
      flippedIndices.value = []
      isLocked.value = false
    }, 700)
  }
}

function resetGame() {
  deck.value = buildDeck()
  flippedIndices.value = []
  moves.value = 0
  isWon.value = false
  isLocked.value = false
}
</script>

<template>
  <div class="mobile-memory">
    <div class="memory-header">
      <span class="memory-moves">Movimientos: {{ moves }}</span>
      <button class="memory-btn" @click="resetGame">Reiniciar</button>
    </div>

    <div class="memory-grid">
      <div
        v-for="(card, index) in deck"
        :key="card.id"
        :class="['memory-card', { flipped: card.isFlipped || card.isMatched, matched: card.isMatched }]"
        @click="flipCard(index)"
      >
        <div class="memory-card-inner">
          <div class="memory-card-back">
            <span class="memory-card-accent"></span>
          </div>
          <div class="memory-card-front">
            <span class="memory-symbol">{{ card.symbol }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isWon" class="memory-overlay">
      <div class="memory-dialog">
        <p class="memory-dialog-title">Completado</p>
        <p class="memory-dialog-sub">Movimientos: {{ moves }}</p>
        <button class="memory-btn memory-btn--primary" @click="resetGame">Nueva partida</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-memory {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  box-sizing: border-box;
}

.memory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.memory-moves {
  font-size: 14px;
  font-weight: 600;
  color: #8ecf32;
}

.memory-btn {
  padding: 10px 20px;
  background: #2d2d2d;
  border: none;
  border-radius: 10px;
  color: #f2eef7;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  min-width: 92px;
  transition: opacity 0.15s, transform 0.1s;
}

.memory-btn:active {
  opacity: 0.85;
  transform: scale(0.97);
}

.memory-btn--primary {
  background: #8ecf32;
  color: #0d1a06;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.memory-card {
  aspect-ratio: 1;
  perspective: 600px;
  cursor: pointer;
}

.memory-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.memory-card.flipped .memory-card-inner {
  transform: rotateY(180deg);
}

.memory-card-back,
.memory-card-front {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  backface-visibility: hidden;
  border-radius: 12px;
}

.memory-card-back {
  background: linear-gradient(135deg, #1f2d1f 0%, #162016 100%);
  border: 2px solid #2a3a2a;
}

.memory-card-accent {
  width: 28%;
  height: 28%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #8ecf32, #4a8a1a);
  opacity: 0.35;
}

.memory-card-front {
  background: linear-gradient(135deg, #1e2a23 0%, #15201a 100%);
  border: 2px solid #2e4a38;
  transform: rotateY(180deg);
}

.memory-symbol {
  font-size: 26px;
  line-height: 1;
  color: #8ecf32;
  text-shadow: 0 0 10px rgba(142, 207, 50, 0.35);
}

.memory-card.matched .memory-card-front {
  background: linear-gradient(135deg, #1e3020 0%, #152618 100%);
  border-color: #4a8a2a;
}

.memory-card.matched .memory-symbol {
  color: #a8e060;
  text-shadow: 0 0 14px rgba(142, 207, 50, 0.55);
}

.memory-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  padding: 16px;
}

.memory-dialog {
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

.memory-dialog-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #f2eef7;
}

.memory-dialog-sub {
  margin: 0;
  font-size: 14px;
  color: #a0a0a0;
}
</style>