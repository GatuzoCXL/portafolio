<template>
  <!--
  Slots:
  - default: main content panel (rendered inside .xp-main-panel)
  - sidebar: left sidebar panel (rendered inside .xp-sidebar-panel)
  - toolbar-extras: additional buttons appended to the toolbar row
-->
  <div class="xp-explorer-chrome-root">
    <div class="xp-explorer-chrome" :class="{ 'is-compact': size === 'compact' }">
    <div class="xp-menu-row">
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'File' })">File</span>
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Edit' })">Edit</span>
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'View' })">View</span>
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Favorites' })">Favorites</span>
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Tools' })">Tools</span>
      <span class="xp-menu-item" @click.prevent.stop="$emit('menu-click', { menu: 'Help' })">Help</span>
    </div>

    <div class="xp-toolbar-row">
      <template v-for="button in toolbarButtons" :key="button.id">
        <button
          class="xp-tool-btn"
          :class="[
            button.id,
            {
              'icon-only': button.iconOnly,
              disabled: button.disabled,
            },
          ]"
          :disabled="button.disabled"
          :aria-label="button.ariaLabel"
          @click="handleToolbarButtonClick(button)"
        >
          <img
            v-if="button.iconSrc"
            :src="button.iconSrc"
            :alt="button.ariaLabel"
            class="xp-tool-icon"
          />
          <span class="xp-tool-label">{{ button.label }}</span>
          <span v-if="button.hasArrow" class="xp-tool-arrow" aria-hidden="true"></span>
        </button>
        <span v-if="button.separatorAfter" class="xp-tool-separator" aria-hidden="true"></span>
      </template>
      <slot name="toolbar-extras" />
    </div>

    <div v-if="showAddressBar" class="xp-address-row xp-chrome-address">
      <span class="xp-address-label">Address</span>
      <div class="xp-address-content">
        <img
          class="xp-address-icon"
          :src="xpIcon('address-icon')"
          alt=""
          aria-hidden="true"
        />
        <input
          ref="addressInputRef"
          :value="displayedAddress"
          class="xp-address-input"
          type="text"
          @focus="onAddressFocus"
          @blur="onAddressBlur"
          @keydown.down.prevent="moveSuggestion(1)"
          @keydown.up.prevent="moveSuggestion(-1)"
          @keydown.enter.prevent="handleEnter"
          @keydown.tab.prevent="completeWithHighlighted"
          @keydown.esc.prevent="showSuggestions = false"
          @input="$emit('update:address', $event.target.value)"
        />
        <img
          class="xp-address-arrow-img"
          :src="xpIcon('address-dropdown')"
          alt=""
          aria-hidden="true"
        />
        <div v-if="showSuggestions && suggestions.length" class="xp-suggestions">
          <div
            v-for="(item, idx) in suggestions"
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
      <button class="xp-tool-btn go-btn" aria-label="Go" @click="onGo">
        <img
          class="xp-tool-icon"
          :src="xpIcon('toolbar-go')"
          alt="Go"
        />
        <span class="xp-tool-label">Go</span>
      </button>
    </div>
  </div>

  <div class="xp-page-shell">
    <aside class="xp-sidebar-panel">
      <slot name="sidebar" />
    </aside>
    <main class="xp-main-panel">
      <slot />
    </main>
  </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { xpIcon } from '@/utils/xpIcons'
import { useAddressBar, useNavigation } from '@/composables/useExplorerChrome'

const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  showNavigationButtons: {
    type: Boolean,
    default: true,
  },
  canGoBack: {
    type: Boolean,
    default: true,
  },
  canGoForward: {
    type: Boolean,
    default: false,
  },
  view: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'full',
  },
  showAddressBar: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'update:address',
  'back',
  'forward',
  'go',
  'pick-suggestion',
  'view',
  'menu-click',
  'refresh',
  'home',
])

const {
  showSuggestions,
  selectedSuggestionIndex,
  addressInputRef,
  hideSuggestionsSoon,
  focusAddress,
  moveSuggestion,
  completeWithHighlighted,
  pickSuggestion,
  onGo,
  handleEnter,
} = useAddressBar(props, emit)

useNavigation(emit)

const displayedAddress = computed(() => props.address)

const toolbarButtons = computed(() => [
  {
    id: 'back',
    label: 'Back',
    ariaLabel: 'Back',
    iconOnly: false,
    hasArrow: true,
    disabled: !props.canGoBack,
    visible: props.showNavigationButtons,
    action: 'back',
    iconSrc: xpIcon('toolbar-back'),
  },
  {
    id: 'forward',
    label: 'Forward',
    ariaLabel: 'Forward',
    iconOnly: true,
    hasArrow: false,
    disabled: !props.canGoForward,
    visible: props.showNavigationButtons,
    action: 'forward',
    separatorAfter: true,
    iconSrc: xpIcon('toolbar-forward'),
  },
  {
    id: 'search',
    label: 'Search',
    ariaLabel: 'Search',
    iconOnly: false,
    hasArrow: false,
    disabled: false,
    visible: true,
    action: 'search',
    iconSrc: xpIcon('toolbar-search'),
  },
  {
    id: 'folders',
    label: 'Folders',
    ariaLabel: 'Folders',
    iconOnly: false,
    hasArrow: false,
    disabled: false,
    visible: true,
    action: 'folders',
    separatorAfter: true,
    iconSrc: xpIcon('toolbar-folders'),
  },
  {
    id: 'view',
    label: 'View',
    ariaLabel: 'View',
    iconOnly: false,
    hasArrow: true,
    disabled: false,
    visible: true,
    action: 'view',
    iconSrc: xpIcon('toolbar-view'),
  },
].filter(button => button.visible))

const handleToolbarButtonClick = (button) => {
  if (button.disabled) {
    return
  }

  switch (button.action) {
    case 'back':
      emit('back')
      break
    case 'forward':
      emit('forward')
      break
    case 'search':
      focusAddress()
      break
    case 'view':
      emit('view')
      break
    default:
      break
  }
}

const onAddressFocus = () => {
  showSuggestions.value = true
}

const onAddressBlur = () => {
  hideSuggestionsSoon()
}
</script>
