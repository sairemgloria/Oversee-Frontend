<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateAdminModal from "@/components/admin/CreateAdminModal.vue";

const headers = ref([
  { text: "#", value: "count" },
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "Actions", value: "actions" },
]);

const items = ref([
  { name: "Admin One", email: "admin1@example.com", password: "pass123" },
  { name: "Admin Two", email: "admin2@example.com", password: "securepass" },
  { name: "Admin Three", email: "admin3@example.com", password: "letmein" },
  { name: "Admin Four", email: "admin4@example.com", password: "adminpass" },
]);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredItems = computed(() => {
  return items.value
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

const viewItem = (item) => {
  alert(`Viewing: ${item.name}`);
};

const editItem = (item) => {
  alert(`Editing: ${item.name}`);
};

const deleteItem = (item) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    items.value = items.value.filter((admin) => admin !== item);
  }
};
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
      <!-- -->
      <table class="table w-full border-collapse border border-gray-300">
        <!-- Head -->
        <thead>
          <tr class="bg-base-300">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <!-- Body -->
        <tbody>
          <tr
            v-for="item in paginatedItems"
            :key="item.email"
            class="hover:bg-base-200"
          >
            <td>{{ item.count }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td class="flex flex-col justify-start py-5 md:flex-row gap-2 justify-center">
              <button @click="viewItem(item)" class="text-blue-500">
                View
              </button>
              <button @click="editItem(item)" class="text-yellow-500">
                Edit
              </button>
              <button @click="deleteItem(item)" class="text-red-500">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
      <span class="px-4 py-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>