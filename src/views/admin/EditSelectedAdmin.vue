<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAdminStore } from "@/stores/admin/adminStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const swal = inject("$swal"); // Sweetalert2

// Get the admin ID from the URL parameters
const route = useRoute();
const router = useRouter();
const adminId = route.params.id;
const store = useAdminStore();

const validationErrors = ref({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  type: "",
});

// Computed property to bind store data
const admin = computed(() => store.viewSelectedAdmin || {});

// Fetch admin data on mount using Pinia
onMounted(() => store.fetchAdmin(adminId));

// ✅ Function to update admin using Pinia
const updateAdmin = async () => {
  validationErrors.value = {
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    type: "",
  };

  // Validate fields
  if (!admin.value.name?.trim())
    validationErrors.value.name = "Name is required.";
  if (!admin.value.email?.trim())
    validationErrors.value.email = "Email is required.";
  if (!admin.value.type?.trim())
    validationErrors.value.type = "Role selection is required.";

  // ✅ Require Old Password if New Password is Entered
  if (admin.value.newPassword?.trim()) {
    if (!admin.value.oldPassword?.trim()) {
      validationErrors.value.oldPassword = "Old password is required.";
    } else if (admin.value.newPassword.trim().length < 6) {
      validationErrors.value.newPassword =
        "New password must be at least 6 characters.";
    }
  }

  // Stop if any validation error exists
  if (Object.values(validationErrors.value).some((error) => error)) return;

  // Prepare update payload
  const updatedData = {
    name: admin.value.name,
    email: admin.value.email,
    oldPassword: admin.value.oldPassword || undefined,
    newPassword: admin.value.newPassword || undefined,
    type: admin.value.type,
  };

  await store.updateAdmin(adminId, updatedData, swal);
};
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Edit Admin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <!-- Show loading state -->
    <p v-if="store.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>

    <!-- Show error messages -->
    <p v-else-if="store.error" class="text-3xl pt-6 text-red-700">
      {{ store.error }}
    </p>

    <!-- Show admin details if fetched successfully -->
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>

      <form @submit.prevent="updateAdmin">
        <!-- Name -->
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="admin.name"
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
          v-model="admin.email"
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
          v-model="admin.oldPassword"
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
          v-model="admin.newPassword"
          type="password"
          placeholder="Enter new password"
          class="input input-bordered w-full"
        />
        <p v-if="validationErrors.newPassword" class="text-red-500 text-xs">
          {{ validationErrors.newPassword }}
        </p>

        <!-- Select Role -->
        <div class="label pt-2">
          <span class="label-text">Select Role</span>
        </div>
        <select v-model="admin.type" class="select select-bordered w-full mb-2">
          <option disabled value="">Select a role</option>
          <option>Superadmin</option>
          <option>IT Department</option>
        </select>
        <p v-if="validationErrors.type" class="text-red-500 text-xs">
          {{ validationErrors.type }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <RouterLink
            :to="{ name: 'Superadmin' }"
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
