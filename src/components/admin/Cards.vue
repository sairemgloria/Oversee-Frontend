<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const deptAdminCount = ref(0);
const loading = ref(false);
const error = ref(null);

const fetchDeptAdminCount = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(
      "http://localhost:3000/api/departmentAdmins/count"
    );

    if (!response.data.success) {
      error.value = response.data.message;
      deptAdminCount.value = 0;
      return;
    }

    deptAdminCount.value = response.data.count; // ✅ Store count instead of data
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Error: Failed to load department admin count.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDeptAdminCount);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Employees -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">100</div>
          <div class="text-gray-500">Employees</div>
        </div>
        <i class="logo bx bxs-group bx-lg" />
      </div>
    </div>

    <!-- Female Employees -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">25</div>
          <div class="text-gray-500">Female Employee</div>
        </div>
        <i class="logo bx bx-female-sign bx-lg" />
      </div>
    </div>

    <!-- Male Employees -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">75</div>
          <div class="text-gray-500">Male Employee</div>
        </div>
        <i class="logo bx bx-male-sign bx-lg" />
      </div>
    </div>

    <!-- Attendance -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">50</div>
          <div class="text-gray-500">Attendance</div>
        </div>
        <i class="logo bx bx-calendar bx-lg" />
      </div>
    </div>

    <!-- Departments -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">5</div>
          <div class="text-gray-500">Departments</div>
        </div>
        <i class="logo bx bx-map-alt bx-lg" />
      </div>
    </div>

    <!-- Roles -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">7</div>
          <div class="text-gray-500">Roles</div>
        </div>
        <i class="logo bx bx-wrench bx-lg" />
      </div>
    </div>

    <!-- Administrator -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">
            <p v-if="loading">Loading...</p>
            <p v-else-if="error">{{ error }}</p>
            <p v-else>{{ deptAdminCount }}</p>
          </div>
          <div class="text-gray-500">Administrator</div>
        </div>
        <i class="logo bx bx-check-shield bx-lg" />
      </div>
    </div>
  </div>
</template>

<style>
/* Optional: Add any custom styles here */
.logo {
  transition: transform 0.3s ease-in-out;
}

.logo:hover {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}
</style>