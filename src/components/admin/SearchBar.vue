<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["modelValue"]); // Accepts v-model value
const emit = defineEmits(["update:modelValue"]); // Emits updates
</script>

<template>
  <label class="input flex items-center border p-2 w-full md:w-auto rounded-md">
    <svg
      class="h-[1em] opacity-50 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="2.5"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </g>
    </svg>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      type="search"
      required
      placeholder="Search here"
      class="grow outline-none bg-transparent"
    />
  </label>
</template>
