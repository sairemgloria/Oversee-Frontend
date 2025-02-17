<script setup>
import { ref, computed } from "vue";
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
  <input
    v-model="searchQuery"
    placeholder="Search here"
    class="border p-2 w-full md:w-auto"
  />
</template>
