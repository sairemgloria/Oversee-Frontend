import Swal from "sweetalert2";

export default {
  install: (app) => {
    app.provide("$swal", Swal); // Use provide() instead of config.globalProperties
    app.config.globalProperties.$swal = Swal; // Keep this for Options API
  },
};
