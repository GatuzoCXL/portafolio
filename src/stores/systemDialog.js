import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemDialogStore = defineStore('systemDialog', () => {
  const isOpen = ref(false)
  const title = ref('Mensaje del sistema')
  const message = ref('')
  const type = ref('info')
  const resolveRef = ref(null)

  const open = ({ dialogTitle, dialogMessage, dialogType = 'info' }) => {
    title.value = dialogTitle || 'Mensaje del sistema'
    message.value = dialogMessage || ''
    type.value = dialogType
    isOpen.value = true

    return new Promise((resolve) => {
      resolveRef.value = resolve
    })
  }

  const close = (result = false) => {
    isOpen.value = false
    if (resolveRef.value) {
      resolveRef.value(result)
      resolveRef.value = null
    }
  }

  const alert = ({ title, message }) =>
    open({ dialogTitle: title, dialogMessage: message, dialogType: 'info' })

  const confirm = ({ title, message }) =>
    open({ dialogTitle: title, dialogMessage: message, dialogType: 'confirm' })

  return {
    isOpen,
    title,
    message,
    type,
    open,
    close,
    alert,
    confirm,
  }
})
