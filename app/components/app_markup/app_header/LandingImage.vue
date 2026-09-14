<script setup lang="ts">
import { useI18n } from "vue-i18n";
import FastSearch from "@/components/search/FastSearch.vue";
const { t } = useI18n();
</script>

<template>
  <section
    class="tw:flex tw:min-h-68.75 tw:items-center tw:justify-center tw:bg-cover tw:bg-center tw:px-4 tw:py-8 tw:text-center tw:text-white tw:shadow-md"
    style="
      background-image: url(&quot;https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg&quot;);
    "
  >
    <div class="tw:w-full">
      <h1
        class="tw:mb-2 tw:text-[2.5rem] tw:leading-tight tw:font-bold tw:[text-shadow:4px_4px_14px_#000]"
      >
        GeoCASe 2.0
      </h1>
      <p
        class="tw:mt-4 tw:hidden tw:text-[3.125rem] tw:leading-tight tw:font-bold tw:[text-shadow:4px_4px_14px_#000] tw:min-[960px]:block tw:min-[1920px]:mt-8 tw:min-[1920px]:text-[4rem]"
      >
        {{ t("frontPage.title") }}
      </p>
      <FastSearch />
    </div>
  </section>
</template>
