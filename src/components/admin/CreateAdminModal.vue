<script setup>
import { inject, defineEmits } from "vue";
import { useAdminStore } from "@/stores/admin/adminStore";

const swal = inject("$swal");
const emit = defineEmits(["adminAdded"]);
const adminStore = useAdminStore();

const openModal = () => {
  adminStore.clearValidationErrors();
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};
</script>

<template>
  <button class="btn btn-success text-white" @click="openModal">
    <i class="bx bx-plus bx-sm" />
    Create Admin
  </button>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create Admin</h3>
      <form
        @submit.prevent="adminStore.createAdmin(swal, closeModal, emit)"
        class="p-2"
      >
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="adminStore.adminForm.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full mb-1"
        />
        <p v-if="adminStore.validationErrors.name" class="text-red-500 text-xs">
          {{ adminStore.validationErrors.name }}
        </p>

        <div class="label pt-2">
          <span class="label-text">Email</span>
        </div>
        <input
          v-model="adminStore.adminForm.email"
          type="email"
          placeholder="sample@email.com"
          class="input input-bordered w-full mb-1"
        />
        <p
          v-if="adminStore.validationErrors.email"
          class="text-red-500 text-xs"
        >
          {{ adminStore.validationErrors.email }}
        </p>

        <div class="label pt-2">
          <span class="label-text">Password</span>
        </div>
        <input
          v-model="adminStore.adminForm.password"
          type="password"
          placeholder="********"
          class="input input-bordered w-full mb-1"
        />
        <p
          v-if="adminStore.validationErrors.password"
          class="text-red-500 text-xs"
        >
          {{ adminStore.validationErrors.password }}
        </p>

        <div class="label pt-2">
          <span class="label-text">Select Role</span>
        </div>
        <select
          v-model="adminStore.adminForm.type"
          class="select select-bordered w-full mb-1"
        >
          <option disabled value="">Select a role</option>
          <option>Superadmin</option>
          <option>IT Department</option>
        </select>
        <p v-if="adminStore.validationErrors.type" class="text-red-500 text-xs">
          {{ adminStore.validationErrors.type }}
        </p>

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