<template>
  <div id="app" class="container mx-auto p-6">
    <AppHeader />

    <div class="bg-white rounded-lg shadow-md mb-6">
      <TabNavigation />

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import TabNavigation from './components/layout/TabNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
