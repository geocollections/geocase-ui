<script setup lang="ts">
import { useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";
import { useAppNavigation } from "@/composables/useAppNavigation";

const props = defineProps<{
  text: string;
  count: string | number;
  id: number;
}>();

const router = useRouter();
const searchStore = useSearchStore();
const { localePath } = useAppNavigation();

async function viewInfo() {
  if (props.id === 2) {
    await router.push(localePath("/partners_and_providers"));
    return;
  }
  if (props.id === 3 && !searchStore.search.country.showCheckboxes) {
    searchStore.updateSearchField({ id: "country", showCheckboxes: true });
  }
  await router.push(localePath("/search"));
}
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    class="tw:text-home-ink tw:hover:bg-home-hover tw:focus-visible:outline-home-focus tw:flex tw:w-full tw:flex-col tw:items-center tw:gap-1 tw:rounded-2xl tw:px-5 tw:py-5 tw:focus-visible:outline-3 tw:focus-visible:-outline-offset-3 tw:max-[600px]:flex-row tw:max-[600px]:justify-between"
    @click="viewInfo"
  >
    <span
      class="tw:text-[clamp(2rem,3.5vw,3rem)] tw:leading-tight tw:font-extrabold tw:tracking-[-0.04em]"
    >
      {{ count }}
    </span>
    <span
      class="tw:text-home-muted tw:flex tw:items-center tw:gap-3 tw:text-sm tw:font-medium tw:max-[600px]:text-right"
    >
      {{ text }}
      <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
    </span>
  </UButton>
</template>
