<script setup>
import { inject, defineEmits } from "vue";
import { useRoleStore } from "@/stores/admin/roleStore";

const swal = inject("$swal");
const emit = defineEmits(["roleAdded"]);
const roleStore = useRoleStore();

const openModal = () => {
  roleStore.clearValidationErrors();
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};
</script>

<template>
  <button class="btn btn-success text-white" @click="openModal">
    <i class="bx bx-plus bx-sm" />
    Create Role
  </button>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create Role</h3>
    </div>
  </dialog>
</template>