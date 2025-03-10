<script setup>
import { inject, defineEmits } from "vue";
import { useAdminDepartmentStore } from "@/stores/admin/adminDepartmentStore";

const swal = inject("$swal");
const emit = defineEmits(["deptAdminAdded"]);
const adminDepartmentStore = useAdminDepartmentStore();

const openModal = () => {
  adminDepartmentStore.clearValidationErrors();
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};

const handleCreateDepartmentAdmin = async () => {
  const result = await adminDepartmentStore.createDepartmentAdmin();

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Department Admin registered successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    emit("deptAdminAdded", result.data);
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
  <!-- Open Modal Button -->
  <button class="btn btn-success text-white" @click="openModal">
    <i class="bx bx-plus bx-sm" />
    Create Department Admin
  </button>

  <!-- Modal -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create Department Admin</h3>
      <form @submit.prevent="handleCreateDepartmentAdmin" class="p-2">
        <!-- Name -->
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="adminDepartmentStore.adminDepartmentForm.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full mb-1"
        />
        <p
          v-if="adminDepartmentStore.validationErrors.name"
          class="text-red-500 text-xs"
        >
          {{ adminDepartmentStore.validationErrors.name }}
        </p>

        <!-- Email -->
        <div class="label pt-2">
          <span class="label-text">Email</span>
        </div>
        <input
          v-model="adminDepartmentStore.adminDepartmentForm.email"
          type="email"
          placeholder="sample@email.com"
          class="input input-bordered w-full mb-1"
        />
        <p
          v-if="adminDepartmentStore.validationErrors.email"
          class="text-red-500 text-xs"
        >
          {{ adminDepartmentStore.validationErrors.email }}
        </p>

        <!-- Password -->
        <div class="label pt-2">
          <span class="label-text">Password</span>
        </div>
        <input
          v-model="adminDepartmentStore.adminDepartmentForm.password"
          type="password"
          placeholder="********"
          class="input input-bordered w-full mb-1"
        />
        <p
          v-if="adminDepartmentStore.validationErrors.password"
          class="text-red-500 text-xs"
        >
          {{ adminDepartmentStore.validationErrors.password }}
        </p>

        <!-- Account Type -->
        <div class="label pt-2">
          <span class="label-text">Account Type</span>
        </div>
        <select
          v-model="adminDepartmentStore.adminDepartmentForm.type"
          class="select select-bordered w-full mb-1"
        >
          <option disabled value="">Select a account type</option>
          <option>CS Department</option>
          <option>Engr Department</option>
          <option>IT Department</option>
        </select>
        <p
          v-if="adminDepartmentStore.validationErrors.type"
          class="text-red-500 text-xs"
        >
          {{ adminDepartmentStore.validationErrors.type }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end space-x-2 mt-2">
          <button type="button" class="btn" @click="closeModal">Cancel</button>
          <button type="submit" class="btn bg-success text-white">
            Create
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>