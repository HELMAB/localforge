<template>
  <aside
    :class="[
      'lg-sidebar flex flex-col transition-all duration-300 ease-in-out',
      collapsed ? 'w-16 min-w-16' : 'w-56 min-w-56',
    ]"
  >
    <div class="flex items-center justify-between mb-4 px-2 [app-region:drag]">
      <span v-if="!collapsed" class="text-sm font-bold text-foreground">
        {{ t('appTitle') }}
      </span>
      <button
        class="p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground transition-colors [app-region:no-drag]"
        :title="collapsed ? t('expandSidebar') : t('collapseSidebar')"
        @click="collapsed = !collapsed"
      >
        <component :is="collapsed ? ChevronRight : ChevronLeft" class="h-4 w-4" />
      </button>
    </div>

    <nav class="space-y-1 flex-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        v-slot="{ isActive, navigate }"
        :to="item.path"
        custom
      >
        <Button
          variant="ghost"
          class="lg-sideitem"
          :class="[
            isActive ? 'lg-sideitem--active' : 'lg-sideitem--inactive',
            collapsed ? 'justify-center px-0' : '',
          ]"
          :title="collapsed ? item.label : undefined"
          @click="navigate"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        </Button>
      </router-link>
    </nav>

    <div v-if="!collapsed" class="mt-auto pt-4 border-t border-border/50">
      <router-link v-slot="{ isActive, navigate }" to="/settings" custom>
        <Button
          variant="ghost"
          class="lg-sideitem w-full"
          :class="[isActive ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
          :title="t('settings')"
          @click="navigate"
        >
          <Settings class="h-5 w-5 flex-shrink-0" />
          <span class="truncate">{{ t('settings') }}</span>
        </Button>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Plus, Globe, Lock, Wrench, Settings } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const route = useRoute()

const collapsed = ref(false)
const isMobile = ref(false)

const navItems = computed(() => [
  { path: '/projects', label: t('tabCreate'), icon: Plus },
  { path: '/virtual-hosts', label: t('tabNginx'), icon: Globe },
  { path: '/virtual-hosts', label: t('sslTab'), icon: Lock },
  { path: '/services', label: t('tabManage'), icon: Wrench },
])

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

function handleResize() {
  checkMobile()
  if (isMobile.value) {
    collapsed.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      collapsed.value = true
    }
  }
)
</script>
