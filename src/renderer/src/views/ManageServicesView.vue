<template>
  <div class="p-6">
    <div class="mb-4">
      <p
        class="text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded px-3 py-2"
      >
        {{ t('manageNote') }}
      </p>
    </div>

    <div
      class="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <ToolsSidebar
        :selected-tool="selectedTool"
        @select="selectedTool = $event"
      />

      <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <PhpSection
          v-if="selectedTool === 'php'"
          :installed-tools="installedTools"
          :on-install-php="installPHP"
          :on-install-php-extensions="installPHPExtensions"
        />

        <ComposerSection
          v-if="selectedTool === 'composer'"
          :installed-tools="installedTools"
          :on-install-composer="installComposer"
        />

        <NodeSection
          v-if="selectedTool === 'node'"
          :installed-tools="installedTools"
          :on-install-node="installNode"
          :on-set-default-node="setDefaultNode"
          :on-uninstall-node="uninstallNode"
        />

        <NginxSection
          v-if="selectedTool === 'nginx'"
          :installed-tools="installedTools"
          :on-install-nginx="installNginx"
        />

        <PostgresqlSection
          v-if="selectedTool === 'postgresql'"
          :installed-tools="installedTools"
          :on-install-postgresql="installPostgreSQL"
        />

        <MysqlSection
          v-if="selectedTool === 'mysql'"
          :installed-tools="installedTools"
          :on-install-mysql="installMySQL"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTools } from '../composables/useTools'
import ToolsSidebar from '../components/forms/ToolsSidebar.vue'
import PhpSection from '../components/forms/tool-sections/PhpSection.vue'
import ComposerSection from '../components/forms/tool-sections/ComposerSection.vue'
import NodeSection from '../components/forms/tool-sections/NodeSection.vue'
import NginxSection from '../components/forms/tool-sections/NginxSection.vue'
import PostgresqlSection from '../components/forms/tool-sections/PostgresqlSection.vue'
import MysqlSection from '../components/forms/tool-sections/MysqlSection.vue'

const { t } = useI18n()
const {
  installedTools,
  checkInstalledTools,
  installPHP,
  installPHPExtensions,
  installNode,
  setDefaultNode,
  uninstallNode,
  installNginx,
  installComposer,
  installPostgreSQL,
  installMySQL,
} = useTools()

const selectedTool = ref('php')

onMounted(() => {
  checkInstalledTools()
})
</script>
