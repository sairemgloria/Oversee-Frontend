<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDepartmentStore } from "@/stores/admin/departmentStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const route = useRoute(); // Get the department ID from the URL parameters
const departmentStore = useDepartmentStore(); // Use pinia store

const departmentId = route.params.id;

// Fetch the department when the component is mounted
onMounted(() => {
  departmentStore.fetchDepartment(departmentId);
});
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Department</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="departmentStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>

    <!-- Show error messages (Invalid ID, Not Found, or Server Error) -->
    <p v-else-if="departmentStore.error" class="text-3xl pt-6 text-red-700">
      {{ departmentStore.error }}
    </p>

    <!-- Show department details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Department Information</h1>
      <p class="text-xl">
        <strong>Name:</strong> {{ departmentStore.viewSelectedDepartment?.name }}
      </p>
      <p class="text-xl">
        <strong>Code ID:</strong> {{ departmentStore.viewSelectedDepartment?.codeId }}
      </p>
      <p class="text-xl">
        <strong>Time In:</strong> {{ departmentStore.viewSelectedDepartment?.timeInPHT }}
      </p>

      <p class="text-xl">
        <strong>Time Out:</strong> {{ departmentStore.viewSelectedDepartment?.timeOutPHT }}
      </p>

      <p class="text-xl">
        <strong>Overtime:</strong> {{ departmentStore.viewSelectedDepartment?.overtimePHT }}
      </p>

      <!-- Buttons -->
      <div class="flex justify-start space-x-2 mt-4">
        <RouterLink :to="{ name: 'Department' }" class="btn bg-neutral text-white">
          Go back
        </RouterLink>
      </div>
    </div>
  </div>
</template>