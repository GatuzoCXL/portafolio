<template>
  <div class="contact xp-window-frame">
    <div class="xp-explorer-chrome">
      <div class="xp-menu-row">
        <span class="xp-menu-item">File</span>
        <span class="xp-menu-item">Edit</span>
        <span class="xp-menu-item">View</span>
        <span class="xp-menu-item">Favorites</span>
        <span class="xp-menu-item">Tools</span>
        <span class="xp-menu-item">Help</span>
      </div>
      <div class="xp-toolbar-row">
        <button class="xp-tool-btn back" @click="goBack">Back</button>
        <button class="xp-tool-btn search" @click="focusAddress">Search</button>
        <button class="xp-tool-btn folders">Folders</button>
      </div>
      <div class="xp-address-row">
        <span class="xp-address-label">Address</span>
        <div class="xp-suggest-wrapper">
          <input
            ref="addressRef"
            v-model="address"
            class="xp-address-input"
            type="text"
            @focus="showSuggestions = true"
            @blur="hideSuggestionsSoon"
            @keydown.down.prevent="moveSuggestion(1)"
            @keydown.up.prevent="moveSuggestion(-1)"
            @keydown.enter.prevent="handleEnter"
            @keydown.tab.prevent="completeWithHighlighted"
            @keydown.esc.prevent="showSuggestions = false"
          />
          <div v-if="showSuggestions && filteredSuggestions.length" class="xp-suggestions">
            <div
              v-for="(item, idx) in filteredSuggestions"
              :key="item"
              class="xp-suggestion-item"
              :class="{ active: idx === selectedSuggestionIndex }"
              @mouseenter="selectedSuggestionIndex = idx"
              @mousedown.prevent="pickSuggestion(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <button class="xp-tool-btn go-btn" @click="runAddressAction">Go</button>
        <button class="xp-tool-btn xp-address-jump" @click="openDocuments">Docs</button>
      </div>
    </div>

    <div class="xp-page-shell">
    <aside class="xp-sidebar-panel">
      <section class="xp-task-group">
        <div class="xp-task-title">Contact Tasks</div>
        <ul>
          <li><button class="xp-task-link" @click="focusForm">Enviar solicitud laboral</button></li>
          <li><button class="xp-task-link" @click="focusContactField">Compartir email o teléfono</button></li>
          <li><button class="xp-task-link" @click="showAvailability">Consultar disponibilidad</button></li>
        </ul>
      </section>

      <section class="xp-task-group">
        <div class="xp-task-title">Other Places</div>
        <ul>
          <li><button class="xp-task-link" @click="openExternal('github')">GitHub</button></li>
          <li><button class="xp-task-link" @click="openExternal('linkedin')">LinkedIn</button></li>
          <li><button class="xp-task-link" @click="openDocuments">Mis Documentos</button></li>
        </ul>
      </section>
    </aside>

    <main class="xp-main-panel">
    <div class="contact-header">
      <div class="profile">
        <div class="avatar"><img src="/icons/user-avatar.svg" alt="Avatar" /></div>
        <div class="profile-text">
          <strong>Hola</strong>
          <p>Gracias por visitar mi portafolio</p>
        </div>
      </div>
    </div>

    <div class="contact-content" ref="formSectionRef">
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
            ref="contactInputRef"
            v-model="form.contact"
            type="text"
            placeholder="Tu email o número de contacto"
            class="form-input"
          />
          <input
            v-model="form.website"
            type="text"
            class="honeypot"
            autocomplete="off"
            tabindex="-1"
            aria-hidden="true"
          />
          <textarea
            v-model="form.message"
            placeholder="Tu mensaje..."
            class="form-textarea"
          ></textarea>
          <button :disabled="isSending" @click="sendMessage">{{ isSending ? 'Enviando...' : 'Enviar' }}</button>
          <p v-if="status.text" :class="['form-status', status.type]">{{ status.text }}</p>
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
            <img src="/icons/brand-github.svg" alt="GitHub" class="social-icon" /> GitHub
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" class="social-button">
            <img src="/icons/brand-linkedin.svg" alt="LinkedIn" class="social-icon" /> LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-button">
            <img src="/icons/messenger.svg" alt="Twitter" class="social-icon" /> Twitter
          </a>
          <a href="mailto:martinvar.76@gmail.com" class="social-button">
            <img src="/icons/mail.svg" alt="Email" class="social-icon" /> Email
          </a>
        </div>
      </fieldset>

      <fieldset class="contact-section">
        <legend>Estado</legend>
        <p class="status-message" ref="statusRef">
          Disponible para proyectos y colaboraciones interesantes.
        </p>
      </fieldset>
    </div>
    </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useWindowsStore } from '@/stores/windows'
import { buildAddressSuggestions, resolveWindowShortcut } from '@/utils/addressSuggestions'

const windowsStore = useWindowsStore()

const form = reactive({
  name: '',
  contact: '',
  message: '',
  website: '',
})

const EMAIL_TO = import.meta.env.VITE_EMAILJS_TO_EMAIL || 'martinvar.76@gmail.com'
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

const status = ref({
  type: '',
  text: '',
})

const address = ref('MSN Messenger\\Contact')
const previousAddress = ref('')
const addressRef = ref(null)
const formSectionRef = ref(null)
const contactInputRef = ref(null)
const statusRef = ref(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)

const addressSuggestions = [
  'MSN Messenger\\Contact',
  'MSN Messenger\\Contact\\Form',
  'MSN Messenger\\Contact\\Contact Method',
  'MSN Messenger\\Contact\\Status',
  'MSN Messenger\\Contact\\GitHub',
  'MSN Messenger\\Contact\\LinkedIn',
  'MSN Messenger\\Contact\\My Documents',
]

const filteredSuggestions = computed(() => buildAddressSuggestions(addressSuggestions, address.value, 8))

const isSending = ref(false)
const lastSentAt = ref(0)

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isValidPhone = (value) => /^(\+?[0-9]{1,3}[\s.-]?)?\(?[0-9]{2,4}\)?[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,4}$/.test(value)
const normalize = (value) => value.trim().replace(/\s+/g, ' ')
const canonicalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const blockedNameTokens = [
  'hola',
  'oye',
  'bro',
  'amigo',
  'test',
  'prueba',
  'example',
  'ejemplo',
  'nombre',
  'sexo',
  'sex',
  'puta',
  'puto',
  'mierda',
  'nazi',
  'idiota',
  'admin',
  'owner',
]

const blockedMessageTokens = [
  'sexo',
  'porn',
  'xxx',
  'casino',
  'crypto',
  'viagra',
  'hack',
  'bot',
]

const looksLikeRobloxFilter = (value, blockedTokens) => {
  const normalized = canonicalize(value)
  return blockedTokens.some((token) => normalized.includes(token))
}

const hasTooManyRepeats = (value) => /(.)\1{4,}/.test(value)

const isLikelyProfessionalName = (value) => {
  const cleaned = normalize(value)

  // Solo letras (incluye acentos), espacios, apóstrofe y guión.
  if (!/^[A-Za-zÀ-ÿ'\-\s]+$/.test(cleaned)) {
    return false
  }

  // Longitud razonable
  if (cleaned.length < 4 || cleaned.length > 60) {
    return false
  }

  const words = cleaned.split(' ').filter(Boolean)

  // Pedimos al menos nombre y apellido para contexto profesional.
  if (words.length < 2) {
    return false
  }

  // Evitar iniciales o palabras de 1 caracter.
  if (words.some((word) => word.length < 2)) {
    return false
  }

  return true
}

const hasBlockedContent = (value) => {
  const riskyPatterns = [
    /https?:\/\//i,
    /<script/i,
    /free money/i,
    /crypto/i,
    /casino/i,
  ]
  return riskyPatterns.some((pattern) => pattern.test(value))
}

const sendViaEmailJs = async () => {
  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      name: form.name,
      from_name: form.name,
      reply_to: isValidEmail(form.contact) ? form.contact : EMAIL_TO,
      contact: form.contact,
      to_email: EMAIL_TO,
      time: new Date().toLocaleString('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      message: form.message,
    },
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('EmailJS error')
  }
}

const openMailFallback = () => {
  const subject = encodeURIComponent(`Nuevo mensaje de ${form.name}`)
  const body = encodeURIComponent(
    `Nombre: ${form.name}\nContacto: ${form.contact}\n\nMensaje:\n${form.message}`
  )
  window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`
}

const sendMessage = () => {
  if (isSending.value) {
    return
  }

  const now = Date.now()
  if (now - lastSentAt.value < 30_000) {
    status.value = {
      type: 'error',
      text: 'Espera unos segundos antes de volver a enviar.',
    }
    return
  }

  if (form.website) {
    status.value = {
      type: 'error',
      text: 'No se pudo validar el envío.',
    }
    return
  }

  form.name = normalize(form.name)
  form.contact = normalize(form.contact)
  form.message = form.message.trim()

  if (!form.name || !form.contact || !form.message) {
    status.value = {
      type: 'error',
      text: 'Completa todos los campos antes de enviar.',
    }
    return
  }

  if (!isValidEmail(form.contact) && !isValidPhone(form.contact)) {
    status.value = {
      type: 'error',
      text: 'Ingresa un correo o número de contacto válido.',
    }
    return
  }

  if (
    !isLikelyProfessionalName(form.name) ||
    looksLikeRobloxFilter(form.name, blockedNameTokens) ||
    hasTooManyRepeats(form.name)
  ) {
    status.value = {
      type: 'error',
      text: 'Ingresa un nombre y apellido reales para continuar.',
    }
    return
  }

  if (form.message.length < 12 || form.message.length > 1200) {
    status.value = {
      type: 'error',
      text: 'Tu mensaje debe tener entre 12 y 1200 caracteres.',
    }
    return
  }

  if (hasBlockedContent(form.message)) {
    status.value = {
      type: 'error',
      text: 'Detectamos contenido no permitido en el mensaje.',
    }
    return
  }

  if (looksLikeRobloxFilter(form.message, blockedMessageTokens) || hasTooManyRepeats(form.message)) {
    status.value = {
      type: 'error',
      text: 'El mensaje contiene términos o patrones no permitidos.',
    }
    return
  }

  status.value = {
    type: 'loading',
    text: 'Enviando mensaje...',
  }

  isSending.value = true

  Promise.resolve()
    .then(async () => {
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        await sendViaEmailJs()
      } else {
        openMailFallback()
      }
    })
    .then(() => {
      lastSentAt.value = Date.now()
      status.value = {
        type: 'success',
        text: 'Mensaje enviado correctamente. Responderé lo antes posible.',
      }
      form.name = ''
      form.contact = ''
      form.message = ''
      form.website = ''
    })
    .catch(() => {
      status.value = {
        type: 'error',
        text: 'No se pudo enviar ahora. Intenta de nuevo en unos minutos.',
      }
    })
    .finally(() => {
      isSending.value = false
    })
}

const setAddress = (value) => {
  previousAddress.value = address.value
  address.value = value
}

const focusAddress = async () => {
  await nextTick()
  addressRef.value?.focus()
  addressRef.value?.select?.()
}

const focusForm = () => {
  setAddress('MSN Messenger\\Contact\\Form')
  formSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const focusContactField = async () => {
  setAddress('MSN Messenger\\Contact\\Contact Method')
  await nextTick()
  contactInputRef.value?.focus()
}

const showAvailability = () => {
  setAddress('MSN Messenger\\Contact\\Status')
  statusRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const openExternal = (target) => {
  if (target === 'github') {
    setAddress('MSN Messenger\\Contact\\GitHub')
    window.open('https://github.com/GatuzoCXL', '_blank', 'noopener,noreferrer')
  }

  if (target === 'linkedin') {
    setAddress('MSN Messenger\\Contact\\LinkedIn')
    window.open('https://linkedin.com/', '_blank', 'noopener,noreferrer')
  }
}

const openDocuments = () => {
  setAddress('MSN Messenger\\Contact\\My Documents')
  windowsStore.toggleWindow('documents')
}

const runAddressAction = () => {
  previousAddress.value = address.value
  showSuggestions.value = false
  const term = address.value.toLowerCase()

  const quickWindow = resolveWindowShortcut(address.value)
  if (quickWindow && !term.includes('form') && !term.includes('status')) {
    windowsStore.openWindow(quickWindow)
    return
  }

  if (term.includes('projects') || term.includes('internet explorer')) {
    windowsStore.openWindow('internet-explorer')
    return
  }

  if (term.includes('form')) {
    focusForm()
    return
  }

  if (term.includes('status') || term.includes('dispon')) {
    showAvailability()
    return
  }

  if (term.includes('github')) {
    openExternal('github')
    return
  }

  if (term.includes('linkedin')) {
    openExternal('linkedin')
    return
  }

  if (term.includes('document')) {
    openDocuments()
  }
}

const moveSuggestion = (delta) => {
  if (!filteredSuggestions.value.length) return
  selectedSuggestionIndex.value =
    (selectedSuggestionIndex.value + delta + filteredSuggestions.value.length) %
    filteredSuggestions.value.length
}

const completeWithHighlighted = () => {
  if (!showSuggestions.value || !filteredSuggestions.value.length) return
  const picked = filteredSuggestions.value[selectedSuggestionIndex.value]
  if (picked) {
    address.value = picked
  }
}

const pickSuggestion = (item) => {
  address.value = item
  runAddressAction()
}

const handleEnter = () => {
  if (showSuggestions.value && filteredSuggestions.value.length) {
    const picked = filteredSuggestions.value[selectedSuggestionIndex.value]
    if (picked) {
      pickSuggestion(picked)
      return
    }
  }

  runAddressAction()
}

const hideSuggestionsSoon = () => {
  window.setTimeout(() => {
    showSuggestions.value = false
  }, 100)
}

const goBack = () => {
  if (!previousAddress.value) return
  const current = address.value
  address.value = previousAddress.value
  previousAddress.value = current
}
</script>

<style scoped>
.contact {
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
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 32px;
  height: 32px;
  object-fit: contain;
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
  padding: 10px;
  border: 2px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #f0f6ff;
}

.contact-section legend {
  padding: 2px 8px;
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: #ece9d8;
  font-size: 11px;
  font-weight: 700;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: linear-gradient(180deg, #f6fbff 0%, #edf5ff 100%);
  border: 1px solid #9bb6d8;
  padding: 8px;
  border-radius: 2px;
}

.form-input,
.form-textarea {
  padding: 6px;
  border: 1px solid #7f9db9;
  background: #fff;
  font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #6d7e97;
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
  border: 1px solid;
  border-color: #ffffff #7f9db9 #7f9db9 #ffffff;
  background: linear-gradient(180deg, #f5fbff, #d9e9ff);
}

.contact-form button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.form-status {
  margin: 2px 0 0;
  font-size: 10px;
}

.form-status.loading {
  color: #274a7b;
}

.form-status.success {
  color: #1f7a37;
}

.form-status.error {
  color: #a52323;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.social-button {
  padding: 6px 8px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  background: #dfeaf8;
  text-decoration: none;
  color: inherit;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.social-button:hover {
  background: #ecf4ff;
}

.social-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.social-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.status-message {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: #333;
  font-style: italic;
}
</style>
