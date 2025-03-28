<script setup>
import { computed, inject, onMounted, watch } from "vue";
import { useRoleStore } from "@/stores/admin/roleStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateRoleModal from "@/components/admin/CreateRoleModal.vue";
import SearchBar from "@/components/admin/SearchBar.vue";
import useFilter from "@/composables/useFilter";
import usePagination from "@/composables/usePagination";
import LoadingError from "@/components/admin/common/LoadingError.vue";

const swal = inject("$swal"); // Sweetalert2
const roleStore = useRoleStore();

// Fetch roles on component mount
onMounted(roleStore.fetchRoles);

// Ensure the roles list is reactive
const roles = computed(() => roleStore.roles);

// Delete role function (UI Logic Only)
const deleteRole = async (roleId) => {
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
      await roleStore.deleteRole(roleId);

      // Reset pagination correctly
      if (paginatedItems.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1; // Go back to the previous page if the current one is empty
      }

      swal.fire("Deleted!", "The role has been deleted.", "success");
    }
  } catch (err) {
    swal.fire("Error!", "Failed to delete the role.", "error");
  }
};

// Filtering and pagination
const { searchQuery, filteredItems } = useFilter(roles, ["name"]);
const { currentPage, paginatedItems, totalPages, nextPage, prevPage } =
  usePagination(filteredItems); // Apply pagination AFTER filtering

// Reset to page 1 when search changes to avoid missing results
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="p-6">
    <!-- Roles View Header -->
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Roles View</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>

  <div class="px-6">
    <div class="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <CreateRoleModal />
      <SearchBar v-model="searchQuery" />
    </div>

    <div class="overflow-x-auto">
      <!-- Use the reusable component for loading and error handling -->
      <LoadingError :loading="roleStore.loading" :error="roleStore.error" />

      <!-- datatable -->
      <table
        class="table w-full border-collapse border border-gray-300"
        v-if="!roleStore.loading && !roleStore.error"
      >
        <thead>
          <tr class="bg-base-300">
            <th>#</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-if="filteredItems.length > 0">
          <tr v-for="(role, index) in paginatedItems" :key="role.id">
            <td>{{ (currentPage - 1) * 5 + index + 1 }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.departmentDesignation }}</td>
            <td
              class="flex flex-col justify-start md:flex-row gap-2 items-center"
            >
              <RouterLink
                :to="{ name: 'view-role', params: { id: role._id } }"
                class="font-bold text-blue-500"
              >
                View
              </RouterLink>
              <RouterLink
                :to="{ name: 'edit-role', params: { id: role._id } }"
                class="font-bold text-yellow-500"
              >
                Edit
              </RouterLink>
              <a
                href="#"
                @click.prevent="deleteRole(role._id)"
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
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>

      <!-- Pagination -->
      <!-- v-if="roles.length > 0" -->
      <div
        v-if="filteredItems.length > 0 && roles.length > 0"
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

<style scoped>
</style>
