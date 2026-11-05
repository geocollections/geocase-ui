<script setup lang="ts">
import type { CatalogDataset } from "@/utils/datasetCatalog";

defineProps<{ item: CatalogDataset; number: number }>();
const { t } = useI18n();
const { localePath } = useAppNavigation();
</script>

<template>
  <li class="dataset-card tw:relative tw:flex tw:min-h-48 tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-6 tw:shadow-sm tw:transition-colors tw:duration-200 tw:hover:bg-[#eaf0e9] tw:focus-within:bg-[#eaf0e9]">
    <div class="tw:flex tw:items-baseline tw:justify-between tw:gap-2">
      <span class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase">{{ t("datasetDetail.title") }}</span>
      <span class="tw:text-xl tw:font-bold tw:text-slate-300">{{ String(number).padStart(2, "0") }}</span>
    </div>
    <h3 class="tw:mt-4 tw:break-words tw:text-lg tw:leading-snug tw:font-bold">
      <NuxtLink :to="localePath('/dataset/' + item.dataset_guid)" class="tw:hover:text-home-link tw:after:absolute tw:after:inset-0 tw:after:rounded-2xl tw:focus-visible:outline-none tw:focus-visible:after:ring-2 tw:focus-visible:after:ring-home-link">
        {{ item.title }}
      </NuxtLink>
    </h3>
    <p v-if="item.organisation_name" class="tw:mt-2 tw:break-words tw:text-sm tw:text-home-muted">{{ item.organisation_name }}</p>
    <p v-if="item.description" class="tw:mt-3 tw:line-clamp-3 tw:break-words tw:text-sm tw:leading-6 tw:text-home-muted">{{ item.description }}</p>
  </li>
</template>
