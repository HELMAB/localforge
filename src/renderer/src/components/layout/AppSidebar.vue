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
        <div
          v-if="item.isSection"
          class="flex items-center gap-3 px-3 py-1.5 mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          <component :is="item.icon" class="h-4 w-4 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </div>
        <router-link v-else v-slot="{ isActive, navigate }" :to="item.path" custom>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
            :class="
              (item.isActive ? item.isActive() : isActive)
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

      <router-link v-slot="{ isActive, navigate }" to="/settings" custom>
        <button
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
          :class="
            isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          "
          @click="navigate()"
        >
          <Settings class="h-5 w-5 flex-shrink-0" />
          <span class="truncate">{{ t('sidebarSettings') }}</span>
        </button>
      </router-link>

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
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  Settings,
  Globe,
  Code,
  Server,
  Wrench,
  Info,
  Languages,
  Plus,
  FolderInput,
  PackageOpen,
  Network,
  Database,
} from 'lucide-vue-next'
import { useMenuNavigation } from '@/composables/useMenuNavigation'
import { useSettings } from '@/composables/useSettings'

const { ipcRenderer } = window.require('electron')
const { t, locale } = useI18n()
const route = useRoute()
const { setMenuActiveView, menuActiveView } = useMenuNavigation()
const { updateSetting } = useSettings()
const showAbout = inject('showAbout')

function toggleLanguage() {
  const newLocale = locale.value === 'km' ? 'en' : 'km'
  locale.value = newLocale
  updateSetting('language', newLocale)
}

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
    key: 'sites',
    path: '/projects',
    label: t('sidebarSites'),
    icon: Globe,
    isActive: () => route.path === '/projects' && !menuActiveView.value,
    onNavigate: (navigate) => navigateToSubView(navigate, ''),
  },
  {
    key: 'new-project',
    path: '/projects',
    label: t('sidebarNewProject'),
    icon: Plus,
    isActive: () => route.path === '/projects' && menuActiveView.value === 'new',
    onNavigate: (navigate) => navigateToSubView(navigate, 'new'),
  },
  {
    key: 'import-project',
    path: '/projects',
    label: t('sidebarImportProject'),
    icon: FolderInput,
    isActive: () => route.path === '/projects' && menuActiveView.value === 'import',
    onNavigate: (navigate) => navigateToSubView(navigate, 'import'),
  },
  {
    key: 'services',
    path: '/services',
    label: t('sidebarServices'),
    icon: Wrench,
    isSection: true,
  },
  {
    key: 'php',
    path: '/services',
    label: t('sidebarPHP'),
    icon: Code,
    isActive: () => route.path === '/services' && menuActiveView.value === 'php',
    onNavigate: (navigate) => navigateToSubView(navigate, 'php'),
  },
  {
    key: 'composer',
    path: '/services',
    label: t('sidebarComposer'),
    icon: PackageOpen,
    isActive: () => route.path === '/services' && menuActiveView.value === 'composer',
    onNavigate: (navigate) => navigateToSubView(navigate, 'composer'),
  },
  {
    key: 'node',
    path: '/services',
    label: t('sidebarNode'),
    icon: Server,
    isActive: () => route.path === '/services' && menuActiveView.value === 'node',
    onNavigate: (navigate) => navigateToSubView(navigate, 'node'),
  },
  {
    key: 'nginx',
    path: '/services',
    label: t('sidebarNginx'),
    icon: Network,
    isActive: () => route.path === '/services' && menuActiveView.value === 'nginx',
    onNavigate: (navigate) => navigateToSubView(navigate, 'nginx'),
  },
  {
    key: 'postgresql',
    path: '/services',
    label: t('sidebarPostgreSQL'),
    icon: Database,
    isActive: () => route.path === '/services' && menuActiveView.value === 'postgresql',
    onNavigate: (navigate) => navigateToSubView(navigate, 'postgresql'),
  },
  {
    key: 'mysql',
    path: '/services',
    label: t('sidebarMySQL'),
    icon: Database,
    isActive: () => route.path === '/services' && menuActiveView.value === 'mysql',
    onNavigate: (navigate) => navigateToSubView(navigate, 'mysql'),
  },
  {
    key: 'virtual-hosts',
    path: '/virtual-hosts',
    label: t('sidebarVirtualHosts'),
    icon: Globe,
  },
])
</script>
