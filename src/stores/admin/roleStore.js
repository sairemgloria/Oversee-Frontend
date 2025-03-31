import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/admin/axiosInstance"; // Use the centralized API instance

export const useRoleStore = defineStore("roleStore", () => {
  const loading = ref(false);
  const error = ref(null);
  const roles = ref([]);
  const viewSelectedRole = ref(null);

  /* Function to get all roles */
  const fetchRoles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/roles`);
      if (response.data.success) {
        roles.value = response.data.data;
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to load roles.";
    } finally {
      loading.value = false;
    }
  };

  /* Function to get selected role */
  const fetchRole = async (roleId) => {
    loading.value = true;
    error.value = null;
    viewSelectedRole.value = null; // Ensure previous data is cleared

    /* Validate ID format before making an API call */
    if (!/^[0-9a-fA-F]{24}$/.test(roleId)) {
      error.value = "Invalid Role ID.";
      loading.value = false;
      return;
    }

    try {
      const response = await api.get(`/roles/${roleId}`);
      if (response.data.success) {
        viewSelectedRole.value = response.data.data;
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to load selected role.";
    } finally {
      loading.value = false;
    }
  };

  const roleForm = ref({
    name: "",
    codeId: "",
    departmentDesignation: "",
  });

  const validationErrors = ref({
    name: "",
    codeId: "",
    departmentDesignation: "",
  });

  const clearValidationErrors = () => {
    Object.keys(validationErrors.value).forEach((key) => {
      validationErrors.value[key] = "";
    });
  };

  const resetForm = () => {
    roleForm.value = {
      name: "",
      codeId: "",
      departmentDesignation: "",
    };
  };

  const validateForm = () => {
    clearValidationErrors();
    let isValid = true;
    let missingFields = [];

    if (!roleForm.value.name.trim()) {
      validationErrors.value.name = "Name is required.";
      missingFields.push("Name");
      isValid = false;
    }

    if (!roleForm.value.codeId.trim()) {
      validationErrors.value.codeId = "Role Code is required.";
      missingFields.push("Role Code");
      isValid = false;
    }

    if (!roleForm.value.departmentDesignation.trim()) {
      validationErrors.value.departmentDesignation =
        "Department Designation is required.";
      missingFields.push("Department Designation");
      isValid = false;
    }

    return {
      isValid,
      message: missingFields.length
        ? `${missingFields.join(", ")} ${
            missingFields.length > 1 ? "are" : "is"
          } required.`
        : "",
    };
  };

  /* Function to create new role */
  const createRole = async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    try {
      const response = await api.post(`/roles/`, roleForm.value);

      if (response.status === 201 && response.data.success) {
        resetForm();
        await fetchRoles();
        return { success: true, data: response.data.data };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Failed to create role. Please try again.",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: response.data.message || "A network or server error occurred.",
      };
    } finally {
      loading.value = false;
    }
  };

  /* Function to update selected role */
  const updateRole = async (roleId, updatedData) => {
    try {
      const response = await api.put(`/roles/${roleId}`, updatedData);

      if (response.status === 200 && response.data.success) {
        await fetchRole(roleId);
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
        message: err.response?.data?.message || "Failed to update role.",
      };
    }
  };

  /* Function to delete role */
  const deleteRole = async (roleId) => {
    try {
      await api.delete(`/roles/${roleId}`);

      // Update UI instantly
      roles.value = roles.value.filter((role) => role._id !== roleId);

      // Fetch fresh data for pagination updates
      await fetchRoles();
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to delete role.";
    }
  };

  return {
    loading,
    error,
    roles,
    viewSelectedRole,
    fetchRoles,
    fetchRole,
    roleForm,
    validationErrors,
    clearValidationErrors,
    resetForm,
    createRole,
    updateRole,
    deleteRole,
  };
});
