import { ref, computed } from "vue";

export default function useFilter(items, searchFields) {
  const searchQuery = ref("");

  const filteredItems = computed(() => {
    if (!searchQuery.value) return items.value;

    return items.value.filter((item) =>
      searchFields.some((field) =>
        item[field].toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );
  });

  return { searchQuery, filteredItems };
}
