<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const clockTime = ref('')
const clockDay = ref('')

const updateClock = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  clockTime.value = `${hours}:${minutes}`

  const dayOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  clockDay.value = now.toLocaleDateString('es-PE', dayOptions).replace(',', '')
}

let clockInterval = null

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 60000)
})

onBeforeUnmount(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
    clockInterval = null
  }
})
</script>

<template>
  <div class="mobile-status-bar">
    <div class="status-notifications">
      <svg class="notif-icon" width="16" height="13" viewBox="0 0 16 13" fill="none" aria-label="Correo">
        <rect x="1" y="2.5" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M1.5 4L8 8.5L14.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <svg class="notif-icon" width="15" height="14" viewBox="0 0 15 14" fill="none" aria-label="Mensajes">
        <path d="M1.5 1.5C1.5 1.5 1.5 6.5 4 8.5L2.5 12.5L6.5 11C6.5 11 13.5 11 13.5 1.5C13.5 1.5 8.5 1.5 6.5 4.5C5 7 5 9 5 9C5 9 3.5 10.5 1.5 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
      <svg class="notif-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Notificaciones">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5" />
        <circle cx="7" cy="7" r="2" fill="currentColor" />
      </svg>
    </div>

    <span class="status-clock">{{ clockTime }}</span>

    <div class="status-icons">
      <svg class="status-wifi" width="20" height="18" viewBox="0 0 20 18" aria-hidden="true">
        <circle cx="10" cy="15.5" r="1.8" fill="currentColor" stroke="none" />
        <path d="M7 11.5a4 4 0 0 1 6 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M4 8.5a10 10 0 0 1 12 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
      </svg>
      <span class="status-signal">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <rect x="12" y="8" width="2" height="4" rx="1" fill="currentColor" />
        <rect x="9" y="6" width="2" height="6" rx="1" fill="currentColor" />
        <rect x="6" y="4" width="2" height="8" rx="1" fill="currentColor" />
        <rect x="3" y="2" width="2" height="10" rx="1" fill="currentColor" />
        <rect x="0" y="0" width="2" height="12" rx="1" fill="currentColor" />
      </svg>
      </span>

      <span class="status-battery">
      <svg width="30" height="15" viewBox="0 0 30 15" fill="none">
        <rect x="1" y="2" width="24" height="11" rx="3" stroke="currentColor" stroke-width="1.8" fill="none" />
        <rect x="26" y="5" width="3" height="5" rx="1" fill="currentColor" />
        <rect x="4" y="5" width="16" height="5" rx="1" fill="currentColor" />
      </svg>
      </span>
    </div>

    <div class="status-date">{{ clockDay }}</div>
  </div>
</template>

<style scoped>
.mobile-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 48px;
  padding: 6px 14px 10px;
  background: #000000;
  border-bottom: 1px solid #17220d;
  color: #f7f3fb;
  font-family: 'Courier New', monospace;
}

.status-notifications {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
}

.notif-icon {
  color: #f7f3fb;
  flex-shrink: 0;
}

.status-icons,
.status-signal,
.status-battery {
  display: flex;
  align-items: center;
}

.status-icons {
  gap: 8px;
  justify-content: flex-end;
  flex: 1;
}

.status-wifi {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 18px;
  margin-top: -2px;
}

.status-battery {
  gap: 0;
}

.status-signal,
.status-battery {
  color: #f7f3fb;
}

.status-date {
  position: absolute;
  left: 50%;
  bottom: 3px;
  transform: translateX(-50%);
  font-size: 8px;
  color: #8ecf32;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.status-clock {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #f7f3fb;
  letter-spacing: 0.5px;
}
</style>
