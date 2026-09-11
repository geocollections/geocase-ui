<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{
  showHelp: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();
const { t } = useI18n();

function updateOpen(open: boolean) {
  if (!open) emit("close");
}
</script>

<template>
  <UModal
    :open="showHelp"
    :title="t('searchHelp.title')"
    scrollable
    :ui="{
      overlay: 'tw:z-[3290]',
      content: 'tw:z-[3300] tw:max-w-[960px]',
      title: 'tw:text-2xl tw:font-semibold tw:sm:text-3xl',
      body: 'tw:max-h-[350px] tw:text-lg',
      footer: 'tw:justify-end',
    }"
    @update:open="updateOpen"
  >
    <template #body>
      <div class="tw:mx-auto tw:max-w-3xl">
        <ul class="tw:list-disc tw:space-y-2 tw:pl-6">
          <li>
            {{ t("searchHelp.help1") }} (<NuxtLink
              class="tw:font-bold tw:no-underline tw:hover:opacity-70"
              :to="{ path: 'search', query: { q: '*oa' } }"
              >*</NuxtLink
            >).
          </li>
          <li>
            <!-- The localized copy contains emphasis markup for the operators. -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="t('searchHelp.help2')" />
            <NuxtLink
              class="tw:font-bold tw:no-underline tw:hover:opacity-70"
              :to="{
                path: 'search',
                query: { q: '+bryozoa -germany +tub*' },
              }"
              >+bryozoa -germany +tub*</NuxtLink
            >.
          </li>
          <li>
            {{ t("searchHelp.help4.prepend") }}
            <NuxtLink
              class="tw:font-bold tw:no-underline tw:hover:opacity-70"
              :to="{
                path: 'search',
                query: { q: 'stratigraphy:Burtnieki*' },
              }"
              >stratigraphy:Burtnieki*</NuxtLink
            >
            {{ t("searchHelp.help4.append") }}
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <UButton
        label="OK"
        color="primary"
        variant="ghost"
        size="lg"
        @click="emit('close')"
      />
    </template>
  </UModal>
</template>
