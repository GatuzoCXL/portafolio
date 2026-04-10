<template>
  <div class="about-me">
    <fieldset class="content-section">
      <h2>Mi PC</h2>
      <p>
        Soy Leonardo Vargas Martínez, Desarrollador Full Stack egresado de Tecsup.
        Desarrollo soluciones web y móviles con enfoque práctico: arquitectura,
        rendimiento y experiencia de usuario.
      </p>
      <p>
        Mi diferencial es combinar desarrollo de software con base en infraestructura TI
        (Linux/Windows, redes y servidores), para cubrir desde el código hasta el despliegue.
      </p>
    </fieldset>

    <fieldset class="content-section">
      <h3>Perfil Profesional</h3>
      <ul class="highlight-list">
        <li>Rol: Desarrollador Full Stack</li>
        <li>Ubicación: Paucarpata, Arequipa, Perú</li>
        <li>Formación: Diseño y Desarrollo de Software (Tecsup)</li>
        <li>Idiomas: Español, Inglés (B1), Ruso (A1)</li>
      </ul>
    </fieldset>

    <fieldset class="content-section">
      <h3>Habilidades Técnicas</h3>
      <div class="skills-grid">
        <fieldset class="skill-item">
          <strong>Backend & APIs</strong>
          <ul>
            <li>Node.js</li>
            <li>Express</li>
            <li>C#.NET</li>
            <li>Socket.IO / REST</li>
          </ul>
        </fieldset>
        <fieldset class="skill-item">
          <strong>Frontend & Mobile</strong>
          <ul>
            <li>React.js</li>
            <li>Flutter</li>
            <li>Vite</li>
            <li>Tailwind CSS</li>
          </ul>
        </fieldset>
        <fieldset class="skill-item">
          <strong>Datos & Infra</strong>
          <ul>
            <li>SQL / Firebase / Redis</li>
            <li>Docker / Nginx</li>
            <li>AWS EC2/S3 (básico)</li>
            <li>Linux / Windows Server</li>
          </ul>
        </fieldset>
        <fieldset class="skill-item">
          <strong>Flujo de trabajo</strong>
          <ul>
            <li>Git</li>
            <li>GitHub</li>
            <li>Scrum</li>
            <li>Diseño Responsivo</li>
          </ul>
        </fieldset>
      </div>
    </fieldset>

    <fieldset class="content-section">
      <h3>Proyectos Destacados</h3>
      <ul class="highlight-list">
        <li><strong>Joya Express (2025):</strong> App de transporte con Flutter, backend Node.js y Redis en tiempo real.</li>
        <li><strong>Rosy Music Bot (2024):</strong> Bot open source para Discord con manejo asíncrono de audio.</li>
        <li><strong>Sistema IoT (2024):</strong> Proyecto seleccionado entre los 10 mejores por innovación técnica.</li>
      </ul>
    </fieldset>

    <fieldset class="content-section">
      <h3>Educación y Certificaciones</h3>
      <ul class="highlight-list">
        <li><strong>Tecsup:</strong> Diseño y Desarrollo de Software (2023–2025)</li>
        <li>Scrum Foundation Professional (SFPC) — CertiProf (2024)</li>
        <li>Lean Six Sigma White Belt — CertiProf (2024)</li>
      </ul>
      <p class="note">
        Si deseas ver el detalle completo, abre
        <button class="doc-shortcut" type="button" @click="openDocuments">Mis Documentos</button>
        para revisar o descargar mi CV actualizado.
      </p>
    </fieldset>
  </div>
</template>

<script setup>
import { useWindowsStore } from '@/stores/windows'

const windowsStore = useWindowsStore()

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
}

.content-section {
  padding: 8px;
}

h2 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

h3 {
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: bold;
}

p {
  margin: 0 0 6px;
  line-height: 1.4;
  font-size: 11px;
}

.highlight-list {
  margin: 0;
  padding-left: 16px;
}

.highlight-list li {
  font-size: 10.5px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.skill-item {
  padding: 6px 8px;
}

.skill-item strong {
  display: block;
  margin-bottom: 4px;
  font-size: 10px;
  text-decoration: underline;
}

.skill-item ul {
  margin: 0;
  padding-left: 16px;
  list-style: disc;
}

.skill-item li {
  font-size: 10px;
  line-height: 1.3;
}

.note {
  margin-top: 6px;
  font-size: 10px;
  color: #2a4d83;
}

.doc-shortcut {
  border: none;
  background: transparent;
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
</style>
