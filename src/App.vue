<script setup>
import { RouterView } from "vue-router";
/* added */
import Sidebar from "@/components/admin/Sidebar.vue";
import { ref } from "vue";

// The sidebarOpen state is managed in the parent component
const sidebarOpen = ref(false);

// Toggle the sidebar state
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar :sidebarOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    <!-- Main Content -->
    <div class="bg-base-100 flex-1 flex flex-col">
      <!-- Mobile Header -->
      <div
        class="bg-success-content shadow p-4 flex justify-end items-center lg:hidden"
      >
        <button @click="toggleSidebar" class="text-gray-800 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            color="white"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <!-- Display Router View -->
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
