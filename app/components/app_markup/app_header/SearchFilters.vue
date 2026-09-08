<script setup lang="ts">
import { ref } from "vue";
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
const additional = ref(true);
const clearLabel = (id: string) =>
  t("search.drawer.clearFilters", { field: t(`search.table.${id}`) });
</script>

<template>
  <div class="tw:space-y-4 tw:text-slate-900">
    <UFormField :label="t('frontPage.quickSearch')">
      <UInput
        :model-value="fields.q?.value ?? ''"
        :placeholder="t('frontPage.quickSearch')"
        :aria-label="t('frontPage.quickSearch')"
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
    <UCollapsible v-model:open="additional" class="tw:space-y-3">
      <UButton
        :label="t('search.drawer.additionalFilters')"
        :trailing-icon="
          additional ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
        "
        color="neutral"
        variant="soft"
        block
        class="tw:justify-between"
      />
      <template #content>
        <div class="tw:space-y-4 tw:pt-3">
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
                  t(
                    `search.table.${id}${id === 'coordinates' ? 'ReadOnly' : ''}`,
                  )
                "
                :aria-label="t(`search.table.${id}`)"
                class="search-drawer-text-field tw:w-full"
                @update:model-value="updateText(id, $event)"
              >
                <template
                  v-if="fields[id]?.value && id !== 'coordinates'"
                  #trailing
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
          <section>
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
                variant="soft"
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
              class="tw:mt-2"
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
          <section v-for="id in store.searchCheckboxIds" :key="id">
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
                variant="soft"
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
              class="tw:space-y-2 tw:px-2 tw:py-3"
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
                :icon="
                  fields[id]?.showMore ? 'i-lucide-minus' : 'i-lucide-plus'
                "
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
            @update:model-value="
              updateValue(id, $event === true ? 'true' : null)
            "
          />
        </div>
      </template>
    </UCollapsible>
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
