<script setup>
import ToggleMode from "@/components/admin/ToggleMode.vue";
import { RouterLink } from "vue-router";
import { defineProps, defineEmits } from "vue";

// Accept the sidebarOpen prop from the parent
const props = defineProps({
  sidebarOpen: Boolean,
});

// Define the emit method to communicate with the parent
const emit = defineEmits(["toggle-sidebar"]);
</script>

<template>
  <div
    :class="[
      'sidebar bg-base-200 w-64 fixed lg:static inset-y-0 left-0 transform transition-transform duration-300 flex flex-col justify-between',
      props.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0', // Ensure the sidebar is always visible on large screens
    ]"
  >
    <div>
      <div class="p-3 text-4xl border-b border-gray-300">Oversee</div>
      <nav class="p-4 space-y-2">
        <RouterLink
          :to="{ name: 'AdminDashboard' }"
          class="block px-4 py-3 hover:text-gray-200 rounded hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-dashboard bx-sm" />
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'Employees' }"
          class="block px-4 py-3 rounded hover:text-gray-200 hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-group bx-sm" />
          <span>Employee</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'Attendance' }"
          class="block px-4 py-3 rounded hover:text-gray-200 hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-calendar bx-sm" />
          <span>Attendance</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'Department' }"
          class="block px-4 py-3 rounded hover:text-gray-200 hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-map-alt bx-sm" />
          <span>Department</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'Roles' }"
          class="block px-4 py-3 rounded hover:text-gray-200 hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-wrench bx-sm" />
          <span>Role</span>
        </RouterLink>
        <div>
          <details class="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              class="flex cursor-pointer items-center justify-between rounded px-4 py-3 hover:text-gray-200 hover:bg-gray-500"
            >
              <div class="flex items-center space-x-2">
                <i class="bx bxs-check-shield bx-sm" />
                <span>Administrator</span>
              </div>

              <!-- Arrow Icon at the end -->
              <span
                class="shrink-0 ml-auto transition duration-300 group-open:-rotate-180"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <ul class="mt-2 space-y-1 px-4">
              <li>
                <RouterLink
                  :to="{ name: 'Department-Admin' }"
                  class="block rounded px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-500"
                >
                  Department Admin
                </RouterLink>
              </li>

              <li>
                <RouterLink
                  :to="{ name: 'Superadmin' }"
                  class="block rounded px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-500"
                >
                  Superadmin
                </RouterLink>
              </li>
            </ul>
          </details>
        </div>
        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary
            class="flex cursor-pointer items-center justify-between rounded px-4 py-3 hover:text-gray-200 rounded hover:bg-gray-500"
          >
            <div class="flex items-center space-x-2">
              <i class="bx bxs-cog bx-sm" />
              <span>Settings & Privacy</span>
            </div>

            <!-- Arrow Icon at the end -->
            <span
              class="shrink-0 ml-auto transition duration-300 group-open:-rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </summary>

          <ul class="mt-2 space-y-1 px-4">
            <li>
              <RouterLink
                to=""
                class="block rounded px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-500"
              >
                Profile Settings
              </RouterLink>
            </li>

            <li>
              <RouterLink
                to=""
                class="block rounded px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-500"
              >
                Change Password
              </RouterLink>
            </li>
          </ul>
        </details>
        <RouterLink
          to=""
          class="block px-4 py-3 mt-2 rounded hover:text-gray-200 rounded hover:bg-gray-500 flex items-center space-x-2"
        >
          <i class="bx bxs-log-out bx-sm" />
          <span>Logout</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Toggle Mode at the end -->
    <div class="p-4 border-t border-gray-300">
      <div class="flex space-x-2 items-center">
        <ToggleMode />
        <span>Switch appearance</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  z-index: 10; /* Ensure sidebar is above other content */
}
</style>