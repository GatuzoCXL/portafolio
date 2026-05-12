<script setup>
import { ref } from 'vue'
import MobileMemoryGame from './MobileMemoryGame.vue'
import SimonGame from './SimonGame.vue'

const games = [
  { id: 'memoria', label: 'Memoria', component: MobileMemoryGame },
  { id: 'simon', label: 'Simon', component: SimonGame },
]

const selectedGame = ref('memoria')
</script>

<template>
  <div class="mobile-games">
    <div class="game-tabs">
      <button
        v-for="game in games"
        :key="game.id"
        :class="['game-tab', { active: selectedGame === game.id }]"
        @click="selectedGame = game.id"
      >
        {{ game.label }}
      </button>
    </div>
    <div class="game-stage">
      <component :is="games.find(g => g.id === selectedGame)?.component" />
    </div>
  </div>
</template>

<style scoped>
.mobile-games {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
}

.game-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #252525;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.game-tab {
  flex: 1;
  padding: 10px;
  background: #2d2d2d;
  border: none;
  border-radius: 8px;
  color: #c4c4c4;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
}

.game-tab.active {
  background: #8ecf32;
  color: #0d1a06;
}

.game-tab:active {
  opacity: 0.8;
}

.game-stage {
  flex: 1;
  overflow: auto;
  min-height: 0;
}
</style>