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
      <div class="contact-section">
        <h3>Contacto Directo</h3>
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
          <button @click="sendMessage" class="send-button">Enviar</button>
        </div>
      </div>

      <div class="contact-section">
        <h3>Redes Sociales</h3>
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
      </div>

      <div class="contact-section">
        <h3>Estado</h3>
        <p class="status-message">
          Disponible para proyectos y colaboraciones interesantes.
        </p>
      </div>
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
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
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
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-section {
  background: #dfdfdf;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 10px;
  border-radius: 2px;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  padding-bottom: 4px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-input,
.form-textarea {
  padding: 4px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  background: white;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #000;
  border-radius: 2px;
}

.form-input {
  height: 20px;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
  font-size: 10px;
}

.send-button {
  padding: 4px 8px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  border-radius: 2px;
  transition: all 0.1s;
}

.send-button:hover {
  background: #dfdfdf;
}

.send-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.social-button {
  padding: 6px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  text-decoration: none;
  color: #000;
  text-align: center;
  font-size: 10px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.social-button:hover {
  background: #dfdfdf;
}

.social-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.status-message {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: #333;
  font-style: italic;
}
</style>
