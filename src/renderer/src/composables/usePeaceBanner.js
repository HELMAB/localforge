import { computed, reactive } from 'vue'

const state = reactive({
  showBanner: true,
})

export function usePeaceBanner() {
  const toggleBanner = () => {
    state.showBanner = !state.showBanner
  }

  const setBannerVisible = (visible) => {
    state.showBanner = visible
  }

  return {
    showBanner: computed(() => state.showBanner),
    toggleBanner,
    setBannerVisible,
  }
}
