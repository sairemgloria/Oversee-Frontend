import { ref, computed } from "vue";

export default function usePagination(items, itemsPerPage = 5) {
  const currentPage = ref(1);

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(start, start + itemsPerPage);
  });

  const totalPages = computed(() =>
    Math.ceil(items.value.length / itemsPerPage)
  );

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  return { currentPage, paginatedItems, totalPages, nextPage, prevPage };
}
