<template>
  <!-- Nuxt options are now handled automatically with minimal template -->
  <div class="hidden" />
</template>

<script setup>
defineProps({
  nuxtTemplate: {
    type: String,
    default: 'minimal',
  },
})

defineEmits(['update:nuxtTemplate'])
</script>

