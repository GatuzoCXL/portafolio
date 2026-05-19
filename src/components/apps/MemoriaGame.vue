<template>
  <div class="memoria-game">
    <div class="game-header">
      <span class="moves-label">Movimientos: {{ moves }}</span>
      <button class="btn-reset" @click="resetGame">Nueva partida</button>
    </div>

    <div class="card-grid">
      <div
        v-for="(card, index) in deck"
        :key="card.id"
        :class="['card', { flipped: card.isFlipped || card.isMatched, matched: card.isMatched }]"
        @click="flipCard(index)"
      >
        <div class="card-inner">
          <div class="card-back">?</div>
          <div class="card-front">{{ card.symbol }}</div>
        </div>
      </div>
    </div>

    <div v-if="isWon" class="win-overlay">
      <div class="win-dialog">
        <div class="win-titlebar">Memoria</div>
        <div class="win-body">
          <p class="win-message">¡Felicidades!</p>
          <p class="win-moves">Completado en {{ moves }} movimientos.</p>
          <button class="win-btn" @click="resetGame">Nueva partida</button>
        </div>
      </div>
    </div>
  </div>
</template>

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
    }, 600)
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

<style scoped>
.memoria-game {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #e8e8f0;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.moves-label {
  font-size: 12px;
  color: #24364d;
}

.btn-reset {
  padding: 4px 12px;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  font-size: 11px;
  color: #14355f;
  cursor: pointer;
}

.btn-reset:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ebf2fb 100%);
}

.btn-reset:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(8px, 1.5vw, 14px);
  width: min(90%, 700px);
  aspect-ratio: 1;
  margin: 0 auto;
  flex: 1;
  align-content: center;
  justify-content: center;
}

.card {
  aspect-ratio: 1;
  perspective: 600px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.35s ease;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-back,
.card-front {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  backface-visibility: hidden;
  border: 2px solid;
  border-radius: 4px;
  font-size: 22px;
}

.card-back {
  background: linear-gradient(135deg, #1a3a6e 0%, #0f1f3d 100%);
  border-color: #5a8fd4 #0a1a35 #0a1a35 #5a8fd4;
  color: #c8d8f0;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 18px;
}

.card-front {
  background: linear-gradient(135deg, #f8fbff 0%, #dce8fa 100%);
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  transform: rotateY(180deg);
}

.card.matched .card-front {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e8c8 100%);
  border-color: #88cc88 #338833 #338833 #88cc88;
}

.win-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
}

.win-dialog {
  width: 300px;
  background: #ece9d8;
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.35);
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.win-titlebar {
  height: 24px;
  background: linear-gradient(90deg, #0a4ca0 0%, #2f7ad2 45%, #2a67be 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 4px 0 8px;
  font-weight: 700;
}

.win-body {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.win-message {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #14355f;
}

.win-moves {
  margin: 0;
  font-size: 12px;
  color: #333;
}

.win-btn {
  margin-top: 4px;
  padding: 4px 20px;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  font-size: 11px;
  color: #14355f;
  cursor: pointer;
}

.win-btn:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ebf2fb 100%);
}

.win-btn:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}
</style>
