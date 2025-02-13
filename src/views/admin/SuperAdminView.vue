<script setup>
import { ref, computed } from "vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
import CreateAdminModal from "@/components/admin/CreateAdminModal.vue";

const headers = ref([
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "Password", value: "password" },
  { text: "Actions", value: "actions" },
]);

const items = ref([
  { name: "Admin One", email: "admin1@example.com", password: "pass123" },
  { name: "Admin Two", email: "admin2@example.com", password: "securepass" },
  { name: "Admin Three", email: "admin3@example.com", password: "letmein" },
  { name: "Admin Four", email: "admin4@example.com", password: "adminpass" },
]);

const searchQuery = ref("");

const filteredItems = computed(() => {
  return items.value.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
        placeholder="Search admins..."
        class="border p-2 w-full md:w-auto"
      />
    </div>
    <Vue3EasyDataTable :headers="headers" :items="filteredItems">
      <template #item-actions="{ item }">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <button @click="viewItem(item)" class="text-blue-500 mr-2">
            View
          </button>
          <button @click="editItem(item)" class="text-yellow-500 mr-2">
            Edit
          </button>
          <button @click="deleteItem(item)" class="text-red-500">Delete</button>
        </div>
      </template>
    </Vue3EasyDataTable>
  </div>
</template>