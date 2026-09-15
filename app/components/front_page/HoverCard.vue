<script setup lang="ts">
import { useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";
import { useAppNavigation } from "@/composables/useAppNavigation";

type CollectionCard = {
  title: string;
  text: string;
  button: string;
  image: string;
  imageAltText: string;
  url: string;
};

const props = defineProps<{ card: CollectionCard }>();
const router = useRouter();
const searchStore = useSearchStore();
const { localePath } = useAppNavigation();

async function openCollection() {
  if (props.card.url.endsWith('recordbasis="Meteorite"'))
    searchStore.removeStratigraphyFromTableHeaders();
  searchStore.resetSearch();

  const target = new URL(props.card.url, "https://geocase.eu");
  await router.push({
    path: localePath(target.pathname),
    query: Object.fromEntries(target.searchParams),
  });
}
</script>

<template>
  <button
    type="button"
    class="tw:border-home-border tw:text-home-ink tw:focus-visible:outline-home-focus tw:group tw:flex tw:h-full tw:w-full tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:border tw:bg-white tw:text-left tw:shadow-sm tw:transition tw:duration-200 tw:hover:-translate-y-1 tw:hover:shadow-xl tw:focus-visible:outline-3 tw:focus-visible:outline-offset-4 tw:motion-reduce:transform-none tw:motion-reduce:transition-none"
    @click="openCollection"
  >
    <img
      :src="card.image"
      :alt="card.imageAltText"
      class="tw:h-52 tw:w-full tw:rounded-t-2xl tw:object-cover tw:transition tw:duration-300 tw:group-hover:scale-[1.03] tw:motion-reduce:transform-none tw:motion-reduce:transition-none"
    />
    <span class="tw:flex tw:flex-1 tw:flex-col tw:rounded-b-2xl tw:p-6">
      <span class="tw:text-2xl tw:font-extrabold tw:tracking-tight">
        {{ card.title }}
      </span>
      <span class="tw:text-home-muted tw:my-3 tw:text-sm tw:leading-relaxed">
        {{ card.text }}
      </span>
      <span
        class="tw:mt-auto tw:flex tw:items-center tw:justify-between tw:gap-2 tw:text-sm tw:font-extrabold"
      >
        {{ card.button }}
        <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
      </span>
    </span>
  </button>
</template>
