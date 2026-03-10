<template>
  <div class="lg-tabbar tab-navigation">
    <router-link
      v-for="(tab, index) in tabs"
      :key="tab.path"
      v-slot="{ navigate, isActive }"
      :to="tab.path"
      custom
    >
      <button
        :class="tabButtonClass(isActive)"
        :data-tour="tab.dataTour"
        class="lg-tab"
        :aria-current="isActive ? 'page' : undefined"
        @click="navigate"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        <span class="leading-none">{{ t(tab.label) }}</span>
        <KeyboardHint :hint="`Ctrl+${index + 1}`" />
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Sparkles, Globe2, Wrench, Settings2 } from 'lucide-vue-next'
import KeyboardHint from '../common/KeyboardHint.vue'

const { t } = useI18n()

const tabs = [
  { path: '/projects', label: 'tabCreate', icon: Sparkles, dataTour: 'manage-projects' },
  { path: '/virtual-hosts', label: 'tabNginx', icon: Globe2, dataTour: 'manage-virtual-hosts' },
  { path: '/services', label: 'tabManage', icon: Wrench, dataTour: 'manage-services' },
  { path: '/settings', label: 'tabSettings', icon: Settings2, dataTour: 'manage-settings' },
]

function tabButtonClass(isActive) {
  return isActive ? 'lg-tab--active' : 'lg-tab--inactive'
}
</script>
