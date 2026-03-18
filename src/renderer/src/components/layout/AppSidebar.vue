<template>
  <aside class="w-52 min-w-52 bg-gray-900 h-screen flex flex-col [app-region:drag]">
    <div class="px-4 py-5 mb-2">
      <span class="text-sm font-bold text-white">{{ t('appTitle') }}</span>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path + item.label"
        v-slot="{ isActive, navigate }"
        :to="item.path"
        custom
      >
        <button
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
          :class="
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          "
          @click="navigate"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </button>
      </router-link>
    </nav>

    <div class="px-2 py-4 border-t border-gray-700">
      <router-link v-slot="{ isActive, navigate }" to="/settings" custom>
        <button
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors [app-region:no-drag]"
          :class="
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          "
          @click="navigate"
        >
          <Settings class="h-5 w-5 flex-shrink-0" />
          <span class="truncate">{{ t('settings') }}</span>
        </button>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Globe, Lock, Wrench, Settings } from 'lucide-vue-next'

const { t } = useI18n()

const navItems = computed(() => [
  { path: '/projects', label: t('tabCreate'), icon: Plus },
  { path: '/virtual-hosts', label: t('tabNginx'), icon: Globe },
  { path: '/ssl', label: t('sslTab'), icon: Lock },
  { path: '/services', label: t('tabManage'), icon: Wrench },
])
</script>
