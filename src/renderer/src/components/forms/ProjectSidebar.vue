<template>
  <div class="lg-sidebar flex flex-col">
    <nav class="space-y-1 flex-1 overflow-y-auto">
      <Button
        variant="ghost"
        class="lg-sideitem"
        :class="[activeView === 'recent' ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
        @click="$emit('update:activeView', 'recent')"
      >
        <LayoutGrid class="h-5 w-5" />
        <span>{{ t('projects') }}</span>
      </Button>
      <Button
        variant="ghost"
        class="lg-sideitem"
        :class="[activeView === 'new' ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
        @click="$emit('update:activeView', 'new')"
      >
        <Plus class="h-5 w-5" />
        <span>{{ t('quickSetup') }}</span>
      </Button>
      <Button
        variant="ghost"
        class="lg-sideitem"
        :class="[activeView === 'import' ? 'lg-sideitem--active' : 'lg-sideitem--inactive']"
        @click="$emit('update:activeView', 'import')"
      >
        <FolderInput class="h-5 w-5" />
        <span>{{ t('importProject') }}</span>
      </Button>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { LayoutGrid, Plus, FolderInput } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

defineProps({
  activeView: {
    type: String,
    required: true,
  },
})

defineEmits(['update:activeView'])
</script>
