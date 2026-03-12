<template>
  <div class="space-y-6">
    <!-- Domain Input Section -->
    <div>
      <Label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('sslDomainLabel') }} <span class="text-red-500">*</span>
      </Label>
      <div class="relative">
        <Input
          v-model="domain"
          type="text"
          :placeholder="locale === 'km' ? 'example.local' : 'example.local'"
          :class="[
            'w-full px-4 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors',
            validationErrors.domain
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary',
          ]"
          @blur="validateDomain"
        />
        <CheckCircle2
          v-if="domain && !validationErrors.domain && isDomainValid"
          class="h-5 w-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>
      <div
        v-if="validationErrors.domain"
        class="flex items-start gap-1.5 mt-1.5 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
      >
        <AlertCircle class="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <p class="text-red-700 dark:text-red-300 text-xs leading-tight">
          {{ validationErrors.domain }}
        </p>
      </div>
    </div>

    <!-- Project Selection Section -->
    <div>
      <Label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('sslProjectLabel') }}
      </Label>
      <div v-if="recentProjects.length > 0">
        <CustomSelect
          v-model="selectedProject"
          :options="projectOptions"
          :placeholder="t('sslProjectPlaceholder')"
        />
        <p class="text-xs text-muted-foreground mt-1.5">
          {{ t('sslSelectProject') }}
        </p>
      </div>
      <div v-else class="text-sm text-muted-foreground p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {{ t('noRecentProjects') }}
      </div>
    </div>

    <!-- Info Box -->
    <InfoBox :message="t('sslNote')" type="info" />

    <!-- Generate Button -->
    <div class="relative">
      <Button class="w-full" :disabled="isGenerating || !domain" @click="handleGenerateSSL">
        <Loader2 v-if="isGenerating" class="h-4 w-4 mr-2 animate-spin" />
        {{ isGenerating ? t('sslGenerating') : t('generateBtn') }}
      </Button>
    </div>

    <!-- Status Notification -->
    <AlertNotification
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
      :action-label="status.type.value === 'success' ? t('openInFileManager') : undefined"
      @close="status.hideStatus"
      @action="handleStatusAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSsl } from '../../composables/useSsl'
import { useStatus } from '../../composables/useStatus'
import { useRecentProjects } from '../../composables/useRecentProjects'
import { validateField } from '../../utils/validation'
import { domainSchema } from '../../utils/validation'
import InfoBox from '../common/InfoBox.vue'
import AlertNotification from '../common/AlertNotification.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import CustomSelect from '../common/CustomSelect.vue'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-vue-next'

const { t, locale } = useI18n()
const { generateSSL, isGenerating } = useSsl()
const status = useStatus()
const { recentProjects, loadRecentProjects } = useRecentProjects()

const domain = ref('')
const selectedProject = ref('')
const validationErrors = ref({})
const certificatePath = ref('')

const isDomainValid = computed(() => {
  return domain.value && !validationErrors.value.domain
})

const projectOptions = computed(() => {
  const options = [{ value: '', label: t('sslProjectPlaceholder') }]
  recentProjects.value.forEach((project) => {
    options.push({
      value: project.path,
      label: `${project.name} (${project.type})`,
    })
  })
  return options
})

function validateDomain() {
  const result = validateField(domainSchema, 'domain', domain.value)
  if (!result.valid) {
    validationErrors.value.domain = result.error
  } else {
    validationErrors.value.domain = null
    autoDetectProject()
  }
}

function autoDetectProject() {
  if (recentProjects.value.length === 0) return

  const domainLower = domain.value.toLowerCase()
  const matchingProject = recentProjects.value.find((project) => {
    const projectNameLower = project.name.toLowerCase()
    return (
      domainLower.includes(projectNameLower) || projectNameLower.includes(domainLower.split('.')[0])
    )
  })

  if (matchingProject) {
    selectedProject.value = matchingProject.path
  }
}

function handleStatusAction() {
  if (status.type.value === 'success' && certificatePath.value) {
    const { invoke } = useSsl()
    invoke('open-directory', { path: certificatePath.value })
  }
}

async function handleGenerateSSL() {
  if (!domain.value) {
    validationErrors.value.domain =
      locale.value === 'km' ? 'សូមបញ្ចូលឈ្មោះដែន' : 'Please enter domain name'
    return
  }

  validateDomain()
  if (validationErrors.value.domain) {
    return
  }

  certificatePath.value = ''
  status.showStatus(t('sslGenerating'), 'info')

  try {
    const result = await generateSSL(domain.value)
    certificatePath.value = result.path || ''

    const successMessage = result.message || t('sslGenerateSuccess')
    status.showStatus(successMessage, 'success')
  } catch (error) {
    const errorMessage = error.message || t('sslGenerateError')
    status.showStatus(errorMessage, 'error')
  }
}

onMounted(() => {
  loadRecentProjects()
})
</script>
