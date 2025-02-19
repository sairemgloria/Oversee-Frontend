<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

// Get the admin ID from the URL parameters
const route = useRoute();
const adminId = route.params.id;

// Reactive variables for admin data, error messages, and loading state
const admin = ref(null);
const error = ref(null);
const loading = ref(true);

// Function to fetch the selected admin data
const fetchAdmin = async () => {
  loading.value = true;
  error.value = null;

  // Frontend validation: Check if the ID is valid before making an API call
  if (!adminId.match(/^[0-9a-fA-F]{24}$/)) {
    error.value = "Invalid Admin ID.";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/admins/${adminId}`
    );

    if (response.data.success) {
      admin.value = response.data.data; // Store admin details
    } else {
      error.value = response.data.message || "Admin not found.";
    }
  } catch (err) {
    // Handle different response errors
    if (err.response) {
      error.value =
        err.response.data.message || "An unexpected error occurred.";
    } else {
      error.value = "Failed to load admin details. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
};

// Fetch admin when the component is mounted
onMounted(fetchAdmin);
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Admin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="loading" class="text-xl text-gray-500">Fetching data...</p>

    <!-- Show error messages (Invalid ID, Not Found, or Server Error) -->
    <p v-else-if="error" class="text-2xl text-red-700">{{ error }}</p>

    <!-- Show admin details if fetched successfully -->
    <div v-else class="pt-8">
      <h1 class="text-3xl">Profile Information</h1>
      <p class="text-xl"><strong>Name:</strong> {{ admin.name }}</p>
      <p class="text-xl"><strong>Email:</strong> {{ admin.email }}</p>
      <p class="text-xl"><strong>Password:</strong> {{ admin.password }}</p>
      <p class="text-xl"><strong>Account Type:</strong> {{ admin.type }}</p>
    </div>
  </div>
</template>
