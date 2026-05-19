<template>
  <div class="about-me">
    <section class="hero-panel">
      <div class="hero-main">
        <div class="hero-title-row">
          <img :src="computerIcon" alt="Mi PC" class="hero-icon" />
          <div>
            <h1>Leonardo Vargas Martínez</h1>
            <p>Desarrollador Full Stack · Perú · Tecsup</p>
          </div>
        </div>

        <div class="hero-links">
          <a href="https://github.com/GatuzoCXL" target="_blank" rel="noopener noreferrer" class="hero-link github">
            <img :src="assetUrl('/icons/brand-github.svg')" alt="GitHub" class="contact-icon" />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/leonardo-vargas-81a118387" target="_blank" rel="noopener noreferrer" class="hero-link linkedin">
            <img :src="assetUrl('/icons/brand-linkedin.svg')" alt="LinkedIn" class="contact-icon" />
            <span>LinkedIn</span>
          </a>
          <a href="mailto:martinvar.76@gmail.com" class="hero-link email">
            <img :src="assetUrl('/icons/mail.svg')" alt="Email" class="contact-icon" />
            <span>Email</span>
          </a>
        </div>
      </div>

      <div class="hero-side">
        <div class="xp-badge-card profile-card-xp">
          <strong>Perfil</strong>
          <span>Full Stack</span>
          <span>Web · Mobile · Backend</span>
        </div>
        <div class="xp-badge-card focus-card-xp">
          <strong>Enfoque</strong>
          <span>Producto + Infraestructura</span>
          <span>De la interfaz al despliegue</span>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <fieldset class="content-section intro-section accent-blue">
        <legend>Mi PC</legend>
        <p>
          Desarrollador Full Stack con formación en Tecsup, orientado a construir productos web y móviles con una base técnica sólida.
          Mi diferencial es combinar desarrollo de software con infraestructura TI — Linux, Windows, redes y servidores — para cubrir desde el código hasta la puesta en producción.
        </p>
      </fieldset>

      <fieldset class="content-section summary-section accent-gold">
        <legend>Resumen rápido</legend>
        <div class="summary-grid">
          <div class="summary-tile blue">
            <strong>Experiencia base</strong>
            <span>Frontend, backend, automatización y experiencia de usuario.</span>
          </div>
          <div class="summary-tile green">
            <strong>Diferencial</strong>
            <span>Diseño técnico, criterio visual y capacidad para llevar ideas a producción.</span>
          </div>
          <div class="summary-tile violet">
            <strong>Intereses</strong>
            <span>Interfaces con identidad, sistemas claros y productos útiles.</span>
          </div>
          <div class="summary-tile orange">
            <strong>Disponibilidad</strong>
            <span>Abierto a oportunidades, freelance y colaboración.</span>
          </div>
        </div>
      </fieldset>
    </section>

    <fieldset class="content-section skills-section accent-sky">
      <legend>Habilidades técnicas</legend>
      <div class="skills-grid">
        <fieldset v-for="category in techCategories" :key="category.id" class="skill-item" :class="category.tone">
          <legend>
            <span class="legend-icon" v-html="category.icon"></span>
            {{ category.label }}
          </legend>
          <div class="tech-badges">
            <span v-for="tech in category.techs" :key="tech" class="tech-badge" :class="category.tone">
              {{ tech }}
            </span>
          </div>
        </fieldset>
      </div>
    </fieldset>

    <div class="content-grid lower-grid">
      <fieldset class="content-section accent-blue-soft">
        <legend>Proyectos destacados</legend>
        <ul class="highlight-list">
          <li>
            <strong>Joya Express (2025):</strong> App de transporte con Flutter, backend Node.js y Redis en tiempo real.
          </li>
          <li>
            <strong>Rosy Music Bot (2024):</strong> Bot open source para Discord con manejo asíncrono de audio.
          </li>
          <li>
            <strong>NewCorp (2025):</strong> Desarrollo web para infraestructura corporativa con soluciones personalizadas de backend y despliegue.
          </li>
          <li>
            <strong>Sistema IoT (2024):</strong> Proyecto seleccionado entre los 10 mejores por innovación técnica.
          </li>
        </ul>
      </fieldset>

      <fieldset class="content-section accent-gold-soft">
        <legend>Educación y certificaciones</legend>
        <ul class="highlight-list">
          <li><strong>Tecsup:</strong> Diseño y Desarrollo de Software (2023–2025)</li>
          <li>Scrum Foundation Professional (SFPC) — CertiProf (2024)</li>
          <li>Lean Six Sigma White Belt — CertiProf (2024)</li>
          <li>Idiomas: Español, Inglés (B1), Ruso (A1)</li>
        </ul>
        <p class="xp-taskbar-note">
          Si deseas ver el detalle completo, abre
          <button class="doc-shortcut" type="button" @click="openDocuments">Mis Documentos</button>
          para revisar o descargar el CV actualizado.
        </p>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'
import { assetUrl } from '@/utils/assetUrl'

const windowsStore = useWindowsStore()
const computerIcon = assetUrl('/icons/my-pc.svg')

const techCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    tone: 'tone-blue',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    techs: ['Vue', 'React', 'Angular', 'JavaScript', 'CSS3', 'HTML5'],
  },
  {
    id: 'backend',
    label: 'Backend',
    tone: 'tone-green',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/></svg>',
    techs: ['Node.js', 'Python', 'Go', 'Kotlin', 'Swift'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    tone: 'tone-violet',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    techs: ['React Native', 'Flutter', 'Kotlin', 'Swift'],
  },
  {
    id: 'database',
    label: 'Database',
    tone: 'tone-orange',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    techs: ['MongoDB', 'Firebase', 'Redis', 'PostgreSQL'],
  },
  {
    id: 'tools',
    label: 'Tools',
    tone: 'tone-steel',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    techs: ['Git', 'Docker', 'Canvas API', 'Linux'],
  },
]

const openDocuments = () => {
  windowsStore.openWindow('documents')
}
</script>

<style scoped>
.about-me {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(180deg, #edf3fd 0%, #d4e3f9 100%);
}

.hero-panel,
.content-section {
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: linear-gradient(180deg, #fbfdff 0%, #edf4fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.hero-panel {
  display: grid;
  grid-template-columns: 1fr 230px;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(180deg, #fafdff 0%, #e7f0fb 100%);
}

.hero-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.hero-icon {
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18));
}

.hero-title-row h1 {
  margin: 0;
  font-size: 18px;
  color: #173d73;
}

.hero-title-row p {
  margin: 2px 0 0;
  color: #355784;
  font-size: 12px;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 0 9px;
  border: 1px solid #9db7d8;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  color: #173d73;
}

.hero-link.github { background: linear-gradient(180deg, #ffffff 0%, #e9f1fb 100%); }
.hero-link.linkedin { background: linear-gradient(180deg, #f7fbff 0%, #deefff 100%); }
.hero-link.email { background: linear-gradient(180deg, #fffef9 0%, #f8ecd0 100%); }

.hero-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xp-badge-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border: 1px solid #9db7d8;
  color: #173d73;
  font-size: 11px;
}

.profile-card-xp {
  background: linear-gradient(180deg, #f5faff 0%, #dcecff 100%);
}

.focus-card-xp {
  background: linear-gradient(180deg, #fffdf5 0%, #f7ecd0 100%);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
}

.lower-grid {
  grid-template-columns: 1fr 1fr;
}

.content-section {
  padding: 10px;
}

.content-section legend {
  padding: 2px 8px;
  border: 1px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  font-size: 11px;
  font-weight: 700;
  color: #173d73;
}

.accent-blue legend,
.accent-blue-soft legend,
.skills-section legend {
  background: linear-gradient(180deg, #f0f7ff 0%, #d9e9fb 100%);
}

.accent-gold legend,
.accent-gold-soft legend {
  background: linear-gradient(180deg, #fffef8 0%, #f6e7b8 100%);
}

.accent-sky {
  background: linear-gradient(180deg, #fafdff 0%, #e4f0ff 100%);
}

.intro-section p {
  margin: 0;
  line-height: 1.55;
  color: #21456f;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.summary-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #9db7d8;
  color: #244770;
  font-size: 11px;
}

.summary-tile strong {
  color: #173d73;
}

.summary-tile.blue { background: linear-gradient(180deg, #f8fbff 0%, #dcecff 100%); }
.summary-tile.green { background: linear-gradient(180deg, #f7fff8 0%, #dcf4e1 100%); }
.summary-tile.violet { background: linear-gradient(180deg, #fbf8ff 0%, #eadffd 100%); }
.summary-tile.orange { background: linear-gradient(180deg, #fffbf5 0%, #f8e5c9 100%); }

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.skill-item {
  padding: 8px;
  border: 1px solid #9db7d8;
}

.skill-item legend {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
}

.legend-icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
}

.legend-icon :deep(svg) {
  width: 14px;
  height: 14px;
}

.tone-blue { background: linear-gradient(180deg, #f7fbff 0%, #ddecff 100%); color: #17457d; }
.tone-green { background: linear-gradient(180deg, #f7fff8 0%, #dff5e2 100%); color: #1f5c38; }
.tone-violet { background: linear-gradient(180deg, #fbf8ff 0%, #ecdefe 100%); color: #5b3696; }
.tone-orange { background: linear-gradient(180deg, #fffaf4 0%, #f9e7cc 100%); color: #8a5218; }
.tone-steel { background: linear-gradient(180deg, #fbfdff 0%, #e4edf8 100%); color: #355784; }

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-badge {
  padding: 3px 8px;
  border: 1px solid rgba(120, 145, 180, 0.55);
  font-size: 11px;
  font-weight: 700;
}

.highlight-list {
  margin: 0;
  padding-left: 18px;
  color: #21456f;
  line-height: 1.55;
}

.xp-taskbar-note {
  margin: 10px 0 0;
  padding: 8px 10px;
  border: 1px solid #a8bdd8;
  background: linear-gradient(180deg, #e6f0fd 0%, #cddff4 100%);
  color: #21456f;
}

.doc-shortcut {
  border: 0;
  background: transparent;
  color: #0f4ba6;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.contact-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 900px) {
  .hero-panel,
  .content-grid,
  .lower-grid,
  .skills-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
