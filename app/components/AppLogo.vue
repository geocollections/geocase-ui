<script setup lang="ts">
withDefaults(defineProps<{ size?: "default" | "large" }>(), { size: "default" });
</script>

<template>
  <span class="tw:inline-flex tw:shrink-0 tw:items-center tw:gap-2 tw:whitespace-nowrap">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      :width="size === 'large' ? 36 : 32"
      :height="size === 'large' ? 36 : 32"
      class="tw:shrink-0"
      :class="size === 'large' ? 'tw:size-9' : 'tw:size-7 tw:sm:size-8'"
    >
      <path class="tw:fill-geocase-700" d="M16 1 29 9 26 24 14 31 3 23 4 9Z"/>
      <path class="tw:fill-geocase-300" d="M16 1 17 12 4 9Z"/>
      <path class="tw:fill-geocase-400" d="m16 1 13 8-12 3Z"/>
      <path class="tw:fill-geocase-500" d="m4 9 13 3-9 11-5 0Z"/>
      <path class="tw:fill-geocase-600" d="m17 12 12-3-3 15-5-3Z"/>
      <path class="tw:fill-geocase-200" d="m17 12 4 9-7 10-6-8Z"/>
      <path class="tw:fill-geocase-400" d="m8 23 6 8-11-8Z"/>
      <path class="tw:fill-geocase-500" d="m21 21 5 3-12 7Z"/>
    </svg>
    <span
      class="tw:font-serif tw:leading-none tw:font-bold tw:tracking-[-0.055em]"
      :class="size === 'large' ? 'tw:text-3xl' : 'tw:text-[1.55rem]'"
    ><span class="tw:text-home-accent">Geo</span><span class="tw:text-white">CASe</span></span>
  </span>
</template>
