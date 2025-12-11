<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">{{ t('domainLabel') }}</label>
      <input
        v-model="domain"
        type="text"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="example.local"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('nginxPathLabel') }}</label>
      <DirectorySelector v-model="nginxProjectPath" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('nginxPhpVersionLabel') }}</label>
      <select
        v-model="phpVersion"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Auto-detect (ស្វ័យប្រវត្តិ)</option>
        <option value="8.3">PHP 8.3-FPM</option>
        <option value="8.2">PHP 8.2-FPM</option>
        <option value="8.1">PHP 8.1-FPM</option>
        <option value="8.0">PHP 8.0-FPM</option>
        <option value="7.4">PHP 7.4-FPM</option>
      </select>
      <p class="text-xs text-gray-500 mt-1">{{ t('nginxPhpHint') }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">{{ t('portLabel') }}</label>
      <input
        v-model.number="port"
        type="number"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      @click="handleConfigureNginx"
      :disabled="isConfiguring"
      class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNginx } from '../../composables/useNginx'
import { useStatus } from '../../composables/useStatus'
import DirectorySelector from '../common/DirectorySelector.vue'
import StatusMessage from '../common/StatusMessage.vue'

const { t, locale } = useI18n()
const { configureNginx, isConfiguring } = useNginx()
const status = useStatus()

const domain = ref('')
const nginxProjectPath = ref('')
const phpVersion = ref('')
const port = ref(80)

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
