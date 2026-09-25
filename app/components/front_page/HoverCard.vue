<script setup lang="ts">
import { useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";
import { useAppNavigation } from "@/composables/useAppNavigation";

type CollectionCard = {
  title: string;
  text: string;
  button: string;
  image?: string;
  icon?: string;
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
  <UButton
    type="button"
    color="neutral"
    variant="ghost"
    class="tw:group tw:flex tw:h-full tw:w-full tw:cursor-pointer tw:flex-col tw:items-stretch tw:gap-0 tw:rounded-xl tw:border-0 tw:bg-transparent tw:p-0 tw:text-left tw:font-normal tw:text-base tw:leading-normal tw:text-home-ink tw:hover:bg-transparent tw:active:bg-transparent tw:focus-visible:outline-2 tw:focus-visible:outline-home-focus tw:focus-visible:outline-offset-6"
    @click="openCollection"
  >
    <span class="tw:block tw:aspect-[16/10] tw:w-full tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:bg-home-hero">
      <img
        v-if="card.image"
        :src="card.image"
        :alt="card.imageAltText"
        class="tw:block tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-350 tw:ease-[ease] tw:motion-safe:group-hover:scale-[1.035] tw:motion-safe:group-focus-visible:scale-[1.035] tw:motion-reduce:transition-none"
      />
      <span
        v-else
        class="tw:flex tw:h-full tw:items-center tw:justify-center tw:bg-[radial-gradient(ellipse_at_30%_20%,#38584b,#13201f_80%)] tw:text-home-accent"
        aria-hidden="true"
      >
        <UIcon :name="card.icon" class="tw:size-20" />
      </span>
    </span>
    <span class="tw:flex tw:w-full tw:flex-1 tw:flex-col tw:px-0.5 tw:pt-5">
      <span class="tw:flex tw:items-center tw:justify-between tw:gap-3">
        <span class="tw:text-2xl tw:font-bold tw:leading-[1.2] tw:tracking-[-0.035em]">{{ card.title }}</span>
        <span
          class="tw:flex tw:size-8.5 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-home-border tw:transition-[background,border-color,transform] tw:duration-200 tw:ease-[ease] tw:group-hover:border-home-accent tw:group-hover:bg-home-accent tw:group-focus-visible:border-home-accent tw:group-focus-visible:bg-home-accent tw:motion-safe:group-hover:translate-x-0.5 tw:motion-safe:group-hover:-translate-y-0.5 tw:motion-safe:group-focus-visible:translate-x-0.5 tw:motion-safe:group-focus-visible:-translate-y-0.5 tw:motion-reduce:transition-none"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-arrow-up-right" />
        </span>
      </span>
      <span class="tw:mt-2.5 tw:mb-4.5 tw:text-[0.9375rem] tw:leading-[1.6] tw:text-home-muted">{{ card.text }}</span>
      <span class="tw:mt-auto tw:text-[0.8125rem] tw:font-bold tw:text-home-link">{{ card.button }}</span>
    </span>
  </UButton>
</template>
