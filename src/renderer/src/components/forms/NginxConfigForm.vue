<template>
  <div class="space-y-4">
    <!-- Project Type Selector -->
    <div>
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('nginxProjectTypeLabel') }} <span class="text-red-500">*</span>
      </label>
      <CustomSelect
        v-model="projectType"
        :options="projectTypeOptions"
      />
    </div>

    <!-- 2-Column Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2 dark:text-gray-300">
          {{ t('domainLabel') }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="domain"
          type="text"
          class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example.local"
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 dark:text-gray-300">
          {{ t('nginxPathLabel') }} <span class="text-red-500">*</span>
        </label>
        <DirectorySelector v-model="nginxProjectPath" />
      </div>

      <!-- PHP Version (only for PHP, Laravel, and WordPress projects) -->
      <div v-if="['php', 'laravel', 'wordpress'].includes(projectType)">
        <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('nginxPhpVersionLabel') }}</label>
        <CustomSelect
          v-model="phpVersion"
          :options="phpVersionOptions"
          placeholder="Auto-detect (ស្វ័យប្រវត្តិ)"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ t('nginxPhpHint') }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 dark:text-gray-300">{{ t('portLabel') }}</label>
        <input
          v-model.number="port"
          type="number"
          class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
    </div>

    <button
      :disabled="isConfiguring"
      class="w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      @click="handleConfigureNginx"
    >
      {{ isConfiguring ? t('checking') : t('configureBtn') }}
    </button>

    <StatusMessage
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNginx } from '../../composables/useNginx'
import { useStatus } from '../../composables/useStatus'
import { useTools } from '../../composables/useTools'
import DirectorySelector from '../common/DirectorySelector.vue'
import StatusMessage from '../common/StatusMessage.vue'
import CustomSelect from '../common/CustomSelect.vue'
import phpIcon from '@/assets/svg/php.svg'
import laravelIcon from '@/assets/svg/laravel.svg'
import wordpressIcon from '@/assets/svg/wordpress.svg'
import vueIcon from '@/assets/svg/vuejs.svg'
import htmlIcon from '@/assets/svg/html5.svg'

const { t, locale } = useI18n()
const { configureNginx, isConfiguring } = useNginx()
const status = useStatus()
const { installedTools, checkInstalledTools } = useTools()

const projectType = ref('php')
const domain = ref('')
const nginxProjectPath = ref('')
const phpVersion = ref('')
const port = ref(80)

onMounted(async () => {
  await checkInstalledTools()
})

const projectTypeOptions = [
  { value: 'php', label: 'PHP', icon: phpIcon },
  { value: 'laravel', label: 'Laravel', icon: laravelIcon },
  { value: 'wordpress', label: 'WordPress', icon: wordpressIcon },
  { value: 'static-vue', label: 'Vue', icon: vueIcon },
  { value: 'static-html', label: 'HTML', icon: htmlIcon }
]

const phpVersionOptions = computed(() => {
  const options = [
    { value: '', label: 'Auto-detect (ស្វ័យប្រវត្តិ)', icon: phpIcon }
  ]
  
  // Add installed PHP versions
  if (installedTools.value.php.installed && installedTools.value.php.versions.length > 0) {
    installedTools.value.php.versions.forEach(version => {
      options.push({
        value: version,
        label: `PHP ${version}-FPM`,
        icon: phpIcon
      })
    })
  }
  
  return options
})

async function handleConfigureNginx() {
  if (!domain.value || !nginxProjectPath.value) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមបំពេញព័ត៌មានទាំងអស់'
        : 'Please fill all fields',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km'
      ? 'កំពុងកំណត់រចនាសម្ព័ន្ធ... (អ្នកប្រហែលជាត្រូវបញ្ចូលពាក្យសម្ងាត់)'
      : 'Configuring... (You may need to enter your password)',
    'info'
  )

  try {
    const result = await configureNginx({
      domain: domain.value,
      projectPath: nginxProjectPath.value,
      port: port.value,
      projectType: projectType.value,
      phpVersion: phpVersion.value || null
    })

    const phpInfo = result.phpFpmSocket ? `\nPHP-FPM: ${result.phpFpmSocket}` : ''

    status.showStatus(
      locale.value === 'km'
        ? `Nginx បានកំណត់រចនាសម្ព័ន្ធជោគជ័យ!${phpInfo}\n\nកុំភ្លេច៖\n1. បន្ថែម "${domain.value}" ទៅក្នុង /etc/hosts\n2. ដំណើរការ៖ sudo nano /etc/hosts\n3. បន្ថែម៖ 127.0.0.1 ${domain.value}`
        : `Nginx configured successfully!${phpInfo}\n\nDon't forget:\n1. Add "${domain.value}" to /etc/hosts\n2. Run: sudo nano /etc/hosts\n3. Add: 127.0.0.1 ${domain.value}`,
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុស: ${error.message}\n\nប្រសិនបើអ្នកមិនបានបញ្ចូលពាក្យសម្ងាត់ សូមព្យាយាមម្តងទៀត។`
        : `Error: ${error.message}\n\nIf you didn't enter the password, please try again.`,
      'error'
    )
  }
}
</script>
