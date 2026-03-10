import { toast } from '@/components/ui/toast'

function getDuration(options, fallback) {
  if (!options) return fallback
  if (typeof options.duration === 'number') return options.duration
  if (typeof options.timeout === 'number') return options.timeout
  return fallback
}

export function useToast() {
  const success = (message, options = {}) => {
    toast({
      title: options.title ?? '',
      description: message,
      variant: 'success',
      duration: getDuration(options, 3000),
    })
  }

  const error = (message, options = {}) => {
    toast({
      title: options.title ?? '',
      description: message,
      variant: 'error',
      duration: getDuration(options, 5000),
    })
  }

  const warning = (message, options = {}) => {
    toast({
      title: options.title ?? '',
      description: message,
      variant: 'warning',
      duration: getDuration(options, 4000),
    })
  }

  const info = (message, options = {}) => {
    toast({
      title: options.title ?? '',
      description: message,
      variant: 'info',
      duration: getDuration(options, 3000),
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
