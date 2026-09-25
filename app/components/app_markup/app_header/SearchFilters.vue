<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSearchFilters } from "@/composables/useSearchFilters";
const { t } = useI18n();
const {
  store,
  fields,
  updateValue,
  updateText,
  clearField,
  isSelected,
  toggleFacet,
  reset,
} = useSearchFilters();
const hasActiveFilters = computed(() =>
  store.searchIds.some((id) => {
    const value = fields.value[id]?.value;
    return typeof value === "string" ? value.trim().length > 0 : !!value;
  }),
);
const clearLabel = (id: string) =>
  t("search.drawer.clearFilters", { field: t(`search.table.${id}`) });
</script>

<template>
  <div class="tw:text-highlighted tw:space-y-5">
    <div
      v-if="hasActiveFilters"
      class="tw:sticky tw:-top-4 tw:z-20 tw:-mx-4 tw:-mt-4 tw:bg-white tw:px-4 tw:py-3"
    >
      <UButton
        :label="t('search.drawer.resetSearch')"
        icon="i-lucide-trash-2"
        color="error"
        variant="outline"
        block
        class="tw:bg-white tw:text-red-600 tw:ring-red-200 tw:hover:bg-white tw:hover:ring-red-400 tw:active:bg-red-600 tw:active:text-white"
        @click="reset"
      />
    </div>
    <UCard
      variant="outline"
      class="tw:ring-accented"
      :ui="{ body: 'tw:p-4 tw:sm:p-4' }"
    >
      <UFormField
        :label="t('frontPage.quickSearch')"
        size="lg"
        :ui="{ label: 'tw:text-highlighted tw:font-semibold' }"
      >
        <UInput
          :model-value="fields.q?.value ?? ''"
          :aria-label="t('frontPage.quickSearch')"
          icon="i-lucide-search"
          size="lg"
          class="search-drawer-text-field tw:w-full"
          @update:model-value="updateText('q', $event)"
        >
          <template v-if="fields.q?.value" #trailing
            ><UButton
              icon="i-lucide-x"
              color="neutral"
              variant="link"
              :aria-label="clearLabel('q')"
              @click="clearField('q')"
          /></template>
        </UInput>
      </UFormField>
    </UCard>
    <UCard
      variant="outline"
      class="tw:ring-accented"
      :ui="{ body: 'tw:space-y-5 tw:p-4 tw:sm:p-4' }"
    >
      <UFormField
        v-for="id in store.searchTextIds"
        :key="id"
        :label="t(`search.table.${id}`)"
        :ui="{ label: 'tw:text-highlighted tw:font-semibold' }"
      >
        <div class="tw:space-y-2">
          <USelect
            :ui="{ content: 'tw:z-[3400]' }"
            :items="store.lookUpTypes"
            :model-value="fields[id]?.lookUpType"
            :disabled="id === 'coordinates'"
            :aria-label="`${t(`search.table.${id}`)} operator`"
            class="tw:w-full"
            @update:model-value="
              store.updateSearchField({ id, lookUpType: $event });
              store.updatePage(1);
            "
          />
          <UInput
            :model-value="fields[id]?.value ?? ''"
            :readonly="id === 'coordinates'"
            :placeholder="
              t(`search.table.${id}${id === 'coordinates' ? 'ReadOnly' : ''}`)
            "
            :aria-label="t(`search.table.${id}`)"
            class="search-drawer-text-field tw:w-full"
            @update:model-value="updateText(id, $event)"
          >
            <template v-if="fields[id]?.value && id !== 'coordinates'" #trailing
              ><UButton
                icon="i-lucide-x"
                color="neutral"
                variant="link"
                :aria-label="clearLabel(id)"
                @click="clearField(id)"
            /></template>
          </UInput>
        </div>
      </UFormField>
      <section
        v-for="id in store.searchCheckboxIds"
        :key="id"
        class="tw:space-y-2"
      >
        <div class="tw:flex tw:items-center tw:gap-2">
          <UButton
            :label="t(`search.table.${id}`)"
            :aria-expanded="!!fields[id]?.showCheckboxes"
            :aria-controls="`facet-${id}`"
            :trailing-icon="
              fields[id]?.showCheckboxes
                ? 'i-lucide-chevron-up'
                : 'i-lucide-chevron-down'
            "
            color="neutral"
            variant="outline"
            class="tw:text-highlighted tw:flex-1 tw:justify-between tw:font-semibold"
            @click="
              store.updateSearchField({
                id,
                showCheckboxes: !fields[id]?.showCheckboxes,
              })
            "
          />
          <UButton
            v-if="store.getActiveCheckboxesCount(id) > 0"
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            :aria-label="clearLabel(id)"
            @click="clearField(id)"
            >{{ store.getActiveCheckboxesCount(id) }}</UButton
          >
        </div>
        <div
          v-if="fields[id]?.showCheckboxes"
          :id="`facet-${id}`"
          class="tw:bg-default tw:border-accented tw:space-y-2 tw:rounded-lg tw:border tw:p-3"
        >
          <UCheckbox
            v-for="(entity, index) in store.getCheckboxes(
              id,
              true,
              fields[id]?.showMore,
            )"
            :key="entity"
            :model-value="isSelected(id, entity)"
            :label="`${entity} (${store.getCheckboxesCount(id)[index]})`"
            :ui="{ label: 'tw:text-highlighted' }"
            @update:model-value="toggleFacet(id, entity, $event === true)"
          />
          <UButton
            v-if="store.getCheckboxesLength(id) > 4"
            :label="
              t(
                fields[id]?.showMore
                  ? 'search.drawer.less'
                  : 'search.drawer.more',
              )
            "
            :icon="fields[id]?.showMore ? 'i-lucide-minus' : 'i-lucide-plus'"
            color="neutral"
            variant="link"
            class="tw:text-highlighted tw:font-semibold"
            @click="
              store.updateSearchField({
                id,
                showMore: !fields[id]?.showMore,
              })
            "
          />
        </div>
      </section>
      <UCheckbox
        v-for="id in store.searchSingleCheckboxIds"
        :key="id"
        :model-value="fields[id]?.value === 'true'"
        :label="t(`search.drawer.${id}`)"
        variant="card"
        color="neutral"
        :ui="{ label: 'tw:text-highlighted tw:font-semibold' }"
        @update:model-value="updateValue(id, $event === true ? 'true' : null)"
      />
    </UCard>
  </div>
</template>
