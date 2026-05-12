<template>
  <div class="mobile-contact">
    <header class="contact-header">
      <div class="contact-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <div>
        <h1 class="contact-greeting">Hola</h1>
        <p class="contact-subtitle">Gracias por visitar mi portafolio</p>
      </div>
    </header>

    <section class="contact-section">
      <h2 class="section-title">Redes</h2>
      <div class="social-grid">
        <a href="https://github.com/GatuzoCXL" target="_blank" rel="noopener noreferrer" class="social-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/leonardo-vargas-81a118387" target="_blank" rel="noopener noreferrer" class="social-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>LinkedIn</span>
        </a>
        <a href="mailto:martinvar.76@gmail.com" class="social-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 6.5L22 7" />
          </svg>
          <span>Email</span>
        </a>
      </div>
    </section>

    <section class="contact-section">
      <h2 class="section-title">Contacto directo</h2>
      <div class="social-grid direct-grid">
        <button type="button" class="social-item" @click="openWhatsAppSelector">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        <button type="button" class="social-item" @click="showNumbers = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span>Nro de Contacto</span>
        </button>
      </div>
    </section>

    <section class="contact-section">
      <h2 class="section-title">Estado</h2>
      <p class="status-text">Disponible para proyectos y colaboraciones interesantes.</p>
    </section>

    <Teleport to="body">
      <div
        v-if="showNumbers"
        class="contact-overlay"
        role="dialog"
        aria-label="Números de contacto"
        @click.self="showNumbers = false"
      >
        <div class="contact-sheet">
          <div class="contact-sheet-header">
            <span class="contact-sheet-title">Números de contacto</span>
            <button class="contact-sheet-close" @click="showNumbers = false" aria-label="Cerrar">×</button>
          </div>
          <div class="contact-sheet-body">
            <p class="contact-sheet-hint">Puedes escribirme por WhatsApp o guardar el número.</p>
            <div class="contact-sheet-numbers">
              <a
                v-for="(num, idx) in phoneNumbers"
                :key="idx"
                :href="`tel:${num}`"
                class="contact-sheet-number"
              >
                {{ num }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showWhatsApp"
        class="contact-overlay"
        role="dialog"
        aria-label="Contacto por WhatsApp"
        @click.self="showWhatsApp = false"
      >
        <div class="contact-sheet">
          <div class="contact-sheet-header">
            <span class="contact-sheet-title">Contacto por WhatsApp</span>
            <button class="contact-sheet-close" @click="showWhatsApp = false" aria-label="Cerrar">×</button>
          </div>
          <div class="contact-sheet-body">
            <p class="contact-sheet-hint">Selecciona un número para iniciar la conversación.</p>
            <div class="contact-sheet-numbers">
              <button
                v-for="(num, idx) in phoneNumbers"
                :key="idx"
                type="button"
                class="contact-sheet-number"
                @click="openWhatsAppLink(num)"
              >
                {{ num }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const showNumbers = ref(false)
const showWhatsApp = ref(false)

const digits1 = [9, 1, 9, 5, 3, 0, 2, 8, 1]
const digits2 = [9, 5, 1, 7, 6, 6, 6, 7, 1]

const phoneNumbers = computed(() => [
  digits1.join(''),
  digits2.join('')
])

const openWhatsAppSelector = () => {
  showWhatsApp.value = true
}

const openWhatsAppLink = (num) => {
  const number = '51' + num
  window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.mobile-contact {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #1a1a1a;
  min-height: 100%;
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #1e4e95, #2e74c7);
  border-radius: 12px;
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.contact-greeting {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.contact-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.contact-section {
  background: #252525;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #8ecf32;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.direct-grid {
  grid-template-columns: repeat(2, 1fr);
}

.social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: #2d2d2d;
  border-radius: 10px;
  color: #c4c4c4;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.15s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.social-item:active {
  background: #333;
}

.status-text {
  margin: 0;
  font-size: 13px;
  color: #8e8e8e;
  font-style: italic;
}

.contact-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 10000;
}

.contact-sheet {
  width: 100%;
  background: #1a1a1a;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.contact-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.contact-sheet-title {
  font-size: 14px;
  font-weight: 600;
  color: #f2eef7;
}

.contact-sheet-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #333;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.contact-sheet-body {
  padding: 20px 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-sheet-hint {
  margin: 0;
  font-size: 13px;
  color: #8e8e8e;
  text-align: center;
}

.contact-sheet-numbers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-sheet-number {
  display: block;
  width: 100%;
  text-align: center;
  padding: 12px;
  background: #2d2d2d;
  border-radius: 10px;
  color: #f2eef7;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.contact-sheet-number:active {
  background: #333;
}
</style>
