import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/admin/axiosInstance"; // Use the centralized API instance

export const useCardsStore = defineStore("cardsStore", () => {
  const loading = ref(false);
  const error = ref(null);
  const departmentsCount = ref(null);
  const rolesCount = ref(null);
  const deptAdminCount = ref(null);

  /* Function: Count all departments */
  const countDepartments = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/departments/count`);
      console.log("Full Response:", response); // Log the entire response

      if (response.data.success) {
        console.log("Departments Count:", response.data.count);
        departmentsCount.value = response.data.count;
      } else {
        error.value = response.data.message || "Invalid response format.";
      }
    } catch (err) {
      console.error("Count Departments Error:", err);
      error.value =
        err.response?.data?.message || "Failed to count departments.";
    } finally {
      loading.value = false;
    }
  };

  /* Function: Count all roles */
  const countRoles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/roles/count");
      console.log("Full Response:", response); // Log the entire response

      if (response.data.success) {
        console.log("Roles Count:", response.data.count);
        rolesCount.value = response.data.count;
      } else {
        error.value = response.data.message || "Invalid response format.";
      }
    } catch (err) {
      console.error("Count Roles Error:", err);
      error.value = err.response?.data?.message || "Failed to count roles.";
    } finally {
      loading.value = false;
    }
  };

  /* Function: Count all department admins */
  const countDeptAdmin = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/department-admins/count");
      console.log("Dept Admins Count Response:", response.data); // Debugging log

      if (response.data.success && typeof response.data.count === "number") {
        deptAdminCount.value = response.data.count;
      } else {
        error.value = response.data.message || "Invalid response format.";
      }
    } catch (err) {
      console.error("Count Dept Admin Error:", err);
      error.value =
        err.response?.data?.message ||
        "Error: Failed to count department admins.";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    departmentsCount,
    rolesCount,
    deptAdminCount,
    countDepartments,
    countRoles,
    countDeptAdmin,
  };
});
