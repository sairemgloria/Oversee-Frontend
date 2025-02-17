<script setup>
defineProps({
  loading: Boolean,
  error: String,
});
</script>

<template>
  <div>
    <div v-if="loading" class="text-xl font-bold text-center">
      Fetching data...
    </div>
    <div v-if="error" class="text-xl font-bold text-red-700 text-center">
      {{ error }}
    </div>
  </div>
</template>