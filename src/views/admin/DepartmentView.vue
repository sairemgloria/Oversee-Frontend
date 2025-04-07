<script setup>
import { computed, inject, onMounted, watch } from "vue";
import { useDepartmentStore } from "@/stores/admin/departmentStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateDepartmentModal from "@/components/admin/CreateDepartmentModal.vue";
import SearchBar from "@/components/admin/SearchBar.vue";
import useFilter from "@/composables/useFilter";
import usePagination from "@/composables/usePagination";
import LoadingError from "@/components/admin/common/LoadingError.vue";

const swal = inject("$swal"); // Sweetalert2
const departmentStore = useDepartmentStore();

// Fetch roles on component mount
onMounted(departmentStore.fetchDepartments);

// Ensure the roles list is reactive
const departments = computed(() => departmentStore.departments);

const deleteDepartment = async (deptId) => {
  try {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await departmentStore.deleteDepartment(deptId);

      // reset pagination correctly
      if (paginatedItems.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1; // go back to the previous page if current one is empty
      }

      swal.fire("Deleted!", "The department has been deleted.", "success");
    }
  } catch (err) {
    swal.fire("Error!", "Failed to delete the department", "error");
  }
};

// Filtering and pagination
const { searchQuery, filteredItems } = useFilter(departments, ["name"]);
const { currentPage, paginatedItems, totalPages, nextPage, prevPage } =
  usePagination(filteredItems); // Apply pagination AFTER filtering

// Reset to page 1 when search changes to avoid missing results
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div>
    <div class="p-6">
      <!-- Employees View Header -->
      <div class="mb-4">
        <h1 class="text-3xl font-bold flex items-center">Department View</h1>
      </div>

      <Breadcrumb />

      <hr class="mt-6" />
    </div>

    <div class="px-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <CreateDepartmentModal />
        <SearchBar v-model="searchQuery" />
      </div>

      <div class="overflow-x-auto">
        <!-- Use the reusable component for loading and error handling -->
        <LoadingError
          :loading="departmentStore.loading"
          :error="departmentStore.error"
        />

        <!-- datatable -->
        <table
          class="table w-full border-collapse border border-gray-300"
          v-if="!departmentStore.loading && !departmentStore.error"
        >
          <thead>
            <tr class="bg-base-300">
              <th>#</th>
              <th>Name</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Over Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredItems.length > 0">
            <tr
              v-for="(department, index) in paginatedItems"
              :key="department.id"
            >
              <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
              <td>{{ department.name }}</td>
              <td>{{ department.timeInPHT }}</td>
              <td>{{ department.timeOutPHT }}</td>
              <td>{{ department.overtimePHT }}</td>
              <td
                class="flex flex-col justify-start md:flex-row gap-2 items-center"
              >
                <RouterLink
                :to="{
                  name: 'view-department',
                  params: { id: department._id },
                }"
                class="font-bold text-blue-500"
              >
                View
              </RouterLink>
              <RouterLink
                :to="{
                  name: 'edit-department',
                  params: { id: department._id },
                }"
                class="font-bold text-yellow-500"
              >
                Edit
              </RouterLink>
              <a
                href="#"
                @click.prevent="deleteDepartment(department._id)"
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
              <th>Time In</th>
              <th>Time Out</th>
              <th>Over Time</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>

        <!-- Pagination -->
        <div
          v-if="filteredItems.length > 0 && departments.length > 0"
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
  </div>
</template>

<style scoped>
</style>
