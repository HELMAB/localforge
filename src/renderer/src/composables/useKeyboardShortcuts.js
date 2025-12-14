import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useKeyboardShortcuts() {
  const router = useRouter()

  const shortcuts = {
    'ctrl+1': () => router.push('/create'),
    'ctrl+2': () => router.push('/nginx'),
    'ctrl+3': () => router.push('/ssl'),
    'ctrl+4': () => router.push('/manage'),
    'ctrl+d': (e) => {
      e.preventDefault()
      const event = new CustomEvent('toggle-dark-mode')
      window.dispatchEvent(event)
    },
    'ctrl+l': (e) => {
      e.preventDefault()
      const event = new CustomEvent('toggle-language')
      window.dispatchEvent(event)
    },
    'ctrl+,': (e) => {
      e.preventDefault()
      const event = new CustomEvent('open-settings')
      window.dispatchEvent(event)
    },
  }

  const handleKeydown = (e) => {
    const key = []
    if (e.ctrlKey) key.push('ctrl')
    if (e.altKey) key.push('alt')
    if (e.shiftKey) key.push('shift')
    key.push(e.key.toLowerCase())

    const combo = key.join('+')
    const handler = shortcuts[combo]

    if (handler) {
      handler(e)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    shortcuts,
  }
}
