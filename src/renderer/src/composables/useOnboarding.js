import { ref, computed } from 'vue'

const ONBOARDING_KEY = 'localforge-onboarding-completed'
const ONBOARDING_VERSION = '1.0.1'

const currentStep = ref(0)
const isActive = ref(false)

const steps = [
  {
    target: '.tab-navigation',
    title: 'Navigation',
    titleKm: 'ការរុករក',
    content:
      'Switch between different tools using these tabs. Keyboard shortcuts: Ctrl+1, Ctrl+2, Ctrl+3, Ctrl+4',
    contentKm:
      'ប្តូររវាងឧបករណ៍ផ្សេងៗដោយប្រើផ្ទាំងទាំងនេះ។ ផ្លូវកាត់ក្តារចុច៖ Ctrl+1, Ctrl+2, Ctrl+3, Ctrl+4',
    position: 'bottom',
  },
  {
    target: '[data-tour="manage-projects"]',
    title: 'Manage Projects',
    titleKm: 'គ្រប់គ្រងគម្រោង',
    content: 'Create and manage your projects. Supports Laravel, Vue, Nuxt, React, and WordPress',
    contentKm: 'បង្កើត និងគ្រប់គ្រងគម្រោងរបស់អ្នក។ គាំទ្រ Laravel, Vue, Nuxt, React និង WordPress',
    position: 'right',
  },
  {
    target: '[data-tour="manage-virtual-hosts"]',
    title: 'Manage Virtual Hosts',
    titleKm: 'គ្រប់គ្រង Virtual Hosts',
    content: 'Set up and manage Nginx virtual hosts for your projects with SSL support',
    contentKm: 'រៀបចំ និងគ្រប់គ្រង Nginx virtual hosts សម្រាប់គម្រោងរបស់អ្នកជាមួយការគាំទ្រ SSL',
    position: 'right',
  },
  {
    target: '[data-tour="manage-services"]',
    title: 'Manage Services',
    titleKm: 'គ្រប់គ្រងសេវាកម្ម',
    content: 'Install and manage PHP, Node.js, Composer, Nginx, PostgreSQL, and MySQL',
    contentKm: 'ដំឡើង និងគ្រប់គ្រង PHP, Node.js, Composer, Nginx, PostgreSQL និង MySQL',
    position: 'right',
  },
  {
    target: '[data-tour="manage-settings"]',
    title: 'Settings',
    titleKm: 'ការកំណត់',
    content:
      'Customize your experience. Toggle dark mode (Ctrl+D), change language (Ctrl+L), and more',
    contentKm: 'ប្តូរបទពិសោធន៍របស់អ្នក។ បិទបើក dark mode (Ctrl+D), ប្តូរភាសា (Ctrl+L) និងច្រើនទៀត',
    position: 'right',
  },
]

export function useOnboarding() {
  const isCompleted = computed(() => {
    try {
      const completed = localStorage.getItem(ONBOARDING_KEY)
      return completed === ONBOARDING_VERSION
    } catch {
      return false
    }
  })

  const shouldShow = computed(() => {
    return !isCompleted.value && !isActive.value
  })

  const start = () => {
    currentStep.value = 0
    isActive.value = true
  }

  const next = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    } else {
      complete()
    }
  }

  const previous = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const skip = () => {
    complete()
  }

  const complete = () => {
    isActive.value = false
    try {
      localStorage.setItem(ONBOARDING_KEY, ONBOARDING_VERSION)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save onboarding state:', error)
    }
  }

  const reset = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY)
      currentStep.value = 0
      isActive.value = false
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to reset onboarding:', error)
    }
  }

  const getCurrentStep = (locale = 'en') => {
    const step = steps[currentStep.value]
    if (!step) return null

    return {
      ...step,
      title: locale === 'km' ? step.titleKm : step.title,
      content: locale === 'km' ? step.contentKm : step.content,
      stepNumber: currentStep.value + 1,
      totalSteps: steps.length,
    }
  }

  return {
    isActive,
    isCompleted,
    shouldShow,
    currentStep,
    steps,
    start,
    next,
    previous,
    skip,
    complete,
    reset,
    getCurrentStep,
  }
}
