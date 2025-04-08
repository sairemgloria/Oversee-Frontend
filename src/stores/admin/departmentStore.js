import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/admin/axiosInstance"; // Use the centralized API instance

export const useDepartmentStore = defineStore("departmentStore", () => {
  const loading = ref(false);
  const error = ref(null);
  const departments = ref([]);
  const viewSelectedDepartment = ref(null);

  /* Function to get all departments */
  const fetchDepartments = async () => {
    loading.error = true;
    error.value = null;

    try {
      const response = await api.get(`/departments`);
      if (response.data.success) {
        departments.value = response.data.data;
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to load departments.";
    } finally {
      loading.value = false;
    }
  };

  /* Function to get selected department */
  const fetchDepartment = async (departmentId) => {
    loading.value = true;
    error.value = null;
    viewSelectedDepartment.value = null; // Ensure previous data is cleared

    /* Validate ID format before making an API call */
    if (!/^[0-9a-fA-F]{24}$/.test(departmentId)) {
      error.value = "Invalid Department ID.";
      loading.value = false;
      return;
    }

    try {
      const response = await api.get(`/departments/${departmentId}`);
      if (response.data.success) {
        viewSelectedDepartment.value = response.data.data;
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        "Error: Failed to load selected department.";
    } finally {
      loading.value = false;
    }
  };

  const departmentForm = ref({
    name: "",
    codeId: "",
    timeIn: "",
    timeOut: "",
    overtime: "",
  });

  const validationErrors = ref({
    name: "",
    codeId: "",
    timeIn: "",
    timeOut: "",
    overtime: "",
  });

  const clearValidationErrors = () => {
    validationErrors.value = {
      name: "",
      codeId: "",
      timeIn: "",
      timeOut: "",
      overtime: "",
    };
  };

  const resetForm = () => {
    departmentForm.value = {
      name: "",
      codeId: "",
      timeIn: "",
      timeOut: "",
      overtime: "",
    };
  };

  const validateForm = () => {
    clearValidationErrors();
    let isValid = true;
    let missingFields = [];

    if (!departmentForm.value.name.trim()) {
      validationErrors.value.name = "Department name is required.";
      missingFields.push("Department name");
      isValid = false;
    }
    if (!departmentForm.value.codeId.trim()) {
      validationErrors.value.codeId = "Code ID is required.";
      missingFields.push("Department Code ID");
      isValid = false;
    }
    if (!departmentForm.value.timeIn.trim()) {
      validationErrors.value.timeIn = "Time In is required.";
      missingFields.push("Time In");
      isValid = false;
    }
    if (!departmentForm.value.timeOut.trim()) {
      validationErrors.value.timeOut = "Time Out is required.";
      missingFields.push("Time Out");
      isValid = false;
    }
    if (!departmentForm.value.overtime.trim()) {
      validationErrors.value.overtime = "Overtime is required.";
      missingFields.push("Over Time");
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

  /* Function to create new department */
  const createDepartment = async () => {
    loading.value = true;
    error.value = null;

    const { isValid, message } = validateForm();
    if (!isValid) {
      error.value = message;
      loading.value = false;
      return;
    }

    try {
      const response = await api.post("/departments", departmentForm.value);
      if (response.status === 201 && response.data.success) {
        departments.value.push(response.data.data);
        resetForm(); // Reset the form after successful creation
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to create department.";
    } finally {
      loading.value = false;
    }
  };

  /* Function to update selected department */
  const updateDepartment = async (deptId, updatedData) => {
    const validation = validateForm();

    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    try {
      const response = await api.put(`/departments/${deptId}`, updatedData);
      if (response.status === 200 && response.data.success) {
        await fetchDepartment(deptId);
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
        message: err.response?.data?.message || "Failed to update department",
      };
    }
  };

  const deleteDepartment = async (deptId) => {
    try {
      await api.delete(`/departments/${deptId}`);

      departments.value = departments.value.filter(
        (department) => department._id !== deptId
      );

      await fetchDepartments();
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete department",
      };
    }
  };

  return {
    loading,
    error,
    departments,
    viewSelectedDepartment,
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    departmentForm,
    validationErrors,
    clearValidationErrors,
    resetForm,
  };
});
