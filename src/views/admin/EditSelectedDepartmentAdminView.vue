<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import axios from "axios";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const swal = inject("$swal"); // Sweetalert2

// Get the admin ID from the URL parameters
const route = useRoute();
const router = useRouter();
const deptAdminId = route.params.id;

// Reactive variables
const deptAdmin = ref({ name: "", email: "", type: "" }); // Password is excluded from fetching
const newPassword = ref(""); // Separate ref for new password input
const error = ref(null);
const loading = ref(true);
const validationErrors = ref({
  name: "",
  email: "",
  password: "",
  type: "",
});

// Function to fetch the admin data (excluding password)
const fetchDeptAdmin = async () => {
  loading.value = true;
  error.value = null;

  if (!deptAdminId.match(/^[0-9a-fA-F]{24}$/)) {
    error.value = "Invalid Department Admin ID.";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/departmentAdmins/${deptAdminId}`
    );

    if (response.data.success) {
      deptAdmin.value = {
        name: response.data.data.name,
        email: response.data.data.email,
        type: response.data.data.type,
      };
    } else {
      error.value = response.data.message || "Department admin not found.";
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to load department admin details.";
  } finally {
    loading.value = false;
  }
};

// Fetch department admin data on mount
onMounted(fetchDeptAdmin);

// ✅ Function to update admin data
const updateDeptAdmin = async () => {
  if (!deptAdmin.value) return;

  validationErrors.value = {
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    type: "",
  };

  // Validate fields
  if (!deptAdmin.value.name?.trim())
    validationErrors.value.name = "Name is required.";
  if (!deptAdmin.value.email?.trim())
    validationErrors.value.email = "Email is required.";
  if (!deptAdmin.value.type?.trim())
    validationErrors.value.type = "Account type selection is required.";

  // ✅ Require Old Password if New Password is Entered
  if (deptAdmin.value.newPassword?.trim()) {
    if (!deptAdmin.value.oldPassword?.trim()) {
      validationErrors.value.oldPassword = "Old password is required.";
    } else if (deptAdmin.value.newPassword.trim().length < 6) {
      validationErrors.value.newPassword =
        "New password must be at least 6 characters.";
    }
  }

  // Stop if any validation error exists
  if (Object.values(validationErrors.value).some((error) => error)) return;

  try {
    const response = await axios.put(
      `http://localhost:3000/api/departmentAdmins/${deptAdminId}`,
      {
        name: deptAdmin.value.name,
        email: deptAdmin.value.email,
        oldPassword: deptAdmin.value.oldPassword || undefined,
        newPassword: deptAdmin.value.newPassword || undefined,
        type: deptAdmin.value.type,
      }
    );

    if (response.status === 200 && response.data.success) {
      swal.fire({
        position: "top-end",
        icon: "success",
        title: "Department admin profile updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      await fetchDeptAdmin(); // Refresh data after update
    } else {
      swal.fire({
        position: "top-end",
        icon: "error",
        title: "Oops...",
        text: response.data.message || "An error occurred.",
      });
    }
  } catch (err) {
    let errorMessage = err.response?.data?.message || "Something went wrong!";
    swal.fire({
      position: "top-end",
      icon: "error",
      title: "Oops...",
      text: errorMessage,
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
    <p v-if="loading" class="text-3xl pt-6 text-gray-500">Fetching data...</p>

    <!-- Show error messages -->
    <p v-else-if="error" class="text-3xl pt-6 text-red-700">{{ error }}</p>

    <!-- Show department admin details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>

      <form @submit.prevent="updateDeptAdmin">
        <!-- Name -->
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="deptAdmin.name"
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
          v-model="deptAdmin.email"
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
          v-model="deptAdmin.oldPassword"
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
          v-model="deptAdmin.newPassword"
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
        <select
          v-model="deptAdmin.type"
          class="select select-bordered w-full mb-2"
        >
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
