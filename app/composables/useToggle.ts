import { ref } from "vue";

export function useToggle(initialValue: boolean = false) {
  const isOpen = ref<boolean>(initialValue);

  function toggle(): void {
    isOpen.value = !isOpen.value;
  }

  function open(): void {
    isOpen.value = true;
  }

  function close(): void {
    isOpen.value = false;
  }

  return { isOpen, toggle, open, close };
}
