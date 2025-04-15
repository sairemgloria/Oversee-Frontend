<script setup>
import { inject, defineEmits } from "vue";
import { useRoleStore } from "@/stores/admin/roleStore";

const swal = inject("$swal");
const emit = defineEmits(["roleAdded"]);
const roleStore = useRoleStore();

const openModal = () => {
  roleStore.resetForm();
  roleStore.clearValidationErrors();
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};

const handleCreateRole = async () => {
  const result = await roleStore.createRole();

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Role registered successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    emit("roleAdded", result.data);
    closeModal();
  } else {
    console.log(result.message);
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
  <div>
    <button class="btn btn-success text-white" @click="openModal">
      <i class="bx bx-plus bx-sm" />
      Create Role
    </button>

    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create Role</h3>
        <form @submit.prevent="handleCreateRole" class="p-2">
          <div class="label">
            <span class="label-text">Name</span>
          </div>
          <input v-model="roleStore.roleForm.name" type="text" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="roleStore.validationErrors.name" class="text-red-500 text-xs">
            {{ roleStore.validationErrors.name }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Code ID</span>
          </div>
          <input v-model="roleStore.roleForm.codeId" type="text" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="roleStore.validationErrors.codeId" class="text-red-500 text-xs">
            {{ roleStore.validationErrors.codeId }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Department Designation</span>
          </div>
          <select v-model="roleStore.roleForm.departmentDesignation" class="select select-bordered w-full mb-1">
            <option disabled value="">Select a designation</option>
            <option>Superadmin</option>
            <option>IT Department</option>
          </select>
          <p v-if="roleStore.validationErrors.departmentDesignation" class="text-red-500 text-xs">
            {{ roleStore.validationErrors.departmentDesignation }}
          </p>

          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" class="btn" @click="closeModal">Cancel</button>
            <button type="submit" class="btn bg-success text-white">
              Create
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>