<template>
  <div class="games-explorer">
    <aside class="games-list">
      <h3>Juegos</h3>
      <button
        v-for="game in games"
        :key="game.id"
        :class="['game-button', { active: selectedGame?.id === game.id }]"
        @click="selectedGame = game"
      >
        {{ game.name }}
      </button>
    </aside>

    <section class="game-viewer">
      <div v-if="!selectedGame" class="placeholder">
        Selecciona un juego para cargarlo.
      </div>
      <iframe
        v-else
        :key="selectedGame.id"
        :src="selectedGame.url"
        :title="selectedGame.name"
        loading="lazy"
        allowfullscreen
      ></iframe>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const games = [
  {
    id: 'tetris',
    name: 'Tetris',
    url: 'https://tetris.com/play-tetris',
  },
  {
    id: 'hextris',
    name: 'Hextris',
    url: 'https://hextris.io/',
  },
]

const selectedGame = ref(null)
</script>

<style scoped>
.games-explorer {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 10px;
  height: 100%;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.games-list h3 {
  margin: 0 0 4px;
}

.game-button {
  text-align: left;
}

.game-button.active {
  font-weight: 700;
}

.game-viewer {
  min-height: 0;
  border: 1px solid #8d8d8d;
  background: #fff;
}

.placeholder {
  display: grid;
  place-items: center;
  height: 100%;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>