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
    let missingFields = [];

    if (!adminForm.value.name.trim()) {
      validationErrors.value.name = "Name is required.";
      missingFields.push("Name");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!adminForm.value.email.trim()) {
      validationErrors.value.email = "Email is required.";
      missingFields.push("Email");
      isValid = false;
    } else if (!emailRegex.test(adminForm.value.email.trim())) {
      validationErrors.value.email = "Invalid email format.";
      return { isValid: false, message: "Invalid email format." };
    }

    if (!adminForm.value.password.trim()) {
      validationErrors.value.password = "Password is required.";
      missingFields.push("Password");
      isValid = false;
    }

    if (!adminForm.value.type.trim()) {
      validationErrors.value.type = "Role selection is required.";
      missingFields.push("Role");
      isValid = false;
    }

    return {
      isValid,
      message: missingFields.length
        ? `${missingFields.join(", ")} is required.`
        : "",
    };
  };

  const createAdmin = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      return { success: false, message: validation.message }; // Short message like "Name, Email is required."
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/`,
        adminForm.value
      );

      if (response.status === 201 && response.data.success) {
        resetForm();
        await fetchAdmins();
        return { success: true, data: response.data.data };
      } else {
        return {
          success: false,
          message:
            response.data.message ||
            "Failed to create admin. Please try again.",
        };
      }
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "A network or server error occurred.",
      };
    } finally {
      loading.value = false;
    }
  };

  /* Function update selected admin */
  const updateAdmin = async (adminId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admins/${adminId}`,
        updatedData
      );

      if (response.status === 200 && response.data.success) {
        await fetchAdmin(adminId); // Refresh data
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Error updating admin:", err.response?.data || err.message);
      return false;
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      await axios.delete(`${API_BASE_URL}/admins/${adminId}`);

      // ✅ Instantly update the UI by removing the deleted admin
      admins.value = admins.value.filter((admin) => admin._id !== adminId);

      // ✅ Fetch fresh data from the backend to ensure pagination updates correctly
      await fetchAdmins();
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to delete admin.";
      console.error("Error deleting admin:", err.response?.data || err.message);
    }
  };

  return {
    loading,
    error,
    admins,
    viewSelectedAdmin,
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
