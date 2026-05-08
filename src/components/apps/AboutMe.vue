<template>
  <div class="about-me">
    <fieldset class="profile-section">
      <div class="profile-header">
        <h1 class="profile-name">Leonardo Vargas Mart&iacute;nez</h1>
        <div class="profile-meta">
          <span class="profile-role">Desarrollador Full Stack</span>
          <span class="sep">|</span>
          <span class="profile-location">Per&uacute;</span>
          <span class="sep">|</span>
          <span class="profile-edu">Tecsup</span>
        </div>
      </div>
      <div class="contact-bar">
        <a
          href="https://github.com/GatuzoCXL"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link"
        >
          <img :src="assetUrl('/icons/brand-github.svg')" alt="GitHub" class="contact-icon" />
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/leonardo-vargas-81a118387"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link"
        >
          <img :src="assetUrl('/icons/brand-linkedin.svg')" alt="LinkedIn" class="contact-icon" />
          <span>LinkedIn</span>
        </a>
        <a href="mailto:martinvar.76@gmail.com" class="contact-link">
          <img :src="assetUrl('/icons/mail.svg')" alt="Email" class="contact-icon" />
          <span>Email</span>
        </a>
      </div>
    </fieldset>

    <fieldset class="content-section intro-section">
      <h2>Mi PC</h2>
      <p>
        Desarrollador Full Stack con formaci&oacute;n en Tecsup, especializaci&oacute;n en
        soluciones web y m&oacute;viles. Mi diferencial es combinar desarrollo de software con
        infraestructura TI &mdash; Linux/Windows, redes y servidores &mdash; para cubrir desde el
        c&oacute;digo hasta el despliegue.
      </p>
    </fieldset>

    <fieldset class="content-section">
      <h3>
        <span class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </span>
        Habilidades T&eacute;cnicas
      </h3>
      <div class="skills-grid">
        <fieldset v-for="category in techCategories" :key="category.id" class="skill-item">
          <strong class="skill-header">
            <span class="skill-icon" v-html="category.icon"></span>
            {{ category.label }}
          </strong>
          <div class="tech-badges">
            <span v-for="tech in category.techs" :key="tech" class="tech-badge">{{ tech }}</span>
          </div>
        </fieldset>
      </div>
    </fieldset>

    <!-- Proyectos con IoT destacado -->
    <fieldset class="content-section">
      <h3>
        <span class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        Proyectos Destacados
      </h3>
      <ul class="highlight-list">
        <li>
          <strong>Joya Express (2025):</strong> App de transporte con Flutter, backend Node.js y Redis en tiempo real.
        </li>
        <li>
          <strong>Rosy Music Bot (2024):</strong> Bot open source para Discord con manejo as&iacute;ncrono de audio.
        </li>
        <li>
          <strong>NewCorp (2025):</strong> Desarrollo web para infraestructura corporativa con soluciones personalizadas de backend y despliegue.
        </li>
        <li class="project-highlight">
          <strong>Sistema IoT (2024):</strong> Proyecto seleccionado entre los 10 mejores por innovaci&oacute;n t&eacute;cnica.
        </li>
      </ul>
    </fieldset>

    <fieldset class="content-section">
      <h3>
        <span class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        Educaci&oacute;n y Certificaciones
      </h3>
      <ul class="highlight-list">
        <li><strong>Tecsup:</strong> Dise&ntilde;o y Desarrollo de Software (2023&ndash;2025)</li>
        <li>Scrum Foundation Professional (SFPC) &mdash; CertiProf (2024)</li>
        <li>Lean Six Sigma White Belt &mdash; CertiProf (2024)</li>
        <li>Idiomas: Espa&ntilde;ol, Ingl&eacute;s (B1), Ruso (A1)</li>
      </ul>
      <p class="xp-taskbar-note">
        Si deseas ver el detalle completo, abre
        <button class="doc-shortcut" type="button" @click="openDocuments">Mis Documentos</button>
        para revisar o descargar mi CV actualizado.
      </p>
    </fieldset>
  </div>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'
import { assetUrl } from '@/utils/assetUrl'

const windowsStore = useWindowsStore()

const techCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    techs: ['Vue', 'React', 'Angular', 'JavaScript', 'CSS3', 'HTML5'],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    techs: ['Node.js', 'Python', 'Go'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    techs: ['React Native'],
  },
  {
    id: 'database',
    label: 'Database',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    techs: ['MongoDB', 'Firebase'],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    techs: ['Git', 'Docker', 'Canvas API'],
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
  background: linear-gradient(180deg, #eef4fd 0%, #dce9fb 100%);
}

/* Perfil */
.profile-section {
  padding: 10px 12px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: linear-gradient(180deg, #f9fcff 0%, #edf4fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
  margin-bottom: 8px;
}

.profile-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #173d73;
  line-height: 1.2;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #264d86;
}

.profile-role {
  font-weight: 600;
}

.sep {
  color: #8ea8c9;
  font-size: 10px;
}

.contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  padding-top: 6px;
  border-top: 1px solid #c4d4e6;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #1f57a6;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  color: #165dbf;
  text-decoration: underline;
}

.contact-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Secciones de contenido */
.content-section {
  padding: 8px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: linear-gradient(180deg, #f9fcff 0%, #edf4fb 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.intro-section p {
  margin: 0;
  line-height: 1.5;
  font-size: 13px;
  color: #173d73;
}

h2 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #8ca7c5;
  padding-bottom: 4px;
  color: #173d73;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #264d86;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #173d73;
}

.highlight-list {
  margin: 0;
  padding-left: 16px;
}

.highlight-list li {
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 4px;
}

/* Skills y badges */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.skill-item {
  padding: 6px 8px;
  background: linear-gradient(180deg, #ffffff 0%, #eef5fd 100%);
  border: 1px solid;
  border-color: #ffffff #b8cce0 #b8cce0 #ffffff;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  text-decoration: underline;
  color: #123f79;
}

.skill-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  color: #4b5563;
  flex-shrink: 0;
}

.skill-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tech-badge {
  display: inline-block;
  padding: 1px 6px;
  font-size: 12px;
  font-weight: 500;
  color: #0b3f87;
  background: linear-gradient(180deg, #dceeff 0%, #c2daf5 100%);
  border: 1px solid;
  border-color: #ffffff #a8c4e0 #a8c4e0 #ffffff;
}

/* Proyecto IoT destacado */
.project-highlight {
  padding-left: 8px;
  border-left: 3px solid #1f57a6;
  font-weight: 600;
}

.project-highlight strong {
  font-weight: 700;
}

/* Nota de barra de tareas XP */
.xp-taskbar-note {
  margin-top: 8px;
  padding: 5px 10px;
  font-size: 12px;
  color: #173d73;
  background: linear-gradient(180deg, #d4e6f7 0%, #bdd5ee 100%);
  border: 1px solid;
  border-color: #ffffff #7fa3c9 #7fa3c9 #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.08);
  line-height: 1.4;
}

.doc-shortcut {
  border: 1px solid transparent;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
  color: #0b3f87;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
  font-weight: 700;
}

.doc-shortcut:hover {
  color: #165dbf;
}

.doc-shortcut:active {
  transform: translateY(1px);
}
</style>
