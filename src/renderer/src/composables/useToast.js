import { useToast as useToastification } from 'vue-toastification'

export function useToast() {
  const toast = useToastification()

  const success = (message, options = {}) => {
    toast.success(message, {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    })
  }

  const error = (message, options = {}) => {
    toast.error(message, {
      position: 'top-right',
      timeout: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    })
  }

  const warning = (message, options = {}) => {
    toast.warning(message, {
      position: 'top-right',
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    })
  }

  const info = (message, options = {}) => {
    toast.info(message, {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
