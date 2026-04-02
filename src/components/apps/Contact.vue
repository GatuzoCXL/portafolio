<template>
  <div class="contact">
    <div class="contact-header">
      <div class="profile">
        <div class="avatar">👤</div>
        <div class="profile-text">
          <strong>¡Hola!</strong>
          <p>Gracias por visitar mi portafolio</p>
        </div>
      </div>
    </div>

    <div class="contact-content">
      <fieldset class="contact-section">
        <legend>Contacto Directo</legend>
        <div class="contact-form">
          <input
            v-model="form.name"
            type="text"
            placeholder="Tu nombre"
            class="form-input"
          />
          <input
            v-model="form.email"
            type="email"
            placeholder="Tu email"
            class="form-input"
          />
          <textarea
            v-model="form.message"
            placeholder="Tu mensaje..."
            class="form-textarea"
          ></textarea>
          <button @click="sendMessage">Enviar</button>
        </div>
      </fieldset>

      <fieldset class="contact-section">
        <legend>Redes Sociales</legend>
        <div class="social-links">
          <a
            href="https://github.com/GatuzoCXL"
            target="_blank"
            rel="noopener noreferrer"
            class="social-button"
          >
            🐙 GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-button">
            💼 LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-button">
            🐦 Twitter
          </a>
          <a href="mailto:tu-email@example.com" class="social-button">
            ✉️ Email
          </a>
        </div>
      </fieldset>

      <fieldset class="contact-section">
        <legend>Estado</legend>
        <p class="status-message">
          Disponible para proyectos y colaboraciones interesantes.
        </p>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const sendMessage = () => {
  if (form.name && form.email && form.message) {
    alert(
      `Gracias ${form.name}, tu mensaje ha sido enviado. Me pondré en contacto pronto.`
    )
    form.name = ''
    form.email = ''
    form.message = ''
  } else {
    alert('Por favor completa todos los campos.')
  }
}
</script>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contact-header {
  background: linear-gradient(90deg, #34529b, #4a7fbf);
  color: white;
  padding: 12px;
  border-bottom: 2px solid #000080;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  font-size: 32px;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-text strong {
  font-size: 12px;
}

.profile-text p {
  margin: 0;
  font-size: 10px;
  opacity: 0.9;
}

.contact-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-section {
  padding: 8px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-input,
.form-textarea {
  padding: 4px;
}

.form-input {
  height: 20px;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
  font-size: 10px;
}

.contact-form button {
  width: fit-content;
  padding: 4px 12px;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.social-button {
  padding: 6px 8px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.status-message {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: #333;
  font-style: italic;
}
</style>
