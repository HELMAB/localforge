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
        <button
          v-if="item.action"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
          :class="'text-gray-400 hover:bg-gray-800 hover:text-white'"
          @click="item.action()"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </button>

        <router-link v-else v-slot="{ isActive, navigate }" :to="item.path" custom>
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
} from 'lucide-vue-next'
import { useMenuNavigation } from '@/composables/useMenuNavigation'

const { ipcRenderer } = window.require('electron')
const { t } = useI18n()
const route = useRoute()
const { setMenuActiveView } = useMenuNavigation()

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
    label: 'General',
    icon: Settings,
  },
  {
    key: 'sites',
    path: '/projects',
    label: 'Sites',
    icon: Globe,
  },
  {
    key: 'php',
    path: '/services',
    label: 'PHP',
    icon: Code,
    isActive: () => route.path === '/services' && false,
    onNavigate: (navigate) => navigateToSubView(navigate, 'php'),
  },
  {
    key: 'node',
    path: '/services',
    label: 'Node',
    icon: Server,
    isActive: () => route.path === '/services' && false,
    onNavigate: (navigate) => navigateToSubView(navigate, 'node'),
  },
  {
    key: 'expose',
    path: '/expose',
    label: 'Expose',
    icon: Share2,
  },
  {
    key: 'services',
    path: '/services',
    label: 'Services',
    icon: Wrench,
  },
  {
    key: 'mail',
    path: '/mail',
    label: 'Mail',
    icon: Mail,
  },
  {
    key: 'dumps',
    path: '/dumps',
    label: 'Dumps',
    icon: Database,
  },
  {
    key: 'debugger',
    path: '/debugger',
    label: 'Debugger',
    icon: Bug,
  },
  {
    key: 'herd-pro',
    path: '/herd-pro',
    label: 'Herd Pro',
    icon: Star,
  },
  {
    key: 'shortcuts',
    path: '/shortcuts',
    label: 'Shortcuts',
    icon: Keyboard,
  },
  {
    key: 'integrations',
    path: '/integrations',
    label: 'Integrations',
    icon: Plug,
  },
  {
    key: 'about',
    label: 'About',
    icon: Info,
    action: () => {
      showAbout.value = true
    },
  },
])
</script>
