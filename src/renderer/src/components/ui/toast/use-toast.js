import { reactive } from 'vue'

let toastCount = 0

const state = reactive({
  toasts: [],
})

function generateId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER
  return `toast_${toastCount}`
}

export function addToast(toast) {
  state.toasts.unshift(toast)
}

export function removeToast(id) {
  const index = state.toasts.findIndex((t) => t.id === id)
  if (index !== -1) state.toasts.splice(index, 1)
}

export function dismissToast(id) {
  const toast = state.toasts.find((t) => t.id === id)
  if (toast) toast.open = false
}

export function dismissAll() {
  state.toasts.forEach((t) => {
    t.open = false
  })
}

export function toast(options) {
  const id = options?.id ?? generateId()

  const toastItem = {
    id,
    open: true,
    title: options?.title ?? '',
    description: options?.description ?? '',
    variant: options?.variant ?? 'default',
    duration: options?.duration ?? 3000,
  }

  addToast(toastItem)

  return {
    id,
    dismiss: () => dismissToast(id),
  }
}

export function useToastState() {
  return state
}
