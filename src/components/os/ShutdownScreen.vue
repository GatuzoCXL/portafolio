<template>
  <Transition name="shutdown">
    <div
      v-if="visible"
      class="shutdown-screen"
      :class="{ 'powering-off': isPoweringOff, 'is-black': isBlack }"
      role="dialog"
      aria-label="Apagando"
    >
      <div class="shutdown-vignette"></div>
      <div v-if="!isBlack" class="shutdown-content">
        <div class="shutdown-logo">
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

        <p class="shutdown-message">Cerrando sesion...</p>
        <p class="shutdown-submessage">Guardando configuracion... Apagando.</p>

        <div class="shutdown-loader" aria-hidden="true">
          <span class="dot" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 120}ms` }"></span>
        </div>
      </div>

      <div v-if="isPoweringOff && !isBlack" class="power-off-line" aria-hidden="true"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useXPSound } from '@/composables/useXPSound'

const visible = ref(true)
const isPoweringOff = ref(false)
const isBlack = ref(false)
const { playShutdownSound } = useXPSound()

onMounted(() => {
  playShutdownSound()

  // Secuencia: pantalla de apagado -> efecto CRT off -> negro permanente.
  window.setTimeout(() => {
    isPoweringOff.value = true
  }, 1400)

  window.setTimeout(() => {
    isBlack.value = true
  }, 2050)
})
</script>

<style scoped>
.shutdown-screen {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  overflow: hidden;
}

.shutdown-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(22, 30, 50, 0.25) 0%, #000 72%);
  animation: vignette-pulse 1.6s ease-in-out infinite;
}

.shutdown-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.power-off-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: #d9ecff;
  box-shadow: 0 0 18px rgba(110, 185, 255, 0.95);
  transform: translateY(-50%) scaleX(0);
  animation: crt-collapse 0.55s ease-in forwards;
}

.shutdown-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-flag {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  width: 50px;
  height: 50px;
  transform: perspective(100px) rotateY(-10deg);
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.12));
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
  font-size: 34px;
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

.shutdown-message {
  color: #d8d8d8;
  font-size: 12px;
  letter-spacing: 0.4px;
  font-family: 'Trebuchet MS', sans-serif;
  margin: 6px 0 0;
}

.shutdown-submessage {
  color: #9d9d9d;
  font-size: 11px;
  margin: 0;
  font-family: 'Trebuchet MS', sans-serif;
}

.shutdown-loader {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5f8de0;
  box-shadow: 0 0 8px rgba(95, 141, 224, 0.7);
  opacity: 0.25;
  animation: dot-pulse 0.95s ease-in-out infinite;
}

.shutdown-enter-active {
  animation: shutdown-in 0.42s ease-out forwards;
}

.shutdown-screen.powering-off .shutdown-content {
  animation: content-fade 0.45s ease-in forwards;
}

.shutdown-screen.is-black .shutdown-vignette {
  opacity: 0;
}

@keyframes shutdown-in {
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes content-fade {
  from {
    opacity: 1;
    filter: blur(0);
  }
  to {
    opacity: 0;
    filter: blur(1.4px);
  }
}

@keyframes crt-collapse {
  0% {
    transform: translateY(-50%) scaleX(0);
    opacity: 0;
  }
  25% {
    transform: translateY(-50%) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scaleX(0);
    opacity: 0;
  }
}

@keyframes dot-pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes vignette-pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>
