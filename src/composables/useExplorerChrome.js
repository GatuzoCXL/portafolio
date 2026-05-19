import { nextTick, ref } from 'vue'

export function useAddressBar(props, emit) {
  const showSuggestions = ref(false)
  const selectedSuggestionIndex = ref(0)
  const addressInputRef = ref(null)

  const hideSuggestionsSoon = () => {
    window.setTimeout(() => {
      showSuggestions.value = false
    }, 100)
  }

  const focusAddress = async () => {
    await nextTick()
    addressInputRef.value?.focus()
    addressInputRef.value?.select?.()
  }

  const moveSuggestion = (delta) => {
    if (!props.suggestions.length) return
    selectedSuggestionIndex.value =
      (selectedSuggestionIndex.value + delta + props.suggestions.length) %
      props.suggestions.length
  }

  const completeWithHighlighted = () => {
    if (!showSuggestions.value || !props.suggestions.length) return
    const picked = props.suggestions[selectedSuggestionIndex.value]
    if (picked) {
      emit('update:address', picked)
    }
  }

  const pickSuggestion = (item) => {
    emit('update:address', item)
    emit('pick-suggestion', item)
    showSuggestions.value = false
  }

  const onGo = () => {
    showSuggestions.value = false
    emit('go')
  }

  const handleEnter = () => {
    if (showSuggestions.value && props.suggestions.length) {
      const picked = props.suggestions[selectedSuggestionIndex.value]
      if (picked) {
        pickSuggestion(picked)
        return
      }
    }
    showSuggestions.value = false
    emit('go')
  }

  return {
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
  }
}

export function useNavigation(emit) {
  const goBack = () => emit('back')
  const goForward = () => emit('forward')
  const goUp = () => emit('up')
  const goTo = () => emit('go')
  const pickSuggestion = (item) => emit('pick-suggestion', item)
  const updateAddress = (value) => emit('update:address', value)
  const view = () => emit('view')
  const menuClick = (payload) => emit('menu-click', payload)

  return {
    goBack,
    goForward,
    goUp,
    goTo,
    pickSuggestion,
    updateAddress,
    view,
    menuClick,
  }
}
