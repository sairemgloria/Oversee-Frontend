<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateAdminModal from "@/components/admin/CreateAdminModal.vue";

/* Sets loading to true */
const loading = ref(true);
const error = ref(null);

// Store fetched admin data
const admins = ref([]);

// Function to fetch all admins from the backend API
const fetchAdmins = async () => {
  loading.value = true;
  error.value = null; // Reset error message before fetching

  try {
    const response = await axios.get("http://localhost:3000/api/admins/");
    
    // Handle response if no admins are found
    if (!response.data.success) {
      error.value = response.data.message; // Display API message
      admins.value = []; // Ensure the admins array is empty
      return;
    }

    admins.value = response.data.data; // Set data if admins exist
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = err.response.data.message; // Display "No admin found"
    } else {
      error.value = "Failed to load admins. Please try again.";
    }
  } finally {
    loading.value = false; // Ensure loading is set to false after fetching data
  }
};


// Fetch admins when the component is mounted
onMounted(fetchAdmins);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredItems = computed(() => {
  return admins.value
    .map((admin, index) => ({ ...admin, count: index + 1 }))
    .filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});
</script>

<template>
  <div class="p-4">
    <!-- Superadmin Header -->
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Superadmin</h1>
    </div>

    <Breadcrumb />

    <hr class="mt-6" />
  </div>

  <div class="p-4">
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-4">
      <CreateAdminModal class="mb-2 md:mb-0" />

      <input
        v-model="searchQuery"
        placeholder="Search here"
        class="border p-2 w-full md:w-auto"
      />
    </div>

    <div class="overflow-x-auto">
      <!-- Loading and Error Handling -->
      <div v-if="loading">Loading...</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>

      <!-- Table -->
      <table
        class="table w-full border-collapse border border-gray-300"
        v-if="!loading && !error && admins.length > 0"
      >
        <thead>
          <tr class="bg-base-300">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="admin in paginatedItems"
            :key="admin.count"
            class="hover:bg-base-200"
          >
            <td>{{ admin.count }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td
              class="flex flex-col justify-start py-5 md:flex-row gap-2 justify-center"
            >
              <button class="text-blue-500">View</button>
              <button class="text-yellow-500">Edit</button>
              <button class="text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Data Found Message -->
      <div
        v-if="!loading && !error && admins.length === 0"
        class="text-center py-4"
      >
        No admins found.
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-4 md:justify-end">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-4 py-2"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>