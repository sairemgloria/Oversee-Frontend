import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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
        err.value =
          err.response?.data?.message ||
          "Error: Failed to load department admins.";
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
      adminDepartmentForm.value = {
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

      if (!adminDepartmentForm.value.name.trim()) {
        validationErrors.value.name = "Name is required.";
        missingFields.push("Name");
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!adminDepartmentForm.value.email.trim()) {
        validationErrors.value.email = "Email is required.";
        missingFields.push("Email");
        isValid = false;
      } else if (!emailRegex.test(adminDepartmentForm.value.email.trim())) {
        validationErrors.value.email = "Invalid email format.";
        return { isValid: false, message: "Invalid email format." };
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
          ? `${missingFields.join(", ")} is required.`
          : "",
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

    return {
      loading,
      error,
      departmentAdmins,
      viewSelectedDepartmentAdmin,
      fetchDepartmentAdmins,
      createDepartmentAdmin,
      adminDepartmentForm,
      validationErrors,
      clearValidationErrors,
    };
  }
);
