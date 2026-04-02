<template>
  <div class="projects">
    <div class="projects-container">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-icon">{{ project.icon }}</div>
        <h3>{{ project.name }}</h3>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-tech">
          <span v-for="tech in project.tech" :key="tech" class="tech-badge">
            {{ tech }}
          </span>
        </div>
        <div class="project-links">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            GitHub
          </a>
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            Demo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  {
    id: 1,
    name: 'Joya Express',
    icon: '📱',
    description: 'Aplicación móvil para gestión de entregas y seguimiento en tiempo real.',
    tech: ['React Native', 'Node.js', 'Firebase'],
    github: 'https://github.com/GatuzoCXL',
    demo: '#',
  },
  {
    id: 2,
    name: 'Rosy Music Bot',
    icon: '🤖',
    description: 'Bot de Discord para reproducción de música con comandos avanzados.',
    tech: ['Discord.js', 'Node.js', 'MongoDB'],
    github: 'https://github.com/GatuzoCXL',
    demo: '#',
  },
  {
    id: 3,
    name: 'Portafolio OS',
    icon: '🖥️',
    description: 'Portafolio interactivo con estilo Windows XP (este proyecto).',
    tech: ['Vue 3', 'Vite', 'Pinia'],
    github: 'https://github.com/GatuzoCXL',
    demo: '#',
  },
  {
    id: 4,
    name: 'Sistema de Gestión',
    icon: '📊',
    description: 'Plataforma empresarial para administración de inventario y ventas.',
    tech: ['C#', 'SQL Server', 'ASP.NET'],
    github: 'https://github.com/GatuzoCXL',
    demo: '#',
  },
]
</script>

<style scoped>
.projects {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #c0c0c0;
  height: 100%;
  overflow-y: auto;
  font-family: 'MS Sans Serif', Arial, sans-serif;
}

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.project-card {
  background: #dfdfdf;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 12px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
}

.project-card:hover {
  border-color: #ffffff #404040 #404040 #ffffff;
  background: #e8e8e8;
}

.project-icon {
  font-size: 32px;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

.project-description {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: #000;
}

.project-tech {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tech-badge {
  background: #000080;
  color: white;
  padding: 2px 4px;
  font-size: 9px;
  border-radius: 2px;
  white-space: nowrap;
}

.project-links {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.link-button {
  flex: 1;
  padding: 4px 8px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  text-decoration: none;
  color: #000;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s;
  border-radius: 2px;
}

.link-button:hover {
  background: #dfdfdf;
}

.link-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}
</style>
