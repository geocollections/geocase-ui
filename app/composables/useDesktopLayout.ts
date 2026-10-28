import { onBeforeUnmount, onMounted, ref } from "vue";

export function useDesktopLayout() {
  const isDesktop = ref(false);
  let query: MediaQueryList | undefined;
  const update = () => {
    isDesktop.value = query?.matches ?? false;
  };
  onMounted(() => {
    query = window.matchMedia("(min-width: 960px)");
    update();
    query.addEventListener("change", update);
  });
  onBeforeUnmount(() => query?.removeEventListener("change", update));
  return { isDesktop };
}
