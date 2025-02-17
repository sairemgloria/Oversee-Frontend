<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateAdminModal from "@/components/admin/CreateAdminModal.vue";
import SearchBar from "@/components/admin/SearchBar.vue";
import useFilter from "@/composables/useFilter";
import usePagination from "@/composables/usePagination";
import LoadingError from "@/components/admin/common/LoadingError.vue";

const loading = ref(true);
const error = ref(null);
const admins = ref([]);

/* Fetch admins from the API */
const fetchAdmins = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get("http://localhost:3000/api/admins/");
    if (!response.data.success) {
      error.value = response.data.message;
      admins.value = [];
      return;
    }
    admins.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load admins.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAdmins);

/* Use filtering */
const { searchQuery, filteredItems } = useFilter(admins, ["name", "email"]);

/* Use pagination */
const { currentPage, paginatedItems, totalPages, nextPage, prevPage } =
  usePagination(filteredItems);
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Superadmin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>

  <div class="p-4">
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-4">
      <CreateAdminModal class="mb-2 md:mb-0" />
      <SearchBar v-model="searchQuery" />
    </div>

    <div class="overflow-x-auto">
      <!-- Use the reusable component for loading and error handling -->
      <LoadingError :loading="loading" :error="error" />

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
          <tr v-for="(admin, index) in paginatedItems" :key="admin.id">
            <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td class="flex gap-2">
              <button class="text-blue-500">View</button>
              <button class="text-yellow-500">Edit</button>
              <button class="text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!loading && !error && admins.length === 0"
        class="text-xl font-bold text-center py-4"
      >
        No admins found.
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-4 md:justify-end">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-4 py-2"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
