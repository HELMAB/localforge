<template>
  <div class="flex gap-3">
    <ToolsSidebar :selected-tool="selectedTool" @select="selectedTool = $event" />

    <div class="flex-1 lg-panel overflow-y-auto min-h-[560px]">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTools } from '../composables/useTools'
import ToolsSidebar from '../components/forms/ToolsSidebar.vue'
import PhpSection from '../components/forms/tool-sections/PhpSection.vue'
import ComposerSection from '../components/forms/tool-sections/ComposerSection.vue'
import NodeSection from '../components/forms/tool-sections/NodeSection.vue'
import NginxSection from '../components/forms/tool-sections/NginxSection.vue'
import PostgresqlSection from '../components/forms/tool-sections/PostgresqlSection.vue'
import MysqlSection from '../components/forms/tool-sections/MysqlSection.vue'

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
