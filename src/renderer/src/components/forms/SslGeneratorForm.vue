<template>
  <div class="space-y-4">
    <div>
      <Label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ t('sslDomainLabel') }} <span class="text-red-500">*</span>
      </Label>
      <Input v-model="domain" type="text" placeholder="example.local" />
    </div>

    <InfoBox :title="t('sslNote')" :message="t('sslNote')" type="warning" />

    <Button class="w-full" :disabled="isGenerating" @click="handleGenerateSSL">
      {{ isGenerating ? t('checking') : t('generateBtn') }}
    </Button>

    <AlertNotification
      :message="status.message.value"
      :type="status.type.value"
      :visible="status.visible.value"
      @close="status.hideStatus"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSsl } from '../../composables/useSsl'
import { useStatus } from '../../composables/useStatus'
import InfoBox from '../common/InfoBox.vue'
import AlertNotification from '../common/AlertNotification.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const { t, locale } = useI18n()
const { generateSSL, isGenerating } = useSsl()
const status = useStatus()

const domain = ref('')

async function handleGenerateSSL() {
  if (!domain.value) {
    status.showStatus(
      locale.value === 'km' ? 'សូមបញ្ចូលឈ្មោះដែន' : 'Please enter domain name',
      'error'
    )
    return
  }

  status.showStatus(
    locale.value === 'km' ? 'កំពុងបង្កើតវិញ្ញាបនប័ត្រ...' : 'Generating certificate...',
    'info'
  )

  try {
    await generateSSL(domain.value)

    status.showStatus(
      locale.value === 'km' ? 'វិញ្ញាបនប័ត្របានបង្កើតជោគជ័យ' : 'Certificate generated successfully',
      'success'
    )
  } catch (error) {
    status.showStatus(
      locale.value === 'km' ? `កំហុស: ${error.message}` : `Error: ${error.message}`,
      'error'
    )
  }
}
</script>
