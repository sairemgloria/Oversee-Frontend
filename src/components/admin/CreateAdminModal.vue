<script setup>
import { reactive, inject, defineEmits } from "vue";
import axios from "axios";

defineOptions({
  inheritAttrs: false,
});

const swal = inject("$swal"); // Define for Sweetalert2
const emit = defineEmits(["adminAdded"]); // Define the event emitter

const admins = reactive({
  name: "",
  email: "",
  password: "",
  type: "",
});

const validationErrors = reactive({
  name: "",
  email: "",
  password: "",
  type: "",
});

const openModal = () => {
  for (let key in validationErrors) {
    validationErrors[key] = "";
  }
  document.getElementById("my_modal_1").showModal();
};

const closeModal = () => {
  document.getElementById("my_modal_1").close();
};

const createAdmin = async () => {
  // Clear previous validation errors
  for (let key in validationErrors) {
    validationErrors[key] = "";
  }

  // Validate fields
  if (!admins.name.trim()) validationErrors.name = "Name is required.";
  if (!admins.email.trim()) validationErrors.email = "Email is required.";
  if (!admins.password.trim())
    validationErrors.password = "Password is required.";
  if (!admins.type.trim())
    validationErrors.type = "Role selection is required.";

  // Stop if there are validation errors
  for (let key in validationErrors) {
    if (validationErrors[key]) return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/admins/", {
      name: admins.name,
      email: admins.email,
      password: admins.password,
      type: admins.type,
    });

    // Check the response status and handle accordingly
    if (response.status === 201 && response.data.success) {
      swal.fire({
        position: "top-end",
        icon: "success",
        title: "Admin registered successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Close the modal and reset the form
      closeModal();
      for (let key in admins) {
        admins[key] = "";
      }

      // Emit the new admin data
      emit("adminAdded", response.data.data);
    } else {
      swal.fire({
        position: "top-end",
        icon: "error",
        title: "Oops...",
        text: response.data.message || "An error occurred.",
      });
    }
  } catch (error) {
    console.error("API Error:", error.response?.data); // Log the response to debug
    let errorMessage = "Something went wrong!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    swal.fire({
      position: "top-end",
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });

    closeModal();
  }
};
</script>

<template>
  <!-- Open Modal Button -->
  <button class="btn btn-success text-white" @click="openModal">
    <i class="bx bx-plus bx-sm" />
    Create Admin
  </button>

  <!-- Modal -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create Admin</h3>
      <form @submit.prevent="createAdmin" class="p-2">
        <!-- Name -->
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          v-model="admins.name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full mb-1"
        />
        <p v-if="validationErrors.name" class="text-red-500 text-sm">
          {{ validationErrors.name }}
        </p>

        <!-- Email -->
        <div class="label pt-2">
          <span class="label-text">Email</span>
        </div>
        <input
          v-model="admins.email"
          type="email"
          placeholder="sample@email.com"
          class="input input-bordered w-full mb-1"
        />
        <p v-if="validationErrors.email" class="text-red-500 text-sm">
          {{ validationErrors.email }}
        </p>

        <!-- Password -->
        <div class="label pt-2">
          <span class="label-text">Password</span>
        </div>
        <input
          v-model="admins.password"
          type="password"
          placeholder="********"
          class="input input-bordered w-full mb-1"
        />
        <p v-if="validationErrors.password" class="text-red-500 text-sm">
          {{ validationErrors.password }}
        </p>

        <!-- Select Role -->
        <div class="label pt-2">
          <span class="label-text">Select Role</span>
        </div>
        <select
          v-model="admins.type"
          class="select select-bordered w-full mb-1"
        >
          <option disabled value="">Select a role</option>
          <option>Superadmin</option>
          <option>IT Department</option>
        </select>
        <p v-if="validationErrors.type" class="text-red-500 text-sm">
          {{ validationErrors.type }}
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
