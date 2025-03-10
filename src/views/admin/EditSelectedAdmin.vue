<script setup>
import { ref, inject, onMounted, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAdminStore } from "@/stores/admin/adminStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const swal = inject("$swal");
const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const adminId = route.params.id;

// Form validation errors
const validationErrors = ref({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  type: "",
});

// Compute selected admin from store
const selectedAdmin = computed(() => adminStore.viewSelectedAdmin);

// Local form data
const form = ref({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  type: "",
});

// Fetch admin on mount
onMounted(() => {
  adminStore.fetchAdmin(adminId);
});

// Auto-populate form when selected admin changes
watch(selectedAdmin, (admin) => {
  if (admin) {
    form.value = {
      name: admin.name,
      email: admin.email,
      oldPassword: "",
      newPassword: "",
      type: admin.type,
    };
  }
});

// ✅ Update admin function
const updateAdmin = async () => {
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

  const result = await adminStore.updateAdmin(adminId, updatedData);

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Admin profile updated successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push({ name: "Superadmin" }); // Redirect after success
  } else {
    swal.fire({
      position: "top-end",
      icon: "error",
      title: "Oops...",
      text: result.message || "Failed to update admin.", // ✅ Now showing API error message
    });
  }
};
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Edit Admin</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <p v-if="adminStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>
    <p v-else-if="adminStore.error" class="text-3xl pt-6 text-red-700">
      {{ adminStore.error }}
    </p>

    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Profile Information</h1>

      <form @submit.prevent="updateAdmin">
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

        <div class="label pt-2">
          <span class="label-text">Select Role</span>
        </div>
        <select v-model="form.type" class="select select-bordered w-full mb-2">
          <option disabled value="">Select a role</option>
          <option>Superadmin</option>
          <option>IT Department</option>
        </select>
        <p v-if="validationErrors.type" class="text-red-500 text-xs">
          {{ validationErrors.type }}
        </p>

        <div class="flex justify-end space-x-2 mt-4">
          <RouterLink
            :to="{ name: 'Superadmin' }"
            class="btn bg-neutral text-white"
            >Go back</RouterLink
          >
          <button type="submit" class="btn bg-success text-white">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
