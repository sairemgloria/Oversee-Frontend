<script setup>
import { onMounted } from "vue";
import { useCardsStore } from "@/stores/admin/cardsStore";

const cardsStore = useCardsStore(); // Use pinia store

onMounted(() => {
  cardsStore.countRoles();
  cardsStore.countDeptAdmin();
});
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
          <div class="text-3xl font-semibold">
            <p v-if="cardsStore.loading">Loading...</p>
            <p v-else-if="cardsStore.error">{{ cardsStore.error }}</p>
            <p v-else>{{ cardsStore.departmentsCount ?? 0}}</p>
          </div>
          <div class="text-gray-500">Departments</div>
        </div>
        <i class="logo bx bx-map-alt bx-lg" />
      </div>
    </div>

    <!-- Roles -->
    <div class="bg-base-200 p-6">
      <div class="flex items-center justify-between">
        <div class="col">
          <div class="text-3xl font-semibold">
            <p v-if="cardsStore.loading">Loading...</p>
            <p v-else-if="cardsStore.error">{{ cardsStore.error }}</p>
            <p v-else>{{ cardsStore.rolesCount ?? 0}}</p>
          </div>
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
            <p v-if="cardsStore.loading">Loading...</p>
            <p v-else-if="cardsStore.error">{{ cardsStore.error }}</p>
            <p v-else>{{ cardsStore.deptAdminCount ?? 0 }}</p>
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