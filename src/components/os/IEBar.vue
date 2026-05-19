<template>
  <div class="ie-bar">
    <div class="ie-menu-row">
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'File' })">File</span>
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Edit' })">Edit</span>
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'View' })">View</span>
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Favorites' })">Favorites</span>
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Tools' })">Tools</span>
      <span class="ie-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Help' })">Help</span>
    </div>
    <div class="ie-toolbar-row">
      <button
        class="ie-btn back"
        :disabled="!canGoBack"
        aria-label="Back"
        @click="$emit('back')"
      >
        <img class="ie-btn-icon" :src="xpIcon('toolbar-back')" alt="Back" />
        Back
      </button>
      <button
        class="ie-btn forward"
        :disabled="!canGoForward"
        aria-label="Forward"
        @click="$emit('forward')"
      >
        <img class="ie-btn-icon" :src="xpIcon('toolbar-forward')" alt="Forward" />
        Forward
      </button>
      <div class="ie-tool-separator"></div>
      <button class="ie-btn search" aria-label="Search" @click="$emit('search')">
        <img class="ie-btn-icon" :src="xpIcon('toolbar-search')" alt="Search" />
        Search
      </button>
      <div class="ie-tool-separator"></div>
      <button class="ie-btn refresh" aria-label="Refresh" @click="$emit('refresh')">
        <img class="ie-btn-icon" :src="xpIcon('toolbar-refresh')" alt="Refresh" />
        Refresh
      </button>
      <button class="ie-btn home" aria-label="Home" @click="$emit('home')">
        <img class="ie-btn-icon" :src="xpIcon('toolbar-home')" alt="Home" />
        Home
      </button>
      <button class="ie-btn stop" aria-label="Stop" @click="$emit('stop')">
        <img class="ie-btn-icon" :src="xpIcon('toolbar-stop')" alt="Stop" />
        Stop
      </button>
    </div>
    <div class="ie-address-row">
      <span class="ie-address-label">Address</span>
      <div class="ie-address-content">
        <img class="ie-address-icon" :src="xpIcon('address-icon')" alt="" aria-hidden="true" />
        <input
          :value="address"
          class="ie-address-input"
          type="text"
          @keydown.enter.prevent="$emit('go')"
          @input="$emit('update:address', $event.target.value)"
        />
        <img class="ie-address-arrow-img" :src="xpIcon('address-dropdown')" alt="" aria-hidden="true" />
      </div>
      <button class="ie-btn go" @click="$emit('go')">
        <img class="ie-btn-icon" :src="xpIcon('toolbar-go')" alt="Go" />
        Go
      </button>
    </div>
  </div>
</template>

<script setup>
import { xpIcon } from '@/utils/xpIcons'

defineProps({
  address: {
    type: String,
    default: '',
  },
  canGoBack: {
    type: Boolean,
    default: false,
  },
  canGoForward: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:address',
  'back',
  'forward',
  'stop',
  'refresh',
  'home',
  'search',
  'go',
  'menu-click',
])
</script>

<style scoped>
.ie-bar {
  border-bottom: 1px solid #a8a8a8;
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #1a1a1a;
}

.ie-menu-row {
  height: 21px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px;
  background: linear-gradient(180deg, #f3efe5 0%, #ebe7da 100%);
  border-bottom: 1px solid #d6cfbc;
  font-size: 10px;
}

.ie-menu-item {
  padding: 1px 5px;
  border: 1px solid transparent;
  cursor: default;
}

.ie-menu-item:hover {
  border-color: #ffffff #aab9cc #aab9cc #ffffff;
  background: #e8eef9;
}

.ie-toolbar-row {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 6px;
  background: linear-gradient(180deg, #e8e8e0 0%, #d4d4d4 100%);
  border-bottom: 1px solid #a8a8a8;
}

.ie-tool-separator {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  border-left: 1px solid #9cb4c8;
  border-right: 1px solid #fff;
  align-self: center;
  flex-shrink: 0;
}

.ie-toolbar-row .ie-btn:not(:last-of-type) {
  margin-right: 0;
}

.ie-btn {
  min-width: 30px;
  height: 24px;
  border: 1px solid transparent;
  background: transparent;
  padding: 2px 5px;
  font-size: 10px;
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: inherit;
  border-radius: 3px;
}

.ie-btn:hover:not(:disabled) {
  border-color: #ffffff #95a7c0 #95a7c0 #ffffff;
  background: linear-gradient(180deg, #ffffff 0%, #e6edf7 100%);
  filter: brightness(1.05);
}

.ie-btn:active:not(:disabled) {
  border-color: #95a7c0 #ffffff #ffffff #95a7c0;
  background: linear-gradient(180deg, #dce7f8 0%, #f8fbff 100%);
}

.ie-btn-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 3px;
}

.ie-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.ie-address-row {
  height: 22px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 5px;
  padding: 0 5px;
  background: linear-gradient(180deg, #e8e8d8 0%, #d4d0c0 100%);
}

.ie-address-label {
  font-size: 10px;
  color: #333;
}

.ie-address-input {
  height: 18px;
  border: 1px solid #7895b6;
  background: #fff;
  font-size: 10px;
  padding: 0 5px;
  padding-right: 18px;
  font-family: inherit;
  flex: 1;
  min-width: 0;
  width: 100%;
}

.ie-address-input:focus {
  outline: none;
  border-color: #2a68bf;
  box-shadow: inset 0 0 0 1px #8db8f3;
}

.ie-btn.go {
  border: 2px outset #c0c0c0;
  background: linear-gradient(180deg, #ffffff 0%, #d4d4d4 100%);
  padding: 2px 8px;
}

.ie-address-content {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.ie-address-icon {
  width: 14px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 4px;
}

.ie-address-arrow-img {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 12px;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
}
</style>
