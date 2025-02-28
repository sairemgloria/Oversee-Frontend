import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const useAdminStore = defineStore("adminStore", () => {
  const admins = ref([]); // store all admins
  const loading = ref(false); // set loading to false
  const error = ref(null); // set error to null

  /* Function to get all admins */
  const fetchAdmins = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_BASE_URL}/admins/`);
      if (response.data.success) {
        admins.value = response.data.data;
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to load admins.";
    } finally {
      loading.value = false;
    }
  };

  const adminForm = ref({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  const validationErrors = ref({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  const clearValidationErrors = () => {
    Object.keys(validationErrors.value).forEach((key) => {
      validationErrors.value[key] = "";
    });
  };

  const createAdmin = async (swal, closeModal, emit) => {
    clearValidationErrors();

    if (!adminForm.value.name.trim())
      validationErrors.value.name = "Name is required.";
    if (!adminForm.value.email.trim())
      validationErrors.value.email = "Email is required.";
    if (!adminForm.value.password.trim())
      validationErrors.value.password = "Password is required.";
    if (!adminForm.value.type.trim())
      validationErrors.value.type = "Role selection is required.";

    if (Object.values(validationErrors.value).some((error) => error)) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/`,
        adminForm.value
      );

      if (response.status === 201 && response.data.success) {
        swal.fire({
          position: "top-end",
          icon: "success",
          title: "Admin registered successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        await closeModal();

        adminForm.value = { name: "", email: "", password: "", type: "" };

        emit("adminAdded", response.data.data);

        fetchAdmins(); // Refresh the list after adding
      } else {
        swal.fire({
          position: "top-end",
          icon: "error",
          title: "Oops...",
          text: response.data.message || "An error occurred.",
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data);
      swal.fire({
        position: "top-end",
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
      closeModal();
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/admins/${id}`);

      // ✅ Instantly update the UI by removing the deleted admin
      admins.value = admins.value.filter((admin) => admin._id !== id);

      // ✅ Fetch fresh data from the backend to ensure pagination updates correctly
      await fetchAdmins();
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to delete admin.";
      console.error("Error deleting admin:", err.response?.data || err.message);
    }
  };

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
    adminForm,
    validationErrors,
    clearValidationErrors,
  };
});
