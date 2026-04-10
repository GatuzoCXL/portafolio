<template>
  <Transition name="boot-fade" @after-leave="$emit('done')">
    <div v-if="visible" class="boot-screen">
      <div class="boot-bg"></div>
      <div class="boot-scanline"></div>

      <div class="boot-content">
        <div class="xp-logo">
          <div class="logo-flag">
            <div class="flag-tl"></div>
            <div class="flag-tr"></div>
            <div class="flag-bl"></div>
            <div class="flag-br"></div>
          </div>
          <div class="logo-text">
            <span class="logo-windows">Microsoft</span>
            <span class="logo-xp">Windows <em>XP</em></span>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-track" :style="{ '--progress-blocks': totalBlocks }">
            <div
              v-for="i in totalBlocks"
              :key="i"
              class="progress-block"
              :class="{ active: i <= activeBlocks, lit: i === activeBlocks }"
            ></div>
          </div>
        </div>

        <p class="boot-tagline">Edicion profesional</p>
        <p v-if="!hasStarted" class="boot-hint">Haz click o presiona una tecla para iniciar</p>
      </div>

      <div class="boot-bottom-glow"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['done'])

const visible = ref(true)
const hasStarted = ref(false)
const totalBlocks = 12
const activeBlocks = ref(0)

const startBoot = () => {
  if (hasStarted.value) return
  hasStarted.value = true

  let block = 0
  const interval = setInterval(() => {
    block += 1
    activeBlocks.value = block
    if (block >= totalBlocks) {
      clearInterval(interval)
      setTimeout(() => {
        visible.value = false
      }, 400)
    }
  }, 210)
}

onMounted(() => {
  const once = () => {
    startBoot()
    window.removeEventListener('click', once)
    window.removeEventListener('keydown', once)
    window.removeEventListener('touchstart', once)
  }

  window.addEventListener('click', once, { once: true })
  window.addEventListener('keydown', once, { once: true })
  window.addEventListener('touchstart', once, { once: true })
})
</script>

<style scoped>
.boot-screen {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.boot-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a14 0%, #000 70%);
}

.boot-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.02) 0,
    rgba(255, 255, 255, 0.02) 1px,
    transparent 2px,
    transparent 3px
  );
  pointer-events: none;
}

.boot-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  animation: boot-float 2.2s ease-in-out infinite;
}

.xp-logo {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-flag {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  width: 52px;
  height: 52px;
  transform: perspective(100px) rotateY(-10deg);
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.15));
}

.flag-tl { background: #f25022; border-radius: 3px 0 0 0; }
.flag-tr { background: #80ba01; border-radius: 0 3px 0 0; }
.flag-bl { background: #00a4ef; border-radius: 0 0 0 3px; }
.flag-br { background: #ffb902; border-radius: 0 0 3px 0; }

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-windows {
  font-size: 13px;
  color: #c8c8c8;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.logo-xp {
  font-size: 36px;
  color: #fff;
  font-weight: 300;
  letter-spacing: -0.5px;
}

.logo-xp em {
  font-style: italic;
  font-weight: 700;
  color: #5599ff;
  margin-left: 5px;
}

.progress-container {
  width: 220px;
}

.progress-track {
  display: grid;
  grid-template-columns: repeat(var(--progress-blocks), minmax(0, 1fr));
  gap: 3px;
  padding: 3px;
  border: 1px solid #333;
  border-radius: 2px;
  height: 14px;
  align-items: center;
  box-sizing: border-box;
}

.progress-block {
  width: 100%;
  height: 9px;
  background: #1a1a1a;
  border-radius: 1px;
  transition: background 0.05s ease, transform 0.08s ease;
}

.progress-block.active {
  background: linear-gradient(180deg, #76c442 0%, #3a8a10 50%, #57a825 100%);
  box-shadow: 0 0 4px rgba(100, 200, 50, 0.6);
}

.progress-block.lit {
  background: linear-gradient(180deg, #aaee70 0%, #5cb820 50%, #76c442 100%);
  box-shadow: 0 0 8px rgba(140, 220, 80, 0.9);
  transform: scale(1.06);
}

.boot-tagline {
  color: #888;
  font-size: 11px;
  letter-spacing: 1px;
  margin: -20px 0 0;
  font-family: 'Trebuchet MS', sans-serif;
}

.boot-bottom-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #0a1f4a 0%, #1d4ea3 50%, #0a1f4a 100%);
  opacity: 0.8;
}

.boot-hint {
  margin: -24px 0 0;
  color: #9bb6dc;
  font-size: 11px;
  letter-spacing: 0.4px;
  font-family: 'Trebuchet MS', sans-serif;
  animation: blink-hint 1.15s ease-in-out infinite;
}

.boot-fade-leave-active {
  transition: opacity 0.6s ease;
}

.boot-fade-leave-to {
  opacity: 0;
}

@keyframes boot-float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes blink-hint {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}
</style>
