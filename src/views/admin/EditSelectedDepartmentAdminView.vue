<script setup>
import { ref, inject, onMounted, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAdminDepartmentStore } from "@/stores/admin/adminDepartmentStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const swal = inject("$swal"); // Sweetalert2
const route = useRoute();
const router = useRouter();
const adminDepartmentStore = useAdminDepartmentStore();

const departmentAdminId = route.params.id;

// Form validation errors
const validationErrors = ref({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  type: "",
});

// Compute selected department admin from store
const selectedDepartmentAdmin = computed(
  () => adminDepartmentStore.viewSelectedDepartmentAdmin
);

// Local form data
const form = ref({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  type: "",
});

// Fetch department admin on mount
onMounted(() => {
  adminDepartmentStore.fetchDepartmentAdmin(departmentAdminId);
});

// Auto-populate form when selected department admin changes
watch(selectedDepartmentAdmin, (departmentAdmin) => {
  if (departmentAdmin) {
    form.value = {
      name: departmentAdmin.name,
      email: departmentAdmin.email,
      oldPassword: "",
      newPassword: "",
      type: departmentAdmin.type,
    };
  }
});

// ✅ Update department admin function
const updateDepartmentAdmin = async () => {
  validationErrors.value = {
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    type: "",
  };

  // Validation
  if (!form.value.name.trim())
    validationErrors.value.name = "Name is required.";
  if (!form.value.email.trim())
    validationErrors.value.email = "Email is required.";
  if (!form.value.type.trim())
    validationErrors.value.type = "Role selection is required.";

  // Require old password if new password is entered
  if (form.value.newPassword?.trim()) {
    if (!form.value.oldPassword?.trim()) {
      validationErrors.value.oldPassword = "Old password is required.";
    } else if (form.value.newPassword.trim().length < 6) {
      validationErrors.value.newPassword =
        "New password must be at least 6 characters.";
    }
  }

  if (Object.values(validationErrors.value).some((error) => error)) return;

  // Prepare update payload
  const updatedData = {
    name: form.value.name,
    email: form.value.email,
    oldPassword: form.value.oldPassword || undefined,
    newPassword: form.value.newPassword || undefined,
    type: form.value.type,
  };

  const result = await adminDepartmentStore.updateDepartmentAdmin(
    departmentAdminId,
    updatedData
  );

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Department admin profile updated successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push({ name: "Department-Admin" });
  } else {
    swal.fire({
      position: "top-end",
      icon: "error",
      title: "Oops...",
      text: result.message || "Failed to update department admin.", // ✅ Now showing API error message
    });
  }
};
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">
        Edit Department Admin
      </h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="adminDepartmentStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>

    <!-- Show error messages -->
    <p
      v-else-if="adminDepartmentStore.error"
      class="text-3xl pt-6 text-red-700"
    >
      {{ adminDepartmentStore.error }}
    </p>

    <!-- Show department admin details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>

      <form @submit.prevent="updateDepartmentAdmin">
        <!-- Name -->
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="form.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
        />
        <p v-if="validationErrors.name" class="text-red-500 text-xs">
          {{ validationErrors.name }}
        </p>

        <!-- Email -->
        <div class="label pt-2">
          <span class="label-text">Email</span>
        </div>
        <input
          v-model="form.email"
          type="email"
          placeholder="sample@email.com"
          class="input input-bordered w-full"
        />
        <p v-if="validationErrors.email" class="text-red-500 text-xs">
          {{ validationErrors.email }}
        </p>

        <!-- Old Password -->
        <div class="label pt-2">
          <span class="label-text">Old Password</span>
        </div>
        <input
          v-model="form.oldPassword"
          type="password"
          placeholder="Enter old password"
          class="input input-bordered w-full"
        />
        <p v-if="validationErrors.oldPassword" class="text-red-500 text-xs">
          {{ validationErrors.oldPassword }}
        </p>

        <!-- New Password -->
        <div class="label pt-2">
          <span class="label-text">New Password</span>
        </div>
        <input
          v-model="form.newPassword"
          type="password"
          placeholder="Enter new password"
          class="input input-bordered w-full"
        />
        <p v-if="validationErrors.newPassword" class="text-red-500 text-xs">
          {{ validationErrors.newPassword }}
        </p>

        <!-- Account Type -->
        <div class="label pt-2">
          <span class="label-text">Account Type</span>
        </div>
        <select v-model="form.type" class="select select-bordered w-full mb-2">
          <option disabled value="">Select a account type</option>
          <option>CS Department</option>
          <option>Engr Department</option>
          <option>IT Department</option>
        </select>
        <p v-if="validationErrors.type" class="text-red-500 text-xs">
          {{ validationErrors.type }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <RouterLink
            :to="{ name: 'Department-Admin' }"
            class="btn bg-neutral text-white"
          >
            Go back
          </RouterLink>
          <button type="submit" class="btn bg-success text-white">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
