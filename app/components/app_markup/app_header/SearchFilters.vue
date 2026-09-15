<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSearchFilters } from "@/composables/useSearchFilters";
import MapWrapper from "@/components/MapWrapper.vue";
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
const clearLabel = (id: string) =>
  t("search.drawer.clearFilters", { field: t(`search.table.${id}`) });
</script>

<template>
  <div class="tw:text-default tw:space-y-5">
    <UCard variant="subtle" :ui="{ body: 'tw:p-4 tw:sm:p-4' }">
      <UFormField :label="t('frontPage.quickSearch')">
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
    <UCard variant="subtle" :ui="{ body: 'tw:space-y-5 tw:p-4 tw:sm:p-4' }">
      <UFormField
        v-for="id in store.searchTextIds"
        :key="id"
        :label="t(`search.table.${id}`)"
      >
        <div class="tw:space-y-2">
          <USelect
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
      <section class="tw:space-y-2">
        <div class="tw:flex tw:items-center tw:gap-2">
          <UButton
            :label="t('search.table.map')"
            :aria-expanded="!!fields.map?.showCheckboxes"
            aria-controls="search-map-filter"
            :trailing-icon="
              fields.map?.showCheckboxes
                ? 'i-lucide-chevron-up'
                : 'i-lucide-chevron-down'
            "
            color="neutral"
            variant="outline"
            class="tw:flex-1 tw:justify-between"
            @click="
              store.updateSearchField({
                id: 'map',
                showCheckboxes: !fields.map?.showCheckboxes,
              })
            "
          />
          <UButton
            v-if="fields.map?.value"
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            :aria-label="clearLabel('map')"
            @click="clearField('map')"
          />
        </div>
        <div
          id="search-map-filter"
          v-show="fields.map?.showCheckboxes"
          class="tw:border-default tw:overflow-hidden tw:rounded-lg tw:border"
        >
          <MapWrapper
            map-id="search-map"
            :open="fields.map?.showCheckboxes"
            :response-results="store.responseResults"
            :response-results-count="store.responseResultsCount"
            activate-search
            @update="store.fetchResults()"
          />
        </div>
      </section>
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
            class="tw:flex-1 tw:justify-between"
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
          class="tw:bg-elevated/50 tw:border-default tw:space-y-2 tw:rounded-lg tw:border tw:p-3"
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
        class="tw:bg-default tw:border-default tw:rounded-lg tw:border tw:p-3"
        @update:model-value="updateValue(id, $event === true ? 'true' : null)"
      />
    </UCard>
    <UButton
      :label="t('search.drawer.resetSearch')"
      icon="i-lucide-trash-2"
      color="error"
      variant="soft"
      block
      @click="reset"
    />
  </div>
</template>
