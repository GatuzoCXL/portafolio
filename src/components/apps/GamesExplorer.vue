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

      <template v-else-if="selectedGame.type === 'local'">
        <component :is="selectedGame.component" />
      </template>

      <template v-else>
        <div v-if="!iframeLaunched" class="game-card">
          <h3>{{ selectedGame.name }}</h3>
          <p>{{ selectedGame.description }}</p>
          <button class="btn-jugar" @click="launchIframe">Jugar</button>
        </div>
        <iframe
          v-else
          :key="selectedGame.id"
          :src="selectedGame.url"
          :title="selectedGame.name"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MemoriaGame from './MemoriaGame.vue'

const games = [
  {
    id: 'tetris',
    name: 'Tetris',
    type: 'iframe',
    url: 'https://tetris.com/play-tetris',
    description: 'Encaja las piezas y completa las líneas.',
  },
  {
    id: 'hextris',
    name: 'Hextris',
    type: 'iframe',
    url: 'https://hextris.io/',
    description: 'Gira el hexágono y agrupa los colores.',
  },
  {
    id: 'memoria',
    name: 'Memoria',
    type: 'local',
    component: MemoriaGame,
    description: 'Encuentra las parejas de cartas.',
  },
]

const selectedGame = ref(null)
const iframeLaunched = ref(false)

watch(selectedGame, () => {
  iframeLaunched.value = false
})

function launchIframe() {
  iframeLaunched.value = true
}
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
  font-size: 12px;
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
  background: #e8e8f0;
  box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.7), inset -1px -1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 12px;
  color: #555;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.game-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #14355f;
}

.game-card p {
  margin: 0;
  font-size: 13px;
  color: #333;
  text-align: center;
  line-height: 1.5;
}

.btn-jugar {
  padding: 6px 28px;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  font-size: 13px;
  font-weight: 700;
  color: #14355f;
  cursor: pointer;
}

.btn-jugar:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ebf2fb 100%);
}

.btn-jugar:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}

@media (max-width: 900px) {
  .games-explorer {
    grid-template-columns: 180px 1fr;
  }
}
</style>
