<template>
  <div class="rounded-xl border transition-all duration-200" :class="cardClasses">
    <div class="p-5">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center" :class="iconBgClasses">
            <component :is="iconComponent" v-if="iconComponent" class="w-7 h-7" />
            <img v-else-if="icon" :src="icon" :alt="name" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ name }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="version" class="text-sm font-medium" :class="versionClasses">
                v{{ version }}
              </span>
              <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                {{ noVersionText }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="isInstalled"
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="installedBadgeClasses"
          >
            <Check class="w-3 h-3 mr-1 inline" />
            {{ installedText }}
          </span>
          <span
            v-else
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="notInstalledBadgeClasses"
          >
            <X class="w-3 h-3 mr-1 inline" />
            {{ notInstalledText }}
          </span>
        </div>
      </div>

      <div v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ description }}
      </div>

      <div class="flex items-center gap-3">
        <Button
          v-if="!isInstalled"
          :disabled="isLoading"
          class="flex-1"
          :class="installButtonClasses"
          @click="$emit('install')"
        >
          <LoaderCircle
            v-if="isLoading && loadingType === 'install'"
            class="w-4 h-4 mr-2 animate-spin"
          />
          <Download v-else class="w-4 h-4 mr-2" />
          {{ isLoading && loadingType === 'install' ? installingText : installText }}
        </Button>

        <template v-else>
          <Button
            v-if="showUpdate"
            :disabled="isLoading"
            variant="outline"
            class="flex-1"
            :class="updateButtonClasses"
            @click="$emit('update')"
          >
            <LoaderCircle
              v-if="isLoading && loadingType === 'update'"
              class="w-4 h-4 mr-2 animate-spin"
            />
            <RefreshCw v-else class="w-4 h-4 mr-2" />
            {{ isLoading && loadingType === 'update' ? updatingText : updateText }}
          </Button>

          <Button
            v-if="showRemove"
            :disabled="isLoading"
            variant="outline"
            class="flex-1"
            :class="removeButtonClasses"
            @click="$emit('remove')"
          >
            <LoaderCircle
              v-if="isLoading && loadingType === 'remove'"
              class="w-4 h-4 mr-2 animate-spin"
            />
            <Trash2 v-else class="w-4 h-4 mr-2" />
            {{ isLoading && loadingType === 'remove' ? removingText : removeText }}
          </Button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, X, Download, RefreshCw, Trash2, LoaderCircle } from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  iconComponent: {
    type: Object,
    default: null,
  },
  version: {
    type: String,
    default: null,
  },
  isInstalled: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'indigo',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  loadingType: {
    type: String,
    default: '',
  },
  showUpdate: {
    type: Boolean,
    default: false,
  },
  showRemove: {
    type: Boolean,
    default: false,
  },
  locale: {
    type: String,
    default: 'en',
  },
})

defineEmits(['install', 'update', 'remove'])

const colorSchemes = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
    version: 'text-indigo-700 dark:text-indigo-300',
    installedBadge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    notInstalledBadge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    installButton:
      'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-0 text-white',
    updateButton:
      'border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    removeButton:
      'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-500/20',
    version: 'text-green-700 dark:text-green-300',
    installedBadge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    notInstalledBadge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    installButton:
      'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 text-white',
    updateButton:
      'border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20',
    removeButton:
      'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    version: 'text-amber-700 dark:text-amber-300',
    installedBadge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    notInstalledBadge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    installButton:
      'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-0 text-white',
    updateButton:
      'border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20',
    removeButton:
      'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    version: 'text-blue-700 dark:text-blue-300',
    installedBadge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    notInstalledBadge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    installButton:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white',
    updateButton:
      'border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    removeButton:
      'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
    iconBg: 'bg-sky-100 dark:bg-sky-500/20',
    version: 'text-sky-700 dark:text-sky-300',
    installedBadge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    notInstalledBadge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    installButton:
      'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 border-0 text-white',
    updateButton:
      'border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20',
    removeButton:
      'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
}

const scheme = computed(() => colorSchemes[props.color] || colorSchemes.indigo)

const cardClasses = computed(() => scheme.value.bg)
const iconBgClasses = computed(() => scheme.value.iconBg)
const versionClasses = computed(() => scheme.value.version)
const installedBadgeClasses = computed(() => scheme.value.installedBadge)
const notInstalledBadgeClasses = computed(() => scheme.value.notInstalledBadge)
const installButtonClasses = computed(() => scheme.value.installButton)
const updateButtonClasses = computed(() => scheme.value.updateButton)
const removeButtonClasses = computed(() => scheme.value.removeButton)

const installedText = computed(() => (props.locale === 'km' ? 'បានដំឡើង' : 'Installed'))
const notInstalledText = computed(() => (props.locale === 'km' ? 'មិនដំឡើង' : 'Not Installed'))
const noVersionText = computed(() => (props.locale === 'km' ? 'មិនទាន់ដំឡើង' : 'Not installed'))
const installText = computed(() => (props.locale === 'km' ? 'ដំឡើង' : 'Install'))
const installingText = computed(() => (props.locale === 'km' ? 'កំពុងដំឡើង...' : 'Installing...'))
const updateText = computed(() => (props.locale === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Update'))
const updatingText = computed(() =>
  props.locale === 'km' ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'Updating...'
)
const removeText = computed(() => (props.locale === 'km' ? 'លុប' : 'Remove'))
const removingText = computed(() => (props.locale === 'km' ? 'កំពុងលុប...' : 'Removing...'))
</script>
