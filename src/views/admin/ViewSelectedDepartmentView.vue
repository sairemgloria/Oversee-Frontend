<script setup>
import { ref, inject, onMounted, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useDepartmentStore } from "@/stores/admin/departmentStore";
import Breadcrumb from "@/components/admin/Breadcrumb.vue";
</script>

<template>
  <div class="p-6">
    <div class="mb-4">
      <h1 class="text-3xl font-bold flex items-center">View Department</h1>
    </div>

    <Breadcrumb />
    <hr class="mt-6" />
  </div>
</template>