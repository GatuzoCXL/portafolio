<template>
  <div class="about-me">
    <div class="content-section">
      <h2>Sobre Mí</h2>
      <p>
        Soy un desarrollador apasionado con experiencia en tecnologías modernas
        y arquitectura de software. Me encanta crear soluciones escalables y
        user-friendly que resuelvan problemas reales.
      </p>
    </div>

    <div class="content-section">
      <h3>Habilidades Técnicas</h3>
      <div class="skills-grid">
        <div class="skill-item">
          <strong>Frontend</strong>
          <ul>
            <li>Vue 3 (Composition API)</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
        <div class="skill-item">
          <strong>Backend</strong>
          <ul>
            <li>Node.js</li>
            <li>C#</li>
            <li>Python</li>
            <li>SQL</li>
          </ul>
        </div>
        <div class="skill-item">
          <strong>Herramientas</strong>
          <ul>
            <li>Git</li>
            <li>Docker</li>
            <li>Vite</li>
            <li>Jest & Vitest</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h3>Educación</h3>
      <p>
        Formación continua en ingeniería de software, desarrollador full-stack
        y especialista en arquitecturas modernas.
      </p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.about-me {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px;
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  height: 100%;
  overflow-y: auto;
}

.content-section {
  background: #dfdfdf;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 8px;
  border-radius: 2px;
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
  margin: 0;
  line-height: 1.4;
  font-size: 11px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.skill-item {
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 6px;
  border-radius: 2px;
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
</style>
