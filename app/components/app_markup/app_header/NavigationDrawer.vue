<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/stores/settings";
import { navigationVisibility, useAppNavigation } from "@/composables/useAppNavigation";
const drawer = defineModel<boolean>("drawer", { required: true });
const settings = useSettingsStore();
const { t } = useI18n();
const { localePath } = useAppNavigation();
</script>

<template>
  <USlideover
    v-model:open="drawer"
    :title="t('header.showMenu')"
    :ui="{ overlay: 'tw:z-[3290]', content: 'tw:z-[3300] tw:max-w-sm' }"
  >
    <template #body>
      <nav aria-label="Site navigation" class="tw:flex tw:flex-col tw:gap-2">
        <UButton
          v-for="item in settings.routes"
          :key="item.name"
          :to="localePath(item.to)"
          :label="item.text"
          color="neutral"
          variant="ghost"
          size="lg"
          class="tw:justify-start tw:no-underline"
          :class="navigationVisibility[item.to]?.drawer"
          @click="drawer = false"
        />
      </nav>
    </template>
  </USlideover>
</template>
