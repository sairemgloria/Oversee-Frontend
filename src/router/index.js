import { createRouter, createWebHistory } from "vue-router";

const routes = [
  /* Admin Routes */
  /* Dashboard Section */
  {
    path: "/dashboard",
    name: "AdminDashboard",
    component: () => import("@/views/admin/DashboardView.vue"),
  },
  /* Employee Section */
  {
    path: "/employees",
    name: "Employees",
    component: () => import("@/views/admin/EmployeesView.vue"),
  },
  /* Administrator Section */
  {
    path: "/superadmin",
    name: "Superadmin",
    component: () => import("@/views/admin/SuperAdminView.vue"),
  },
  {
    path: "/view-admin/:id",
    name: "view-admin",
    component: () => import("@/views/admin/ViewSelectedAdmin.vue"),
  },
  {
    path: "/edit-admin/:id",
    name: "edit-admin",
    component: () => import("@/views/admin/EditSelectedAdmin.vue"),
  },
  {
    path: "/department-admin",
    name: "Department-Admin",
    component: () => import("@/views/admin/DepartmentAdminView.vue"),
  },
  {
    path: "/view-department-admin/:id",
    name: "view-department-admin",
    component: () => import("@/views/admin/ViewSelectedDepartmentAdmin.vue"),
  },
  {
    path: "/edit-department-admin/:id",
    name: "edit-department-admin",
    component: () => import("@/views/admin/EditSelectedDepartmentAdminView.vue"),
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
