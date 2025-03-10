<script setup>
import { computed, inject, onMounted, watch } from "vue";
import { useAdminDepartmentStore } from "@/stores/admin/adminDepartmentStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateDepartmentAdminModal from "@/components/admin/CreateDepartmentAdminModal.vue";
import SearchBar from "@/components/admin/SearchBar.vue";
import useFilter from "@/composables/useFilter";
import usePagination from "@/composables/usePagination";
import LoadingError from "@/components/admin/common/LoadingError.vue";

const swal = inject("$swal"); // Sweetalert2
const departmentAdminStore = useAdminDepartmentStore();

// Fetch department admins on component mount
onMounted(departmentAdminStore.fetchDepartmentAdmins);

// Ensure the department admins list is reactive
const departmentAdmins = computed(() => departmentAdminStore.departmentAdmins);

// Delete department admin function (UI logic only)
const deleteDepartmentAdmin = async (id) => {
  try {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this department admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await departmentAdminStore.deleteDepartmentAdmin(id);
      // ✅ Reset pagination correctly
      if (paginatedItems.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1; // Go back to the previous page if the current one is empty
      }
      swal.fire(
        "Deleted!",
        "The department admin has been deleted.",
        "success"
      );
    }
  } catch (err) {
    swal.fire("Error!", "Failed to delete the department admin.", "error");
  }
};

// Filtering and pagination
const { searchQuery, filteredItems } = useFilter(departmentAdmins, [
  "name",
  "email",
]);
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
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <CreateDepartmentAdminModal />
      <SearchBar v-model="searchQuery" />
    </div>

    <div class="overflow-x-auto">
      <!-- Use the reusable component for loading and error handling -->
      <LoadingError :loading="departmentAdminStore.loading" :error="departmentAdminStore.error" />

      <!-- datatable -->
      <table
        class="table w-full border-collapse border border-gray-300"
        v-if="!departmentAdminStore.loading && !departmentAdminStore.error"
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
            v-for="(departmentAdmin, index) in paginatedItems"
            :key="departmentAdmin.id"
          >
            <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
            <td>{{ departmentAdmin.name }}</td>
            <td>{{ departmentAdmin.email }}</td>
            <td
              class="flex flex-col justify-start md:flex-row gap-2 items-center"
            >
              <RouterLink
                :to="{
                  name: 'view-department-admin',
                  params: { id: departmentAdmin._id },
                }"
                class="font-bold text-blue-500"
              >
                View
              </RouterLink>
              <RouterLink
                :to="{
                  name: 'edit-department-admin',
                  params: { id: departmentAdmin._id },
                }"
                class="font-bold text-yellow-500"
              >
                Edit
              </RouterLink>
              <a
                href="#"
                @click.prevent="deleteDepartmentAdmin(departmentAdmin._id)"
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
        v-if="filteredItems.length > 0 && departmentAdmins.length > 0"
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