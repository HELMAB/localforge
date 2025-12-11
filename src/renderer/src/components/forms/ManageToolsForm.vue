<template>
  <div>
    <div class="mb-4">
      <p class="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
        {{ t('manageNote') }}
      </p>
    </div>

    <div class="flex bg-white rounded-lg shadow-sm border border-gray-200">
      <ToolsSidebar :selectedTool="selectedTool" @select="selectedTool = $event" />

      <div class="flex-1 overflow-y-auto bg-gray-50">
        <PhpSection
          v-if="selectedTool === 'php'"
          :installedTools="installedTools"
          :onInstallPHP="installPHP"
          :onInstallPHPExtensions="installPHPExtensions"
        />

        <ComposerSection
          v-if="selectedTool === 'composer'"
          :installedTools="installedTools"
          :onInstallComposer="installComposer"
        />

        <NodeSection
          v-if="selectedTool === 'node'"
          :installedTools="installedTools"
          :onInstallNode="installNode"
          :onSetDefaultNode="setDefaultNode"
        />

        <NginxSection
          v-if="selectedTool === 'nginx'"
          :installedTools="installedTools"
          :onInstallNginx="installNginx"
        />

        <PostgresqlSection
          v-if="selectedTool === 'postgresql'"
          :installedTools="installedTools"
          :onInstallPostgreSQL="installPostgreSQL"
        />

        <MysqlSection
          v-if="selectedTool === 'mysql'"
          :installedTools="installedTools"
          :onInstallMySQL="installMySQL"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTools } from '../../composables/useTools'
import ToolsSidebar from './ToolsSidebar.vue'
import PhpSection from './tool-sections/PhpSection.vue'
import ComposerSection from './tool-sections/ComposerSection.vue'
import NodeSection from './tool-sections/NodeSection.vue'
import NginxSection from './tool-sections/NginxSection.vue'
import PostgresqlSection from './tool-sections/PostgresqlSection.vue'
import MysqlSection from './tool-sections/MysqlSection.vue'

const { t } = useI18n()
const {
  installedTools,
  checkInstalledTools,
  installPHP,
  installPHPExtensions,
  installNode,
  setDefaultNode,
  installNginx,
  installComposer,
  installPostgreSQL,
  installMySQL
} = useTools()

const selectedTool = ref('php')

onMounted(() => {
  checkInstalledTools()
})
</script>
