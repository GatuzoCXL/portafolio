<script setup>
const emit = defineEmits(['done'])
</script>

<template>
  <section class="mobile-intro" @click="emit('done')">
    <div class="intro-orb">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="intro-brand">PORTAFOLIO DROID</div>
    <div class="intro-subtitle">Entorno móvil retro</div>

    <div class="intro-loader" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </section>
</template>

<style scoped>
.mobile-intro {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background:
    radial-gradient(circle at center, rgba(142, 207, 50, 0.12), transparent 32%),
    #000000;
  color: #d7ffd0;
  cursor: pointer;
  text-align: center;
}

.intro-orb {
  width: 64px;
  height: 64px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  transform: rotate(45deg);
}

.intro-orb span {
  display: block;
  border-radius: 6px;
  background: linear-gradient(135deg, #b7ff45, #5aa61e);
  box-shadow: 0 0 18px rgba(142, 207, 50, 0.36);
}

.intro-orb span:nth-child(3) {
  grid-column: 1 / 3;
}

.intro-brand {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.intro-subtitle,
.intro-hint {
  color: #8ecf32;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.intro-loader {
  display: flex;
  gap: 6px;
  margin-top: 12px;
}

.intro-loader span {
  width: 22px;
  height: 6px;
  border-radius: 999px;
  background: #1f2a16;
  animation: intro-pulse 1.1s infinite ease-in-out;
}

.intro-loader span:nth-child(2) { animation-delay: 0.12s; }
.intro-loader span:nth-child(3) { animation-delay: 0.24s; }
.intro-loader span:nth-child(4) { animation-delay: 0.36s; }

@keyframes intro-pulse {
  0%, 100% { background: #1f2a16; }
  50% { background: #8ecf32; }
}
</style>
