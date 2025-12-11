<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">
        {{ t('sslDomainLabel') }} <span class="text-red-500">*</span>
      </label>
      <input
        v-model="domain"
        type="text"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="example.local"
      >
    </div>

    <InfoBox
      :title="t('sslNote')"
      :message="t('sslNote')"
      type="warning"
    />

    <button
      :disabled="isGenerating"
      class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleGenerateSSL"
    >
      {{ isGenerating ? t('checking') : t('generateBtn') }}
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
import { useSsl } from '../../composables/useSsl'
import { useStatus } from '../../composables/useStatus'
import InfoBox from '../common/InfoBox.vue'
import StatusMessage from '../common/StatusMessage.vue'

const { t, locale } = useI18n()
const { generateSSL, isGenerating } = useSsl()
const status = useStatus()

const domain = ref('')

async function handleGenerateSSL() {
  if (!domain.value) {
    status.showStatus(
      locale.value === 'km'
        ? 'សូមបញ្ចូលឈ្មោះដែន'
        : 'Please enter domain name',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km'
      ? 'កំពុងបង្កើតវិញ្ញាបនប័ត្រ...'
      : 'Generating certificate...',
    'info'
  )

  try {
    await generateSSL(domain.value)

    status.showStatus(
      locale.value === 'km'
        ? 'វិញ្ញាបនប័ត្របានបង្កើតជោគជ័យ'
        : 'Certificate generated successfully',
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km'
        ? `កំហុស: ${error.message}`
        : `Error: ${error.message}`,
      'error'
    )
  }
}
</script>
