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
    viewSelectedRole = null;

    /* Validate ID format before making an API call */
    if (!/^[0-9a-fA-F]{24}$/.test(roleId)) {
      error.value = "Invalid Role ID.";
      loading.value = false;
      return;
    }

    try {
      const response = await api.get(`/roles/${roleId}`);
      if (response.data.success) {
        viewSelectedRole.value = response.data.success;
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
  };
});
