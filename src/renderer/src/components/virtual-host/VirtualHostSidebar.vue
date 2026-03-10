<template>
  <div class="lg-sidebar flex flex-col">
    <nav class="space-y-1 flex-1 overflow-y-auto">
      <Button
        variant="ghost"
        class="lg-sideitem"
        :class="[activeMenu === 'sites' ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
        @click="$emit('update:activeMenu', 'sites')"
      >
        <Globe class="h-5 w-5 shrink-0" />
        <span class="text-sm">{{ t('nginxSites') }}</span>
        <span
          class="ml-auto px-2 py-0.5 text-xs rounded-full border"
          :class="[
            activeMenu === 'sites'
              ? 'border-transparent bg-primary/15 text-primary'
              : 'border-border bg-background/40 text-muted-foreground',
          ]"
        >
          {{ configs.length }}
        </span>
      </Button>
      <Button
        variant="ghost"
        class="lg-sideitem"
        :class="[activeMenu === 'new-site' ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
        @click="$emit('update:activeMenu', 'new-site')"
      >
        <Plus class="h-5 w-5 shrink-0" />
        <span class="text-sm">{{ t('nginxNewSite') }}</span>
      </Button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Globe, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
  configs: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:activeMenu'])
</script>
