<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router"; // Import useRoute to access route data

// Reactive computed property to get the current route name
const currentRouteName = computed(() => useRoute().name);
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-1 text-sm text-gray-500">
      <!-- Home -->
      <li>
        <RouterLink
          :to="{ name: 'AdminDashboard' }"
          class="block transition hover:text-gray-400"
        >
          <span class="sr-only"> Home </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </RouterLink>
      </li>

      <!-- Separator -->
      <li class="rtl:rotate-180">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </li>

      <!-- Dynamic Page -->
      <li v-if="currentRouteName === 'AdminDashboard'">
        <p class="block transition hover:text-gray-400">Dashboard</p>
      </li>
      <li v-if="currentRouteName === 'Employees'">
        <p class="block transition hover:text-gray-400">Employees</p>
      </li>
      <li v-if="currentRouteName === 'Attendance'">
        <p class="block transition hover:text-gray-400">Attendance</p>
      </li>
      <li v-if="currentRouteName === 'Department'">
        <p class="block transition hover:text-gray-400">Department</p>
      </li>
      <li v-if="currentRouteName === 'view-department'">
        <p class="block transition hover:text-gray-400">View Department</p>
      </li>
      <li v-if="currentRouteName === 'edit-department'">
        <p class="block transition hover:text-gray-400">Edit Department</p>
      </li>
      <li v-if="currentRouteName === 'Superadmin'">
        <p class="block transition hover:text-gray-400">Superadmin</p>
      </li>
      <li v-if="currentRouteName === 'view-admin'">
        <p class="block transition hover:text-gray-400">View Admin</p>
      </li>
      <li v-if="currentRouteName === 'edit-admin'">
        <p class="block transition hover:text-gray-400">Edit Admin</p>
      </li>
      <li v-if="currentRouteName === 'Department-Admin'">
        <p class="block transition hover:text-gray-400">Department Admin</p>
      </li>
      <li v-if="currentRouteName === 'view-department-admin'">
        <p class="block transition hover:text-gray-400">
          View Department Admin
        </p>
      </li>
      <li v-if="currentRouteName === 'edit-department-admin'">
        <p class="block transition hover:text-gray-400">
          Edit Department Admin
        </p>
      </li>
      <li v-if="currentRouteName === 'Roles'">
        <p class="block transition hover:text-gray-400">Roles</p>
      </li>
      <li v-if="currentRouteName === 'view-role'">
        <p class="block transition hover:text-gray-400">View Role</p>
      </li>
      <li v-if="currentRouteName === 'edit-role'">
        <p class="block transition hover:text-gray-400">Edit Role</p>
      </li>
      <!-- Add more dynamic breadcrumb items here based on routes -->
    </ol>
  </nav>
</template>