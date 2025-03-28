import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/admin/axiosInstance"; // Use the centralized API instance

export const useAdminStore = defineStore("adminStore", () => {
  const loading = ref(false);
  const error = ref(null);
  const admins = ref([]);
  const viewSelectedAdmin = ref(null);

  /* Function to get all admins */
  const fetchAdmins = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/admins/");
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

  /* Function to fetch a single admin */
  const fetchAdmin = async (adminId) => {
    loading.value = true;
    error.value = null;
    viewSelectedAdmin.value = null; // Ensure previous data is cleared

    // Validate ID format before making an API call
    if (!/^[0-9a-fA-F]{24}$/.test(adminId)) {
      error.value = "Invalid Admin ID.";
      loading.value = false;
      return;
    }

    try {
      const response = await api.get(`/admins/${adminId}`);
      if (response.data.success) {
        viewSelectedAdmin.value = response.data.data;
      } else {
        error.value = response.data.message || "Admin not found.";
      }
    } catch (err) {
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
    adminForm.value = {
      name: "",
      email: "",
      password: "",
      type: "",
    };
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

    if (!adminForm.value.email.trim()) {
      validationErrors.value.email = "Email is required.";
      missingFields.push("Email");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminForm.value.email.trim())) {
        validationErrors.value.email = "Invalid email format.";
        isValid = false;
      }
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
        ? `${missingFields.join(", ")} ${
            missingFields.length > 1 ? "are" : "is"
          } required.`
        : validationErrors.value.email || "",
    };
  };

  const createAdmin = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    try {
      const response = await api.post(`/admins/`, adminForm.value);
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
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message || "A network or server error occurred.",
      };
    } finally {
      loading.value = false;
    }
  };

  /* Function to update an admin */
  const updateAdmin = async (adminId, updatedData) => {
    try {
      const response = await api.put(`/admins/${adminId}`, updatedData);
      if (response.status === 200 && response.data.success) {
        await fetchAdmin(adminId);
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Unknown error occurred.",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update admin.",
      };
    }
  };

  /* Function to delete an admin */
  const deleteAdmin = async (adminId) => {
    try {
      await api.delete(`/admins/${adminId}`);

      // Update UI instantly
      admins.value = admins.value.filter((admin) => admin._id !== adminId);

      // Fetch fresh data for pagination updates
      await fetchAdmins();
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to delete admin.";
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
    resetForm,
  };
});
