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
    error.value =
      err.response?.data?.message || "Error: Failed to load admins.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAdmins);

/* Function to add a new admin and update the list */
const addNewAdmin = async (newAdmin) => {
  // Add the new admin to the list
  admins.value.push(newAdmin);

  // Fetch updated data from the backend
  try {
    await fetchAdmins();
  } catch (error) {
    console.error("Failed to update admin list:", error);
  }
};

/* Use filtering */
const { searchQuery, filteredItems } = useFilter(admins, ["name", "email"]);

/* Use pagination */
const { currentPage, paginatedItems, totalPages, nextPage, prevPage } =
  usePagination(filteredItems);
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Superadmin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>

  <div class="p-2 md:p-6">
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-4">
      <CreateAdminModal @adminAdded="addNewAdmin" class="mb-2 md:mb-0" />
      <SearchBar v-model="searchQuery" />
    </div>

    <div class="overflow-x-auto">
      <!-- Use the reusable component for loading and error handling -->
      <LoadingError :loading="loading" :error="error" />

      <!-- datatable -->
      <table
        class="table w-full border-collapse border border-gray-300"
        v-if="!loading && !error"
      >
        <thead>
          <tr class="bg-base-300">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-if="filteredItems.length > 0">
          <tr v-for="(admin, index) in paginatedItems" :key="admin.id">
            <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td class="flex flex-col justify-start md:flex-row gap-2 items-center">
              <RouterLink
                :to="{ name: 'view-admin', params: { id: admin._id } }"
                class="font-bold text-blue-500"
              >
                View
              </RouterLink>
              <RouterLink
                :to="{ name: 'view-admin', params: { id: admin._id } }"
                class="font-bold text-yellow-500"
              >
                Edit
              </RouterLink>
              <RouterLink
                :to="{ name: 'view-admin', params: { id: admin._id } }"
                class="font-bold text-red-500"
              >
                Delete
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center py-4">No record found.</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-base-300">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>

      <!-- Pagination -->
      <div
        v-if="admins.length > 0"
        class="flex justify-center my-4 md:justify-end my-8"
      >
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
