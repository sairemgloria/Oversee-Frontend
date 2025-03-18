import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAdminDepartmentStore = defineStore(
  "adminDepartmentStore",
  () => {
    const loading = ref(false); // set loading to false
    const error = ref(null); // set error to null
    const departmentAdmins = ref([]); // store all department admins
    const viewSelectedDepartmentAdmin = ref(null);

    /* Function to get all department admins */
    const fetchDepartmentAdmins = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axios.get(`${API_BASE_URL}/departmentAdmins/`);
        if (response.data.success) {
          departmentAdmins.value = response.data.data;
        } else {
          error.value = response.data.message;
        }
      } catch (err) {
        error.value =
          err.response?.data?.message ||
          "Error: Failed to load department admins.";
      } finally {
        loading.value = false;
      }
    };

    /* Function to get selected department admin */
    const fetchDepartmentAdmin = async (departmentAdminId) => {
      loading.value = true;
      error.value = null;
      viewSelectedDepartmentAdmin.value = null; // Ensure previous data is cleared

      // Frontend validation: Check if the ID is valid before making an API call
      if (!departmentAdminId.match(/^[0-9a-fA-F]{24}$/)) {
        error.value = "Invalid Department Admin ID.";
        loading.value = false;
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/departmentAdmins/${departmentAdminId}`
        );
        if (response.data.success) {
          viewSelectedDepartmentAdmin.value = response.data.data;
        } else {
          error.value = response.data.message || "Department Admin not found";
        }
      } catch (err) {
        console.error(`Error: ${err}`);
        error.value =
          err.response?.data?.message ||
          "Failed to load department admin details.";
      } finally {
        loading.value = false;
      }
    };

    const adminDepartmentForm = ref({
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
      Object.assign(adminDepartmentForm.value, {
        name: "",
        email: "",
        password: "",
        type: "",
      });
    };

    const validateForm = () => {
      clearValidationErrors();
      let isValid = true;
      let missingFields = [];

      if (!adminDepartmentForm.value.name.trim()) {
        validationErrors.value.name = "Name is required.";
        missingFields.push("Name");
        isValid = false;
      }

      if (!adminDepartmentForm.value.email.trim()) {
        validationErrors.value.email = "Email is required.";
        missingFields.push("Email");
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(adminDepartmentForm.value.email.trim())) {
          validationErrors.value.email = "Invalid email format.";
          isValid = false;
        }
      }

      if (!adminDepartmentForm.value.password.trim()) {
        validationErrors.value.password = "Password is required.";
        missingFields.push("Password");
        isValid = false;
      }

      if (!adminDepartmentForm.value.type.trim()) {
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
          : validationErrors.value.email || "", // Include invalid email message
      };
    };

    /* Function to create department admin */
    const createDepartmentAdmin = async () => {
      const validation = validateForm();
      if (!validation.isValid) {
        return { success: false, message: validation.message }; // Short message like "Name, Email is required."
      }
      try {
        const response = await axios.post(
          `${API_BASE_URL}/departmentAdmins/`,
          adminDepartmentForm.value
        );
        if (response.status === 201 && response.data.success) {
          resetForm();
          await fetchDepartmentAdmins();
          return {
            success: true,
            data: response.data.data,
          };
        } else {
          return {
            success: false,
            message:
              response.data.message ||
              "Error: Failed to create department admin. Please try again.",
          };
        }
      } catch (error) {
        console.error("API Error:", error.response?.data);
        return {
          success: false,
          message:
            error.response?.data?.message || "Error: API request failed.",
        };
      } finally {
        loading.value = false;
      }
    };

    /* Function to update selected department admin */
    const updateDepartmentAdmin = async (departmentAdminId, updatedData) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/departmentAdmins/${departmentAdminId}`,
          updatedData
        );

        if (response.status === 200 && response.data.success) {
          await fetchDepartmentAdmin(departmentAdminId);
          return { success: true }; // ✅ Return an object instead of just `true`
        } else {
          return {
            success: false,
            message: response.data.message || "Unknown error",
          };
        }
      } catch (err) {
        console.error(
          "Error updating admin:",
          err.response?.data || err.message
        );
        return {
          success: false,
          message: err.response?.data?.message || "Failed to update admin.",
        };
      }
    };

    /* Function to delete selected department admin */
    const deleteDepartmentAdmin = async (departmentAdminId) => {
      try {
        await axios.delete(
          `${API_BASE_URL}/departmentAdmins/${departmentAdminId}`
        );

        // ✅ Instantly update the UI by removing the deleted department admin
        departmentAdmins.value = departmentAdmins.value.filter(
          (departmentAdmin) => departmentAdmin._id !== departmentAdminId
        );

        // ✅ Fetch fresh data from the backend to ensure pagination updates correctly
        await fetchDepartmentAdmins();
      } catch (err) {
        error.value =
          err.response?.data?.message || "Error: Failed to delete admin.";
        console.error(
          "Error deleting admin:",
          err.response?.data || err.message
        );
      }
    };

    return {
      loading,
      error,
      departmentAdmins,
      viewSelectedDepartmentAdmin,
      fetchDepartmentAdmins,
      fetchDepartmentAdmin,
      createDepartmentAdmin,
      updateDepartmentAdmin,
      deleteDepartmentAdmin,
      adminDepartmentForm,
      validationErrors,
      clearValidationErrors,
    };
  }
);
