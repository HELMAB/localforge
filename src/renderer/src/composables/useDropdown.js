import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export function useDropdown(dropdownHeight = 200) {
  const isOpen = ref(false)
  const dropdownRef = ref(null)
  const openUpward = ref(false)

  const dropdownClasses = computed(() => ({
    'bottom-full mb-2': openUpward.value,
    'mt-2': !openUpward.value,
  }))

  function toggleDropdown() {
    if (!isOpen.value) {
      checkDropdownPosition()
    }
    isOpen.value = !isOpen.value
  }

  function checkDropdownPosition() {
    if (!dropdownRef.value) return

    const rect = dropdownRef.value.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    openUpward.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  }

  function closeDropdown() {
    isOpen.value = false
  }

  function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      isOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    isOpen,
    dropdownRef,
    openUpward,
    dropdownClasses,
    toggleDropdown,
    closeDropdown,
    checkDropdownPosition,
  }
}
