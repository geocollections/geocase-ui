<script setup lang="ts">
defineProps<{
  href: string;
  icon: string;
  text: string;
  external?: boolean;
}>();
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="tw:group tw:inline-flex tw:max-w-full tw:items-center tw:gap-3 tw:rounded-lg tw:font-medium tw:leading-normal tw:text-highlighted tw:no-underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-3 tw:focus-visible:outline-primary"
  >
    <span
      class="tw:flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:bg-primary/10 tw:text-primary tw:group-hover:bg-primary/20"
    >
      <UIcon :name="icon" class="tw:size-5" aria-hidden="true" />
    </span>
    <span
      class="tw:min-w-0 tw:underline tw:decoration-current/40 tw:underline-offset-3 tw:wrap-anywhere tw:group-hover:decoration-current"
    >
      {{ text }}
    </span>
  </a>
</template>
