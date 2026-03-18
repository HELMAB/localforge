<template>
  <div class="lg-panel overflow-y-auto min-h-[560px]">
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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTools } from '../composables/useTools'
import { useMenuNavigation } from '../composables/useMenuNavigation'
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

const { menuActiveView, setMenuActiveView } = useMenuNavigation()
const selectedTool = ref('php')

const validServices = ['php', 'composer', 'node', 'nginx', 'postgresql', 'mysql']

// Apply sidebar navigation to local selectedTool
watch(menuActiveView, (newView) => {
  if (validServices.includes(newView)) {
    selectedTool.value = newView
  }
})

// Sync local selectedTool back to menuActiveView for sidebar highlighting
watch(selectedTool, (newTool) => {
  if (menuActiveView.value !== newTool) {
    setMenuActiveView(newTool)
  }
})

onMounted(() => {
  checkInstalledTools()
  if (validServices.includes(menuActiveView.value)) {
    selectedTool.value = menuActiveView.value
  } else {
    setMenuActiveView(selectedTool.value)
  }
})
</script>
