<template>
  <div class="mobile-about">
    <header class="about-header">
      <div class="about-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <div class="about-profile">
        <h1 class="about-name">Leonardo Vargas Martinez</h1>
        <p class="about-role">Desarrollador Full Stack</p>
        <p class="about-meta">Peru &middot; Tecsup</p>
      </div>
    </header>

    <div class="about-links">
      <a href="https://github.com/GatuzoCXL" target="_blank" rel="noopener noreferrer" class="about-link">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        GitHub
      </a>
      <a href="https://www.linkedin.com/in/leonardo-vargas-81a118387" target="_blank" rel="noopener noreferrer" class="about-link">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>
      <a href="mailto:martinvar.76@gmail.com" class="about-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 6.5L22 7" />
        </svg>
        Email
      </a>
    </div>

    <section class="about-section">
      <h2>Perfil</h2>
      <p class="about-bio">
        Desarrollador Full Stack con formacion en Tecsup, especializacion en soluciones web y moviles.
        Mi diferencial es combinar desarrollo de software con infraestructura TI — Linux/Windows, redes y servidores — para cubrir desde el codigo hasta el despliegue.
      </p>
    </section>

    <section class="about-section">
      <h2>Habilidades</h2>
      <div class="skills-grid">
        <div v-for="cat in techCategories" :key="cat.id" class="skill-group">
          <strong class="skill-label">{{ cat.label }}</strong>
          <div class="skill-tags">
            <span v-for="tech in cat.techs" :key="tech" class="skill-tag">{{ tech }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2>Proyectos destacados</h2>
      <ul class="projects-list">
        <li><strong>Joya Express (2025):</strong> App de transporte con Flutter, backend Node.js y Redis en tiempo real.</li>
        <li><strong>Rosy Music Bot (2024):</strong> Bot open source para Discord con manejo asincrono de audio.</li>
        <li><strong>NewCorp (2025):</strong> Desarrollo web para infraestructura corporativa.</li>
        <li class="highlight"><strong>Sistema IoT (2024):</strong> Seleccionado entre los 10 mejores por innovacion tecnica.</li>
      </ul>
    </section>

    <section class="about-section">
      <h2>Educacion</h2>
      <ul class="projects-list">
        <li><strong>Tecsup:</strong> Diseno y Desarrollo de Software (2023-2025)</li>
        <li>Scrum Foundation Professional (SFPC) &mdash; CertiProf (2024)</li>
        <li>Lean Six Sigma White Belt &mdash; CertiProf (2024)</li>
        <li>Idiomas: Espanol, Ingles (B1), Ruso (A1)</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const techCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    techs: ['Vue', 'React', 'Angular', 'JavaScript', 'CSS3', 'HTML5'],
  },
  {
    id: 'backend',
    label: 'Backend',
    techs: ['Node.js', 'Python', 'Go'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    techs: ['React Native'],
  },
  {
    id: 'database',
    label: 'Database',
    techs: ['MongoDB', 'Firebase'],
  },
  {
    id: 'tools',
    label: 'Tools',
    techs: ['Git', 'Docker', 'Canvas API'],
  },
]
</script>

<style scoped>
.mobile-about {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #1a1a1a;
  min-height: 100%;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #252525;
  border-radius: 12px;
}

.about-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #8ecf32;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d1a06;
  flex-shrink: 0;
}

.about-profile {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.about-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f2eef7;
}

.about-role {
  margin: 0;
  font-size: 12px;
  color: #8ecf32;
}

.about-meta {
  margin: 0;
  font-size: 11px;
  color: #8e8e8e;
}

.about-links {
  display: flex;
  gap: 8px;
}

.about-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  background: #252525;
  border-radius: 8px;
  color: #c4c4c4;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.about-link:active {
  background: #333;
}

.about-section {
  background: #252525;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-section h2 {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #8ecf32;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.about-bio {
  margin: 0;
  font-size: 13px;
  color: #c4c4c4;
  line-height: 1.5;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-label {
  font-size: 10px;
  color: #8e8e8e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.skill-tag {
  padding: 3px 8px;
  background: #2d2d2d;
  border-radius: 4px;
  font-size: 11px;
  color: #d4d4d4;
}

.projects-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.projects-list li {
  font-size: 12px;
  color: #c4c4c4;
  line-height: 1.4;
}

.projects-list li strong {
  color: #e0e0e0;
}

.projects-list li.highlight {
  border-left: 3px solid #8ecf32;
  padding-left: 8px;
}
</style>