import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const useAdminStore = defineStore("adminStore", () => {
  const loading = ref(false); // set loading to false
  const error = ref(null); // set error to null
  const admins = ref([]); // store all admins
  const viewSelectedAdmin = ref(null);

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

  /* Function to view selected admin */
  const fetchAdmin = async (adminId) => {
    loading.value = true;
    error.value = null;
    viewSelectedAdmin.value = null; // Ensure previous data is cleared

    // Frontend validation: Check if the ID is valid before making an API call
    if (!adminId.match(/^[0-9a-fA-F]{24}$/)) {
      error.value = "Invalid Admin ID.";
      loading.value = false;
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admins/${adminId}`);
      if (response.data.success) {
        viewSelectedAdmin.value = response.data.data;
      } else {
        error.value = response.data.message || "Admin not found";
      }
    } catch (err) {
      console.error(`Error: ${err}`);
      error.value =
        err.response?.data?.message || "Failed to load admin details.";
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

  const resetForm = () => {
    adminForm.value = { name: "", email: "", password: "", type: "" };
  };

  const validateForm = () => {
    clearValidationErrors();
    let isValid = true;

    if (!adminForm.value.name.trim()) {
      validationErrors.value.name = "Name is required.";
      isValid = false;
    }

    if (!adminForm.value.email.trim()) {
      validationErrors.value.email = "Email is required.";
      isValid = false;
    }

    if (!adminForm.value.password.trim()) {
      validationErrors.value.password = "Password is required.";
      isValid = false;
    }

    if (!adminForm.value.type.trim()) {
      validationErrors.value.type = "Role selection is required.";
      isValid = false;
    }

    return isValid;
  };

  const createAdmin = async (swal, closeModal, emit) => {
    if (!validateForm()) return;

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

        resetForm(); // call the resetForm function

        closeModal(); // close the modal

        emit("adminAdded", response.data.data);

        await fetchAdmins(); // Ensure fresh data is loaded
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
    }
  };

  /* Function update selected admin */
  const updateAdmin = async (id, updatedData, swal) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admins/${id}`,
        updatedData
      );
      if (response.status === 200 && response.data.success) {
        swal.fire({
          position: "top-end",
          icon: "success",
          title: "Admin profile updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        await fetchAdmin(id); // Refresh the updated admin data
      } else {
        swal.fire({
          position: "top-end",
          icon: "error",
          title: "Oops...",
          text: response.data.message || "An error occurred.",
        });
      }
    } catch (err) {
      console.error("Error updating admin:", err.response || err);
      swal.fire({
        position: "top-end",
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong!",
      });
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
    viewSelectedAdmin,
    loading,
    error,
    fetchAdmins,
    fetchAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    adminForm,
    validationErrors,
    clearValidationErrors,
  };
});
