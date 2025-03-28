<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import Breadcrumb from "@/components/admin/Breadcrumb.vue";

// const route = useRoute(); // Get the admin ID from the URL parameters
// const adminStore = useAdminStore(); // Use pinia store

// const adminId = route.params.id;

// // Fetch the admin when the component is mounted
// onMounted(() => {
//   adminStore.fetchAdmin(adminId);
// });
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Role</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>
</template>