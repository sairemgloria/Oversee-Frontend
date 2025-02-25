<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

// Get the admin ID from the URL parameters
const route = useRoute();
const deptAdminId = route.params.id;

// Reactive variables for admin data, error messages, and loading state
const deptAdmin = ref(null);
const error = ref(null);
const loading = ref(true);

// Function to fetch the selected dept admin data
const fetchDeptAdmin = async () => {
  loading.value = true;
  error.value = null;

  // Frontend validation: Check if the ID is valid before making an API call
  if (!deptAdminId.match(/^[0-9a-fA-F]{24}$/)) {
    error.value = "Invalid Admin ID.";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/departmentAdmins/${deptAdminId}`
    );

    if (response.data.success) {
      deptAdmin.value = response.data.data; // Store admin details
    } else {
      error.value = response.data.message || "Department Admin not found.";
    }
  } catch (err) {
    // Handle different response errors
    if (err.response) {
      error.value =
        err.response.data.message || "An unexpected error occurred.";
    } else {
      error.value =
        "Failed to load department admin details. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
};

// Fetch dept admin when the component is mounted
onMounted(fetchDeptAdmin);
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">
        View Department Admin
      </h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="loading" class="text-3xl pt-6 text-gray-500">Fetching data...</p>

    <!-- Show error messages (Invalid ID, Not Found, or Server Error) -->
    <p v-else-if="error" class="text-3xl pt-6 text-red-700">{{ error }}</p>

    <!-- Show admin details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>
      <p class="text-xl"><strong>Name:</strong> {{ deptAdmin.name }}</p>
      <p class="text-xl"><strong>Email:</strong> {{ deptAdmin.email }}</p>
      <p class="text-xl"><strong>Password:</strong> {{ deptAdmin.password }}</p>
      <p class="text-xl"><strong>Account Type:</strong> {{ deptAdmin.type }}</p>

      <!-- Buttons -->
      <div class="flex justify-start space-x-2 mt-4">
        <RouterLink
          :to="{ name: 'Department-Admin' }"
          class="btn bg-neutral text-white"
        >
          Go back
        </RouterLink>
      </div>
    </div>
  </div>
</template>
