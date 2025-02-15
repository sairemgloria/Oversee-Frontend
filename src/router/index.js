import { createRouter, createWebHistory } from "vue-router";

const routes = [
  /* Admin Routes */
  {
    path: "/dashboard",
    name: "AdminDashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
  },
  {
    path: "/employees",
    name: "Employees",
    component: () => import("@/views/admin/EmployeesView.vue"),
  },
  {
    path: "/superadmin",
    name: "Superadmin",
    component: () => import("@/views/admin/SuperAdminView.vue"),
  },

  /* 404 - Page Not Found */
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/404NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
