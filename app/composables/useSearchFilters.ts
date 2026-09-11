import { computed, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import type { LocationQueryRaw } from "vue-router";
import { useSearchStore } from "@/stores/search";

type SearchField = {
  value: string | null;
  lookUpType: string;
  showCheckboxes?: boolean;
  showMore?: boolean;
};

export function useSearchFilters() {
  const store = useSearchStore();
  const route = useRoute();
  const router = useRouter();
  const fields = computed(() => store.search as Record<string, SearchField>);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  function cancelPending() {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  }
  onBeforeUnmount(cancelPending);
  watch(() => route.fullPath, cancelPending);
  watch(
    () => store.search,
    () => {
      const query: LocationQueryRaw = { ...route.query };
      for (const id of store.searchIds.filter((id) => id !== "map")) {
        for (const key of Object.keys(query))
          if (key.split("__")[0] === id) delete query[key];
        const field = fields.value[id];
        if (field?.value?.trim()) {
          const key = field.lookUpType
            ? `${id}__${field.lookUpType.replaceAll(" ", "_")}`
            : id;
          query[key] = field.value;
        }
      }
      if ("page" in query) query.page = String(store.page);
      if ("sort_by" in query && store.sortBy.length === 0) delete query.sort_by;
      if ("sort_desc" in query && store.sortDesc.length === 0)
        delete query.sort_desc;
      const same =
        Object.keys(query).length === Object.keys(route.query).length &&
        Object.entries(query).every(
          ([key, value]) =>
            JSON.stringify(value) === JSON.stringify(route.query[key]),
        );
      if (!same) router.push({ path: route.path, query, hash: route.hash });
    },
    { deep: true, flush: "post" },
  );
  function updateValue(id: string, value: string | null) {
    store.updateSearchField({ id, value: value || null });
    store.updatePage(1);
    if (id === "q") {
      store.updateSortBy([]);
      store.updateSortDesc([]);
    }
  }
  function updateText(id: string, value: string | number) {
    clearTimeout(timers.get(id));
    timers.set(
      id,
      setTimeout(() => {
        timers.delete(id);
        updateValue(id, String(value));
      }, 300),
    );
  }
  function clearField(id: string) {
    clearTimeout(timers.get(id));
    timers.delete(id);
    updateValue(id, null);
    if (id === "map") store.fetchResults();
  }
  function selectedValues(id: string): string[] {
    const value = fields.value[id]?.value?.replaceAll("&quot;", '"') ?? "";
    return Array.from(
      value.matchAll(/"([^"\n]*)"/g),
      (match) => match[1] ?? "",
    );
  }
  function isSelected(id: string, entity: string) {
    return selectedValues(id).includes(entity);
  }
  function toggleFacet(id: string, entity: string, selected: boolean) {
    const values = new Set(selectedValues(id));
    if (selected) values.add(entity);
    else values.delete(entity);
    updateValue(id, Array.from(values, (value) => `"${value}"`).join(" "));
  }
  function reset() {
    cancelPending();
    store.resetSearch();
  }
  return {
    store,
    fields,
    updateValue,
    updateText,
    clearField,
    isSelected,
    toggleFacet,
    reset,
  };
}
