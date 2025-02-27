<script setup>
import { ref, onMounted, watch, inject } from "vue";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateDepartmentAdminModal from "@/components/admin/CreateDepartmentAdminModal.vue";
import SearchBar from "@/components/admin/SearchBar.vue";
import useFilter from "@/composables/useFilter";
import usePagination from "@/composables/usePagination";
import LoadingError from "@/components/admin/common/LoadingError.vue";

const swal = inject("$swal"); // Sweetalert2

const loading = ref(true);
const error = ref(null);
const deptAdmins = ref([]);

/* Fetch department admins from the API */
const fetchDeptAdmins = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(
      "http://localhost:3000/api/departmentAdmins/"
    );
    if (!response.data.success) {
      error.value = response.data.message;
      deptAdmins.value = [];
      return;
    }
    deptAdmins.value = response.data.data;
  } catch (err) {
    error.value =
      err.response?.data?.message || "Error: Failed to load department admins.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDeptAdmins);

/* Function to add a new dept admin and update the list */
const addNewDeptAdmin = async (addNewDeptAdmin) => {
  // Add the new dept admin to the list
  deptAdmins.value.push(addNewDeptAdmin);

  // Fetch updated data from the backend
  try {
    await fetchDeptAdmins();
  } catch (error) {
    console.error("Failed to update department admin list:", error);
  }
};

const deleteDeptAdmin = async (id) => {
  try {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:3000/api/departmentAdmins/${id}`);

      await fetchDeptAdmins(); // Refetch dept admins from the API

      // ✅ Correctly update the list by filtering out the deleted record
      deptAdmins.value = deptAdmins.value.filter((deptAdmin) => deptAdmin._id !== id);

      // ✅ Reset pagination if no data exists
      if (deptAdmins.value.length === 0) {
        currentPage.value = 1;
      }

      swal.fire(
        "Deleted!",
        "The department admin has been deleted.",
        "success"
      );
    }
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    swal.fire("Error!", "Failed to delete the department admin.", "error");
  }
};

const { searchQuery, filteredItems } = useFilter(deptAdmins, ["name", "email"]);
const { currentPage, paginatedItems, totalPages, nextPage, prevPage } =
  usePagination(filteredItems); // Apply pagination AFTER filtering

// Reset to page 1 when search changes to avoid missing results
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Department Admin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>

  <div class="px-6">
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-4">
      <CreateDepartmentAdminModal
        @deptAdminAdded="addNewDeptAdmin"
        class="mb-2 md:mb-0"
      />
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
          <tr
            v-for="(deptAdmins, index) in paginatedItems"
            :key="deptAdmins.id"
          >
            <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
            <td>{{ deptAdmins.name }}</td>
            <td>{{ deptAdmins.email }}</td>
            <td
              class="flex flex-col justify-start md:flex-row gap-2 items-center"
            >
              <RouterLink
                :to="{
                  name: 'view-department-admin',
                  params: { id: deptAdmins._id },
                }"
                class="font-bold text-blue-500"
              >
                View
              </RouterLink>
              <RouterLink
                :to="{
                  name: 'edit-department-admin',
                  params: { id: deptAdmins._id },
                }"
                class="font-bold text-yellow-500"
              >
                Edit
              </RouterLink>
              <a
                href="#"
                @click.prevent="deleteDeptAdmin(deptAdmins._id)"
                class="font-bold text-red-500"
              >
                Delete
              </a>
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
      <!-- v-if="deptAdmins.length > 0" -->
      <div
        v-if="filteredItems.length > 0 && deptAdmins.length > 0"
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