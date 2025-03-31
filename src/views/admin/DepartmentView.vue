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
// onMounted(departmentStore.fetchDepartments);

// Ensure the roles list is reactive
const departments = computed(() => departmentStore.departments);

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
  </div>
</template>

<style scoped>
</style>
