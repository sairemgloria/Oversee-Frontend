<script setup>
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import Cards from "@/components/admin/Cards.vue";
</script>

<template>
  <div class="p-6">
    <!-- Dashboard Header -->
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Dashboard</h1>
    </div>

    <Breadcrumb />

    <hr class="my-6" />

    <!-- Cards Section -->
    <Cards />
  </div>
</template>

<style scoped>
</style>
