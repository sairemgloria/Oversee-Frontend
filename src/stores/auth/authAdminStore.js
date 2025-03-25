import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthAdminStore = defineStore("authAdminStore", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);

  // Save token to Pinia and localStorage
  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  // Remove token from Pinia and localStorage (logout)
  const removeToken = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  // Fetch logged-in user info
  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/admins/`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      user.value = response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      removeToken(); // If the token is invalid, log out the user
    }
  };

  return { token, user, setToken, removeToken, fetchUser };
});
