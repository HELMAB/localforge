import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    updateDarkMode()
  }

  const updateDarkMode = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved === 'true') {
      isDark.value = true
    } else if (saved === 'false') {
      isDark.value = false
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDarkMode()
  }

  onMounted(() => {
    initDarkMode()
  })

  return {
    isDark,
    toggleDarkMode
  }
}
