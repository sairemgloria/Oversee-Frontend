<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useRoleStore } from "@/stores/admin/roleStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";

const swal = inject("$swal");
const route = useRoute();
const router = useRouter();
const roleStore = useRoleStore();

const roleId = route.params.id;

onMounted(async () => {
  if (roleId) {
    await roleStore.fetchRole(roleId);
    roleStore.roleForm = { ...roleStore.viewSelectedRole };
  }
});

const handleUpdateRole = async () => {
  const result = await roleStore.updateRole(roleId, roleStore.roleForm);

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Role updated successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push({ name: "Roles" }); // Redirect after success
  } else {
    swal.fire({
      position: "top-end",
      icon: "error",
      title: "Oops...",
      text: result.message || "Something went wrong.",
    });
  }
};
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">Edit Role</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />

    <p v-if="roleStore.loading" class="text-3xl pt-6 text-gray-500">
      Fetching data...
    </p>
    <p v-else-if="roleStore.error" class="text-3xl pt-6 text-red-700">
      {{ roleStore.error }}
    </p>
    <div v-else class="pt-6">
      <h1 class="text-3xl pb-2">Role Information</h1>

      <form @submit.prevent="handleUpdateRole">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="roleStore.roleForm.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
        />
        <p v-if="roleStore.validationErrors.name" class="text-red-500 text-xs">
          {{ roleStore.validationErrors.name }}
        </p>

        <div class="label pt-2">
          <span class="label-text">Code ID</span>
        </div>
        <input
          v-model="roleStore.roleForm.codeId"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
        />
        <p
          v-if="roleStore.validationErrors.codeId"
          class="text-red-500 text-xs"
        >
          {{ roleStore.validationErrors.codeId }}
        </p>

        <div class="label pt-2">
          <span class="label-text">Department Designation</span>
        </div>
        <select
          v-model="roleStore.roleForm.departmentDesignation"
          class="select select-bordered w-full mb-2"
        >
          <option disabled value="">Select department designation</option>
          <option value="Superadmin">Superadmin</option>
          <option value="IT Department">IT Department</option>
        </select>
        <p
          v-if="roleStore.validationErrors.departmentDesignation"
          class="text-red-500 text-xs"
        >
          {{ roleStore.validationErrors.departmentDesignation }}
        </p>

        <div class="flex justify-end space-x-2 mt-4">
          <RouterLink :to="{ name: 'Roles' }" class="btn bg-neutral text-white"
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