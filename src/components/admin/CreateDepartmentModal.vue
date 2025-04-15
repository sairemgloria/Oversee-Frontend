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

const handleCreateDepartment = async () => {
  const result = await departmentStore.createDepartment();

  if (result.success) {
    swal.fire({
      position: "top-end",
      icon: "success",
      title: "Department registered successfully!",
      showConfirmButton: false,
      timer: 1500,
    });

    emit("departmentAdded", result.data);
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
      Create Department
    </button>

    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create Department</h3>
        <form @submit.prevent="handleCreateDepartment" class="p-2">
          <div class="label">
            <span class="label-text">Name</span>
          </div>
          <input v-model="departmentStore.departmentForm.name" type="text" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="departmentStore.validationErrors.name" class="text-red-500 text-xs">
            {{ departmentStore.validationErrors.name }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Code ID</span>
          </div>
          <input v-model="departmentStore.departmentForm.codeId" type="text" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="departmentStore.validationErrors.codeId" class="text-red-500 text-xs">
            {{ departmentStore.validationErrors.codeId }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Time In</span>
          </div>
          <input v-model="departmentStore.departmentForm.timeIn" type="time" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="departmentStore.validationErrors.timeIn" class="text-red-500 text-xs">
            {{ departmentStore.validationErrors.timeIn }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Time Out</span>
          </div>
          <input v-model="departmentStore.departmentForm.timeOut" type="time" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="departmentStore.validationErrors.timeOut" class="text-red-500 text-xs">
            {{ departmentStore.validationErrors.timeOut }}
          </p>

          <div class="label pt-2">
            <span class="label-text">Overtime</span>
          </div>
          <input v-model="departmentStore.departmentForm.overtime" type="time" placeholder="Type here"
            class="input input-bordered w-full mb-1" />
          <p v-if="departmentStore.validationErrors.overtime" class="text-red-500 text-xs">
            {{ departmentStore.validationErrors.overtime }}
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