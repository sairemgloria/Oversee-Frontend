import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/admin/axiosInstance"; // Use the centralized API instance

export const useDepartmentStore = defineStore("departmentStore", () => {
  const loading = ref(false);
  const error = ref(null);
  const departments = ref([]);
  const viewSelectedDepartment = ref(null);

  return {
    loading,
    error,
    departments,
    viewSelectedDepartment,
  };
});
