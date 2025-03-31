<script setup>
import { inject, defineEmits } from "vue";
import { useDepartmentStore } from "@/stores/admin/departmentStore";

const swal = inject("$swal");
const emit = defineEmits(["departmentAdded"]);
const departmentStore = useDepartmentStore();

const openModal = () => {
  departmentStore.clearValidationErrors();
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};
</script>

<template>
  <button class="btn btn-success text-white" @click="openModal">
    <i class="bx bx-plus bx-sm" />
    Create Department
  </button>
</template>