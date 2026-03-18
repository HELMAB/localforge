<template>
  <aside class="w-52 min-w-52 bg-gray-900 h-screen flex flex-col [app-region:drag]">
    <div class="px-4 py-5 mb-2">
      <div class="flex items-center gap-1.5 mb-3 [app-region:no-drag]">
        <button
          class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 focus:outline-none"
          @click="closeWindow"
        />
        <button
          class="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 focus:outline-none"
          @click="minimizeWindow"
        />
        <button
          class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 focus:outline-none"
          @click="maximizeWindow"
        />
      </div>
      <span class="text-sm font-bold text-white">{{ t('appTitle') }}</span>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 space-y-1">
      <template v-for="item in navItems" :key="item.key">
        <router-link v-slot="{ isActive, navigate }" :to="item.path" custom>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
            :class="
              isActive || item.isActive?.()
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            "
            @click="item.onNavigate ? item.onNavigate(navigate) : navigate()"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span class="truncate">{{ item.label }}</span>
          </button>
        </router-link>
      </template>
    </nav>

    <div class="px-2 py-2 border-t border-gray-700 space-y-1">
      <button
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag] text-gray-400 hover:bg-gray-800 hover:text-white"
        :title="t('switchLanguage')"
        @click="toggleLanguage"
      >
        <Languages class="h-5 w-5 flex-shrink-0" />
        <span>{{ locale === 'km' ? 'EN' : 'ខ្មែ' }}</span>
      </button>

      <button
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag] text-gray-400 hover:bg-gray-800 hover:text-white"
        @click="showAbout = true"
      >
        <Info class="h-5 w-5 flex-shrink-0" />
        <span class="truncate">{{ t('sidebarAbout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  Settings,
  Globe,
  Code,
  Server,
  Share2,
  Wrench,
  Mail,
  Database,
  Bug,
  Star,
  Keyboard,
  Plug,
  Info,
  Languages,
} from 'lucide-vue-next'
import { useMenuNavigation } from '@/composables/useMenuNavigation'
import { useSettings } from '@/composables/useSettings'

const { ipcRenderer } = window.require('electron')
const { t, locale } = useI18n()
const route = useRoute()
const { setMenuActiveView } = useMenuNavigation()
const { updateSetting } = useSettings()

function toggleLanguage() {
  const newLocale = locale.value === 'km' ? 'en' : 'km'
  locale.value = newLocale
  updateSetting('language', newLocale)
}

const showAbout = ref(false)

function closeWindow() {
  ipcRenderer.send('window-close')
}

function minimizeWindow() {
  ipcRenderer.send('window-minimize')
}

function maximizeWindow() {
  ipcRenderer.send('window-maximize')
}

function navigateToSubView(navigate, subView) {
  setMenuActiveView(subView)
  navigate()
}

const navItems = computed(() => [
  {
    key: 'general',
    path: '/settings',
    label: t('sidebarGeneral'),
    icon: Settings,
  },
  {
    key: 'sites',
    path: '/projects',
    label: t('sidebarSites'),
    icon: Globe,
  },
  {
    key: 'php',
    path: '/services',
    label: t('sidebarPHP'),
    icon: Code,
    isActive: () => route.path === '/services' && false,
    onNavigate: (navigate) => navigateToSubView(navigate, 'php'),
  },
  {
    key: 'node',
    path: '/services',
    label: t('sidebarNode'),
    icon: Server,
    isActive: () => route.path === '/services' && false,
    onNavigate: (navigate) => navigateToSubView(navigate, 'node'),
  },
  {
    key: 'expose',
    path: '/expose',
    label: t('sidebarExpose'),
    icon: Share2,
  },
  {
    key: 'services',
    path: '/services',
    label: t('sidebarServices'),
    icon: Wrench,
  },
  {
    key: 'mail',
    path: '/mail',
    label: t('sidebarMail'),
    icon: Mail,
  },
  {
    key: 'dumps',
    path: '/dumps',
    label: t('sidebarDumps'),
    icon: Database,
  },
  {
    key: 'debugger',
    path: '/debugger',
    label: t('sidebarDebugger'),
    icon: Bug,
  },
  {
    key: 'herd-pro',
    path: '/herd-pro',
    label: t('sidebarHerdPro'),
    icon: Star,
  },
  {
    key: 'shortcuts',
    path: '/shortcuts',
    label: t('sidebarShortcuts'),
    icon: Keyboard,
  },
  {
    key: 'integrations',
    path: '/integrations',
    label: t('sidebarIntegrations'),
    icon: Plug,
  },
])
</script>
