import { ref } from 'vue'

const menuActiveView = ref(null)

export function useMenuNavigation() {
  function setMenuActiveView(view) {
    menuActiveView.value = view
  }

  function clearMenuActiveView() {
    menuActiveView.value = null
  }

  return {
    menuActiveView,
    setMenuActiveView,
    clearMenuActiveView,
  }
}
