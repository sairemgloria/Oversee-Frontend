<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAdminStore } from "@/stores/admin/adminStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const route = useRoute(); // Get the admin ID from the URL parameters
const adminStore = useAdminStore(); // Use pinia store

const adminId = route.params.id;

// Fetch the admin when the component is mounted
onMounted(() => {
  adminStore.fetchAdmin(adminId);
});
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Admin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="adminStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>

    <!-- Show error messages (Invalid ID, Not Found, or Server Error) -->
    <p v-else-if="adminStore.error" class="text-3xl pt-6 text-red-700">
      {{ adminStore.error }}
    </p>

    <!-- Show admin details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>
      <p class="text-xl">
        <strong>Name:</strong> {{ adminStore.viewSelectedAdmin?.name }}
      </p>
      <p class="text-xl">
        <strong>Email:</strong> {{ adminStore.viewSelectedAdmin?.email }}
      </p>
      <p class="text-xl">
        <strong>Password:</strong> {{ adminStore.viewSelectedAdmin?.password }}
      </p>
      <p class="text-xl">
        <strong>Account Type:</strong> {{ adminStore.viewSelectedAdmin?.type }}
      </p>

      <!-- Buttons -->
      <div class="flex justify-start space-x-2 mt-4">
        <RouterLink
          :to="{ name: 'Superadmin' }"
          class="btn bg-neutral text-white"
        >
          Go back
        </RouterLink>
      </div>
    </div>
  </div>
</template>
