<template>
  <div class="contact">
    <XpWindowFrame>
      <template #sidebar>
        <section class="xp-task-group">
          <div class="xp-task-title">Tareas</div>
          <ul>
            <li><button class="xp-task-link" @click="scrollToProfile">Ver perfil</button></li>
            <li><button class="xp-task-link" @click="scrollToContact">Ver contactos</button></li>
            <li><button class="xp-task-link" @click="scrollToAvailability">Ver disponibilidad</button></li>
          </ul>
        </section>

        <section class="xp-task-group">
          <div class="xp-task-title">Accesos</div>
          <ul>
            <li><button class="xp-task-link" @click="openExternal('github')">GitHub</button></li>
            <li><button class="xp-task-link" @click="openExternal('linkedin')">LinkedIn</button></li>
            <li><button class="xp-task-link" @click="openDocuments">Mis Documentos</button></li>
          </ul>
        </section>
      </template>

      <div class="msn-shell">
        <header class="msn-topbar">
          <div class="msn-menu-row">
            <span>File</span>
            <span>Edit</span>
            <span>Actions</span>
            <span>Tools</span>
            <span>Help</span>
          </div>
          <div class="msn-toolbar-row">
            <button class="msn-tool-btn" @click="openExternal('linkedin')">
              <img :src="linkedinIcon" alt="LinkedIn" />
              <span>Perfil</span>
            </button>
            <button class="msn-tool-btn" @click="openDocuments">
              <img :src="documentsIcon" alt="Documentos" />
              <span>CV</span>
            </button>
            <button class="msn-tool-btn" @click="openExternal('github')">
              <img :src="githubIcon" alt="GitHub" />
              <span>Repos</span>
            </button>
          </div>
        </header>

        <div class="msn-layout">
          <section ref="profileSectionRef" class="msn-main-panel">
            <div class="conversation-card">
              <div class="conversation-head">
                <img :src="messengerIcon" alt="Messenger" class="conversation-avatar" />
                <div>
                  <strong>{{ profile.displayName }}</strong>
                  <p>{{ profile.personalMessage }}</p>
                </div>
              </div>

              <div class="conversation-log">
                <div v-for="item in timeline" :key="item.label" class="log-line">
                  <span class="log-bullet">●</span>
                  <div>
                    <strong>{{ item.label }}</strong>
                    <p>{{ item.value }}</p>
                  </div>
                </div>
              </div>

              <div class="nudge-strip">
                <span>
                  Consejo rápido:
                  <button class="inline-link" @click="openProjects">Proyectos</button>
                  y
                  <button class="inline-link" @click="openDocuments">Mis Documentos</button>
                  son el mejor punto de entrada si deseas una vista general.
                </span>
              </div>
            </div>

            <section ref="contactSectionRef" class="profile-card">
              <div class="profile-card-head">
                <strong>Tarjeta de contacto</strong>
                <span>{{ profile.city }}</span>
              </div>
              <div class="contact-grid">
                <button class="contact-tile" @click="openMail">
                  <span class="contact-label">Correo</span>
                  <span class="contact-value">{{ profile.email }}</span>
                </button>
                <button class="contact-tile" @click="openWhatsApp(profile.phonePrimary)">
                  <span class="contact-label">WhatsApp 1</span>
                  <span class="contact-value">{{ profile.phonePrimary }}</span>
                </button>
                <button class="contact-tile" @click="openWhatsApp(profile.phoneSecondary)">
                  <span class="contact-label">WhatsApp 2</span>
                  <span class="contact-value">{{ profile.phoneSecondary }}</span>
                </button>
                <button class="contact-tile" @click="openLinkedIn">
                  <span class="contact-label">LinkedIn</span>
                  <span class="contact-value">{{ profile.linkedinLabel }}</span>
                </button>
                <button class="contact-tile" @click="openGitHub">
                  <span class="contact-label">GitHub</span>
                  <span class="contact-value">{{ profile.githubLabel }}</span>
                </button>
                <button class="contact-tile" @click="openDocuments">
                  <span class="contact-label">Documentos</span>
                  <span class="contact-value">CV y certificados</span>
                </button>
              </div>
            </section>

            <section ref="availabilitySectionRef" class="status-card">
              <div class="status-row">
                <span class="status-dot"></span>
                <div>
                  <strong>Estado actual</strong>
                  <p>{{ profile.availability }}</p>
                </div>
              </div>
              <ul class="status-list">
                <li>Respuesta preferida: correo o WhatsApp.</li>
                <li>También disponible por LinkedIn para conversaciones profesionales.</li>
                <li>Zona horaria: Perú (GMT-5).</li>
              </ul>
            </section>
          </section>

          <aside class="msn-side-panel">
            <div class="display-box">
              <img :src="messengerIcon" alt="Avatar principal" />
            </div>
            <div class="display-box secondary">
              <img :src="userAvatarIcon" alt="Avatar secundario" />
            </div>
          </aside>
        </div>
      </div>
    </XpWindowFrame>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { assetUrl } from '@/utils/assetUrl'
import XpWindowFrame from '@/components/os/XpWindowFrame.vue'

const windowsStore = useWindowsStore()

const messengerIcon = assetUrl('icons/messenger.svg')
const userAvatarIcon = assetUrl('icons/user-avatar.svg')
const githubIcon = assetUrl('icons/brand-github.svg')
const linkedinIcon = assetUrl('icons/brand-linkedin.svg')
const documentsIcon = assetUrl('icons/documents.svg')

const profileSectionRef = ref(null)
const contactSectionRef = ref(null)
const availabilitySectionRef = ref(null)

const profile = {
  displayName: 'Leonardo Vargas Martínez',
  personalMessage: 'Disponible para conversar sobre productos, interfaces, automatización y desarrollo full stack.',
  city: 'Perú · Tecsup',
  email: 'martinvar.76@gmail.com',
  phonePrimary: '919530281',
  phoneSecondary: '963235280',
  linkedinLabel: 'leonardo-vargas-81a118387',
  githubLabel: 'GatuzoCXL',
  availability: 'Abierto a oportunidades, colaboraciones y conversaciones profesionales.',
}

const timeline = [
  {
    label: 'Presentación',
    value: 'Desarrollador Full Stack con foco en experiencia visual, backend e integración entre producto e infraestructura.',
  },
  {
    label: 'Diferencial',
    value: 'Combino desarrollo, criterio visual y base técnica en Linux, Windows, redes y despliegue para construir soluciones completas.',
  },
  {
    label: 'Canales directos',
    value: 'Correo, WhatsApp, LinkedIn y GitHub disponibles para revisar perfil, proyectos y contacto inmediato.',
  },
]

const openExternal = (target) => {
  if (target === 'github') {
    window.open('https://github.com/GatuzoCXL', '_blank', 'noopener,noreferrer')
    return
  }

  if (target === 'linkedin') {
    window.open('https://www.linkedin.com/in/leonardo-vargas-81a118387', '_blank', 'noopener,noreferrer')
  }
}

const openMail = () => {
  window.location.href = `mailto:${profile.email}`
}

const openWhatsApp = (number) => {
  window.open(`https://wa.me/51${number}`, '_blank', 'noopener,noreferrer')
}

const openLinkedIn = () => openExternal('linkedin')
const openGitHub = () => openExternal('github')

const openDocuments = () => {
  windowsStore.openWindow('documents')
}

const openProjects = () => {
  windowsStore.openWindow('internet-explorer')
}

const scrollToProfile = () => {
  profileSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const scrollToContact = () => {
  contactSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const scrollToAvailability = () => {
  availabilitySectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
.contact {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  background: linear-gradient(180deg, #edf4fd 0%, #d6e4f8 100%);
}

.msn-shell {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border: 1px solid #98b4d4;
  background: linear-gradient(180deg, #fdfefe 0%, #edf4fb 100%);
}

.msn-topbar {
  border-bottom: 1px solid #b8cce4;
  background: linear-gradient(180deg, #fdfefe 0%, #eef4fb 100%);
}

.msn-menu-row {
  display: flex;
  gap: 18px;
  padding: 5px 10px 4px;
  font-size: 11px;
  color: #273f67;
}

.msn-toolbar-row {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  border-top: 1px solid #fff;
  background: linear-gradient(180deg, #fbfdff 0%, #eaf2fc 100%);
}

.msn-tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid #8ea8c9;
  background: linear-gradient(180deg, #ffffff 0%, #e8f0fb 100%);
  font-size: 11px;
  color: #214d86;
}

.msn-tool-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.msn-layout {
  display: grid;
  grid-template-columns: 1fr 154px;
  gap: 10px;
  padding: 10px;
  min-height: 0;
  flex: 1;
}

.msn-main-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.conversation-card,
.profile-card,
.status-card,
.display-box {
  border: 1px solid #9bb6d8;
  background: linear-gradient(180deg, #ffffff 0%, #edf4fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65);
}

.conversation-card {
  padding: 10px;
}

.conversation-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.conversation-avatar {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.conversation-head strong {
  display: block;
  margin-bottom: 3px;
  color: #123d75;
  font-size: 13px;
}

.conversation-head p {
  margin: 0;
  color: #385781;
  font-size: 11px;
}

.conversation-log {
  border: 1px solid #97b2d4;
  background: #fff;
  min-height: 132px;
  padding: 8px 10px;
}

.log-line {
  display: flex;
  gap: 8px;
  margin-bottom: 9px;
  color: #1d3d69;
}

.log-line:last-child {
  margin-bottom: 0;
}

.log-bullet {
  color: #1f61b9;
  line-height: 1.4;
}

.log-line p {
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.35;
}

.nudge-strip {
  margin-top: 8px;
  padding: 6px 8px;
  border: 1px solid #c9dbf1;
  background: linear-gradient(180deg, #f8fbff 0%, #e8f0fb 100%);
  color: #355784;
  font-size: 11px;
}

.inline-link {
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0 2px;
  color: #0f4ba6;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.profile-card {
  padding: 0;
}

.profile-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: linear-gradient(180deg, #e7f0fb 0%, #d8e6f7 100%);
  border-bottom: 1px solid #a8bfdc;
  color: #173d73;
  font-size: 11px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 10px;
}

.contact-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #9db7d8;
  background: linear-gradient(180deg, #ffffff 0%, #eef5fc 100%);
  text-align: left;
  color: #123d75;
}

.contact-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #4b6993;
}

.contact-value {
  font-size: 11px;
  font-weight: 700;
}

.status-card {
  padding: 10px;
}

.status-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.status-row strong {
  color: #173d73;
}

.status-row p {
  margin: 2px 0 0;
  color: #355784;
  font-size: 11px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #9dff95 0%, #45b63b 65%, #2b7d26 100%);
  box-shadow: 0 0 0 1px rgba(32, 106, 30, 0.45);
  flex-shrink: 0;
}

.status-list {
  margin: 0;
  padding-left: 18px;
  color: #21456f;
  font-size: 11px;
  line-height: 1.45;
}

.msn-side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.display-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 154px;
  padding: 8px;
  background: linear-gradient(180deg, #fbfdff 0%, #eaf2fb 100%);
}

.display-box img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.display-box.secondary img {
  width: 88px;
  height: 88px;
}

@media (max-width: 900px) {
  .msn-layout {
    grid-template-columns: 1fr;
  }

  .msn-side-panel {
    flex-direction: row;
  }

  .display-box {
    flex: 1;
    min-height: 110px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
