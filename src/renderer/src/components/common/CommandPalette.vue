<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
      @click="close"
      @keydown.esc="close"
    >
      <div
        class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        @click.stop
      >
        <!-- Search Input -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
              :placeholder="locale === 'km' ? 'វាយបញ្ចូលពាក្យបញ្ជា...' : 'Type a command...'"
              @keydown.down="selectNext"
              @keydown.up="selectPrevious"
              @keydown.enter="executeSelected"
            >
          </div>
        </div>

        <!-- Results -->
        <div class="max-h-96 overflow-y-auto">
          <div
            v-if="filteredCommands.length === 0"
            class="p-8 text-center text-gray-500 dark:text-gray-400"
          >
            {{ locale === 'km' ? 'រកមិនឃើញលទ្ធផល' : 'No results found' }}
          </div>

          <div v-else>
            <div
              v-for="(command, index) in filteredCommands"
              :key="command.id"
              :class="[
                'px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                selectedIndex === index
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              ]"
              @click="execute(command)"
              @mouseenter="selectedIndex = index"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
                  :class="
                    command.iconColor ||
                      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  "
                >
                  <component
                    :is="command.icon"
                    class="h-4 w-4"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ command.label }}
                  </div>
                  <div
                    v-if="command.description"
                    class="text-sm text-gray-500 dark:text-gray-400 truncate"
                  >
                    {{ command.description }}
                  </div>
                </div>
                <div
                  v-if="command.shortcut"
                  class="flex-shrink-0 flex gap-1"
                >
                  <kbd
                    v-for="key in command.shortcut.split('+')"
                    :key="key"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600"
                  >
                    {{ key }}
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <div class="flex gap-4">
            <div>
              <kbd
                class="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
              >↑↓</kbd>
              {{ locale === 'km' ? 'រុករក' : 'Navigate' }}
            </div>
            <div>
              <kbd
                class="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
              >Enter</kbd>
              {{ locale === 'km' ? 'ជ្រើសរើស' : 'Select' }}
            </div>
            <div>
              <kbd
                class="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
              >Esc</kbd>
              {{ locale === 'km' ? 'បិទ' : 'Close' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const { locale } = useI18n()
const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInput = ref(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Icon components
const PlusIcon = h(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor' },
  [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z',
      'clip-rule': 'evenodd',
    }),
  ]
)

const ServerIcon = h(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor' },
  [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z',
      'clip-rule': 'evenodd',
    }),
  ]
)

const LockIcon = h(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor' },
  [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z',
      'clip-rule': 'evenodd',
    }),
  ]
)

const CogIcon = h(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor' },
  [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
      'clip-rule': 'evenodd',
    }),
  ]
)

// Available commands
const commands = computed(() => [
  {
    id: 'create-project',
    label: locale.value === 'km' ? 'បង្កើតគម្រោងថ្មី' : 'Create New Project',
    description:
      locale.value === 'km'
        ? 'បង្កើតគម្រោង Laravel, Vue, React, ឬ WordPress'
        : 'Create Laravel, Vue, React, or WordPress project',
    icon: PlusIcon,
    iconColor: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    action: () => router.push('/create'),
    keywords: ['create', 'new', 'project', 'laravel', 'vue', 'react', 'បង្កើត'],
  },
  {
    id: 'nginx-config',
    label: locale.value === 'km' ? 'កំណត់រចនាសម្ព័ន្ធ Nginx' : 'Configure Nginx',
    description:
      locale.value === 'km'
        ? 'បង្កើតការកំណត់រចនាសម្ព័ន្ធ Virtual Host'
        : 'Create virtual host configuration',
    icon: ServerIcon,
    iconColor: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    action: () => router.push('/nginx'),
    keywords: ['nginx', 'server', 'virtual host', 'config', 'configuration'],
  },
  {
    id: 'ssl-generate',
    label: locale.value === 'km' ? 'បង្កើតវិញ្ញាបនប័ត្រ SSL' : 'Generate SSL Certificate',
    description:
      locale.value === 'km'
        ? 'បង្កើតវិញ្ញាបនប័ត្រ SSL ជាមួយ mkcert'
        : 'Generate SSL certificate with mkcert',
    icon: LockIcon,
    iconColor: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    action: () => router.push('/ssl'),
    keywords: ['ssl', 'certificate', 'https', 'mkcert', 'security'],
  },
  {
    id: 'manage-tools',
    label: locale.value === 'km' ? 'គ្រប់គ្រងឧបករណ៍' : 'Manage Tools',
    description:
      locale.value === 'km'
        ? 'ដំឡើង និងគ្រប់គ្រងឧបករណ៍អភិវឌ្ឍន៍'
        : 'Install and manage development tools',
    icon: CogIcon,
    iconColor: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    action: () => router.push('/manage'),
    keywords: ['tools', 'install', 'php', 'node', 'nginx', 'manage', 'ឧបករណ៍'],
  },
])

const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) {
    return commands.value
  }

  const query = searchQuery.value.toLowerCase()
  return commands.value.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.keywords.some((keyword) => keyword.toLowerCase().includes(query))
  )
})

watch(isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    searchInput.value?.focus()
    selectedIndex.value = 0
  } else {
    searchQuery.value = ''
    selectedIndex.value = 0
  }
})

watch(searchQuery, () => {
  selectedIndex.value = 0
})

function close() {
  isOpen.value = false
}

function selectNext() {
  if (selectedIndex.value < filteredCommands.value.length - 1) {
    selectedIndex.value++
  }
}

function selectPrevious() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

function execute(command) {
  command.action()
  close()
}

function executeSelected() {
  if (filteredCommands.value[selectedIndex.value]) {
    execute(filteredCommands.value[selectedIndex.value])
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
