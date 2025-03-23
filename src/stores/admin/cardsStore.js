import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCardsStore = defineStore("cardsStore", () => {
  const loading = ref(false); // Set loading to false
  const error = ref(null); // Set error to null
  const rolesCount = ref(null); // Store roles count
  const deptAdminCount = ref(null); // Store department admin count

  /* Function: Count all roles */
  const countRoles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_BASE_URL}/roles/count`);
      if (response.data.success) {
        rolesCount.value = response.data.count; // Store count
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to count roles.";
    } finally {
      loading.value = false;
    }
  };

  /* Function: Count all department admins */
  const countDeptAdmin = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/departmentAdmins/count`);
  
      if (response.data.success) {
        deptAdminCount.value = response.data.count; // Ensure this contains the count
      } else {
        error.value = response.data.message;
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error: Failed to count department admins.";
    } finally {
      loading.value = false;
    }
  };
  

  return {
    loading,
    error,
    rolesCount,
    deptAdminCount,
    countRoles,
    countDeptAdmin,
  };
});
