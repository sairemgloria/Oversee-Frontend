<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRoleStore } from "@/stores/admin/roleStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const route = useRoute(); // Get the admin ID from the URL parameters
const roleStore = useRoleStore(); // Use pinia store

const roleId = route.params.id;

// Fetch the admin when the component is mounted
onMounted(() => {
  roleStore.fetchRole(roleId);
});
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Role</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="roleStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>

    <!-- Show error messages (Invalid ID, Not Found, or Server Error) -->
    <p v-else-if="roleStore.error" class="text-3xl pt-6 text-red-700">
      {{ roleStore.error }}
    </p>

    <!-- Show role details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Role Information</h1>
      <p class="text-xl">
        <strong>Name:</strong> {{ roleStore.viewSelectedRole?.name }}
      </p>
      <p class="text-xl">
        <strong>Code ID:</strong> {{ roleStore.viewSelectedRole?.codeId }}
      </p>
      <p class="text-xl">
        <strong>Department Designation:</strong> {{ roleStore.viewSelectedRole?.departmentDesignation }}
      </p>

      <!-- Buttons -->
      <div class="flex justify-start space-x-2 mt-4">
        <RouterLink
          :to="{ name: 'Roles' }"
          class="btn bg-neutral text-white"
        >
          Go back
        </RouterLink>
      </div>
    </div>
  </div>
</template>