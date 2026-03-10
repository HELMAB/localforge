import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/styles/main.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  toastClassName: [
    '!rounded-lg',
    '!shadow-lg',
    '!border',
    '!border-gray-200',
    'dark:!border-gray-700',
  ],
  bodyClassName: ['!text-sm', '!leading-snug'],
  closeButtonClassName: [
    '!text-gray-600',
    'dark:!text-gray-200',
    '!opacity-70',
    'hover:!opacity-100',
  ],
  toastDefaults: {
    default: {
      toastClassName: ['!bg-white', 'dark:!bg-gray-800', '!text-gray-900', 'dark:!text-gray-100'],
    },
    success: { toastClassName: ['!bg-emerald-600', 'dark:!bg-emerald-700', '!text-white'] },
    error: { toastClassName: ['!bg-red-600', 'dark:!bg-red-700', '!text-white'] },
    warning: { toastClassName: ['!bg-amber-600', 'dark:!bg-amber-700', '!text-white'] },
    info: { toastClassName: ['!bg-blue-600', 'dark:!bg-blue-700', '!text-white'] },
  },
})

app.mount('#app')
