<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute } from "#imports";
import { useDetailStore } from "@/stores/detail";
import ImageCarousel from "@/components/image/ImageCarousel.vue";
import ExpandableDetailText from "@/components/ExpandableDetailText.vue";
import DetailContactLink from "@/components/DetailContactLink.vue";
import ProviderDataTree from "@/components/ProviderDataTree.vue";
import TabMap from "@/components/tabs/TabMap.vue";
import GoBackButton from "@/components/GoBackButton.vue";
import SpecimenTable from "@/components/tables/SpecimenTable.vue";

definePageMeta({ name: "Detail", path: "/:locale(en|ee|de)?/specimen/:id" });
const props = defineProps({ id: { type: String, default: undefined } });
const route = useRoute();
const { t } = useI18n();
const detail = useDetailStore();
const {
  response,
  responseFromSource,
  isLoading,
  itemExists,
  imageExists,
  localityExists,
  item,
  filteredItemHeaders,
  filteredItemHeadersSecondary,
  isItemFossil,
  isItemMineral,
  isItemRock,
  isItemMeteorite,
  itemReference,
  itemArea,
  areaDetail,
  nearNamedPlace,
  originalStatus,
  unitWeight,
  acquisitionDate,
  gatheringAgent,
  unitDateText,
  kindOfUnit,
  itemHighertaxon,
  itemMineralGroup,
  mineralNameDetail,
  contentContactName,
  contentContactEmail,
  contentContactPhone,
  contentContactAddress,
  logoURI,
  representationTitle,
  representationURI,
  copyrights,
  termsofusestatements,
  dateLastEdited,
  disclaimers,
  acknowledgements,
  specimenVerifier,
  unitGuid,
} = storeToRefs(detail);

const getSpecimenType = computed(() =>
  isItemMineral.value
    ? "mineral"
    : isItemRock.value
      ? "rock"
      : isItemMeteorite.value
        ? "meteorite"
        : "fossil",
);
const filteredNames = computed(() =>
  Array.isArray(item.value?.names)
    ? item.value.names.filter((name) => name !== item.value.fullscientificname)
    : [],
);
const specimenTitle = computed(
  () =>
    item.value?.fullscientificname ||
    item.value?.unitid ||
    item.value?.collectioncode ||
    item.value?.geocase_id ||
    "",
);
const computedLastHarvestedProcessing = computed(
  () => item.value?.last_harvested_processing?.split("T")[0] || null,
);
const detailViewImages = computed(() =>
  Array.isArray(item.value?.images)
    ? item.value.images.map((image) => ({
        ...item.value,
        thumbnailImage: `https://geocase.eu/thumbnails/${encodeURIComponent(image)}`,
        originalImage: image,
        altText: [
          "recordbasis",
          "fullscientificname",
          "locality",
          "datasetowner",
        ]
          .filter((field) => item.value[field])
          .map((field) => `${t(`search.table.${field}`)}: ${item.value[field]}`)
          .join(", "),
      }))
    : [],
);
const hasMedia = computed(
  () =>
    localityExists.value ||
    (imageExists.value && detailViewImages.value.length > 0),
);
const notFoundMessage = computed(() =>
  t("detail.noResults", { id: String(route.params.id ?? "") }).replace(
    /<[^>]*>/g,
    "",
  ),
);

useHead(() => ({
  title:
    item.value?.fullscientificname ||
    `${item.value?.recordbasis || "Geoscience"} Specimen`,
}));
useSeoMeta({
  description: () =>
    [
      item.value?.fullscientificname,
      item.value?.locality,
      item.value?.datasetowner,
    ]
      .filter(Boolean)
      .join(" — "),
  ogTitle: () => item.value?.fullscientificname || "Specimen",
});

watch(
  () => props.id ?? route.params.id,
  async (id) => {
    if (!id) return;
    detail.resetResponseFromSource();
    await detail.getDetailView(id);
    const specimen = item.value;
    if (specimen?.datasourceurl?.includes("pywrapper") && specimen.unitid) {
      let sourceUrl =
        specimen.datasourceurl.replace("pywrapper", "querytool/raw") +
        `&filter=(cat=${specimen.unitid})`;
      if (
        specimen.datasourceurl.includes("geocollections.info") &&
        specimen.datasetownerabbrev
      ) {
        sourceUrl += `AND(col=${specimen.datasetownerabbrev})`;
      }
      sourceUrl += "&schema=http://www.tdwg.org/schemas/abcd/2.06";
      detail.getDetailViewDataFromSource(sourceUrl);
    }
  },
  { immediate: true },
);
onBeforeRouteLeave(() => detail.resetResponseFromSource());

function getCetafIdentifierUrl(country, identifier) {
  if (!country || !identifier) return "";
  const slug =
    country === "UK"
      ? "united-kingdom"
      : country === "The Netherlands"
        ? "netherlands-the"
        : country.toLowerCase();
  return `https://collections.naturalsciences.be/cpb/nh-collections/countries/${slug}/${identifier}`;
}
</script>

<template>
  <main
    v-if="!isLoading"
    class="tw:mx-auto tw:max-w-7xl tw:px-4 tw:py-6 tw:sm:px-6 tw:lg:px-8"
  >
    <GoBackButton />

    <UAlert
      v-if="!itemExists"
      icon="i-lucide-search-x"
      color="error"
      variant="soft"
      class="tw:mx-auto tw:max-w-lg"
      :description="notFoundMessage"
    />

    <div
      v-if="itemExists"
      class="tw:grid tw:grid-cols-1 tw:gap-6 tw:sm:grid-cols-2"
    >
      <div class="tw:sm:col-span-2">
        <section
          class="tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-muted/30 tw:shadow-sm"
        >
          <div class="tw:p-5 tw:sm:p-8">
            <div
              class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-4"
            >
              <div class="tw:min-w-0 tw:flex-1">
                <div
                  class="tw:mb-2 tw:text-sm tw:font-bold tw:tracking-wide tw:text-primary tw:wrap-anywhere"
                >
                  <span
                    v-if="
                      isItemFossil ||
                      isItemMineral ||
                      isItemRock ||
                      isItemMeteorite
                    "
                  >
                    <UIcon
                      :name="
                        isItemFossil
                          ? 'i-lucide-fish'
                          : isItemMineral
                            ? 'i-lucide-gem'
                            : isItemRock
                              ? 'i-lucide-mountain'
                              : 'i-lucide-meteor'
                      "
                      class="tw:mr-2 tw:inline-block tw:size-4 tw:align-middle"
                      aria-hidden="true"
                    />

                    <span>{{
                      $t(`detail.specimenType.${getSpecimenType}`)
                    }}</span>
                  </span>

                  <span
                    v-if="
                      (isItemFossil ||
                        isItemMineral ||
                        isItemRock ||
                        isItemMeteorite) &&
                      item.fullscientificname &&
                      (item.collectioncode || item.unitid)
                    "
                  >
                    -
                  </span>

                  <span
                    class="tw:font-bold"
                    v-if="
                      item.fullscientificname &&
                      (item.collectioncode || item.unitid)
                    "
                  >
                    <span v-if="item.collectioncode"
                      >{{ item.collectioncode }}
                    </span>
                    <span v-if="item.unitid">{{ item.unitid }}</span>
                  </span>
                </div>

                <h1
                  :class="{ 'tw:italic': isItemFossil }"
                  class="tw:mb-2 tw:text-[clamp(1.7rem,3vw,2.4rem)] tw:leading-tight tw:font-bold tw:text-highlighted tw:wrap-anywhere"
                  v-if="specimenTitle"
                >
                  {{ specimenTitle }}
                </h1>

                <h2
                  class="tw:text-base tw:leading-relaxed tw:text-muted tw:wrap-anywhere"
                  v-if="filteredNames.length > 0"
                >
                  <span class="tw:font-normal"
                    >{{ $t("detail.otherIdentification")
                    }}<span v-if="filteredNames.length > 1">s</span>:
                  </span>
                  <span
                    :class="{ 'tw:italic': isItemFossil }"
                    v-for="(entity, index) in filteredNames"
                    :key="index"
                  >
                    <span class="tw:font-bold">{{ entity }}</span>
                    <span
                      class="tw:mx-1"
                      v-if="index < filteredNames.length - 1"
                      >|</span
                    >
                  </span>
                </h2>
              </div>

              <div v-if="logoURI" class="tw:ml-auto tw:shrink-0">
                <img
                  :src="logoURI"
                  :alt="`${item.datasetowner} logo`"
                  class="tw:max-h-20 tw:max-w-20 tw:object-contain tw:lg:max-h-25 tw:lg:max-w-25"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        :class="['tw:order-1 tw:min-w-0', hasMedia ? '' : 'tw:sm:col-span-2']"
      >
        <section
          class="tw:h-full tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-default tw:shadow-sm"
        >
          <h2
            class="tw:px-6 tw:pt-5 tw:pb-2 tw:text-lg tw:font-bold tw:text-highlighted"
          >
            {{ $t("detail.specimenDetails") }}
          </h2>
          <SpecimenTable
            :mobile-breakpoint="9000"
            disable-sort
            disable-filtering
            disable-pagination
            hide-default-footer
            :headers="filteredItemHeaders"
            :items="[item]"
          >
            <template v-slot:item.type_status="{ value }">
              <div>
                <span
                  v-if="
                    value === 'holotype' ||
                    value === 'neotype' ||
                    value === 'Holotypus' ||
                    value === 'Neotypus'
                  "
                  class="tw:font-bold"
                >
                  {{ value }}
                </span>
                <span v-else>
                  {{ value }}
                </span>
                <span v-if="originalStatus">({{ originalStatus }})</span>
              </div>
            </template>

            <template v-slot:item.stratigraphy>
              <div v-if="item.stratigraphies">
                <ul class="tw:list-[circle] tw:pl-5">
                  <li v-for="(item, index) in item.stratigraphies" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div v-else-if="item.stratigraphytexts">
                <ul class="tw:list-[circle] tw:pl-5">
                  <li
                    v-for="(item, index) in item.stratigraphytexts"
                    :key="index"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </template>

            <template v-slot:item.area>
              <div v-if="itemArea && itemArea.length > 0">
                <ul class="tw:list-[circle] tw:pl-5">
                  <li v-for="(item, index) in itemArea" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </template>

            <template v-slot:item.areaDetail>
              <div v-if="areaDetail">
                {{ areaDetail }}
              </div>
            </template>

            <template v-slot:item.nearNamedPlace>
              <div v-if="nearNamedPlace">
                {{ nearNamedPlace }}
              </div>
            </template>

            <template v-slot:item.highertaxon="{ item }">
              <div v-if="itemHighertaxon && itemHighertaxon.length > 0">
                <ul class="tw:list-[circle] tw:pl-5">
                  <li v-for="(item, index) in itemHighertaxon" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div v-else>{{ item.highertaxon }}</div>
            </template>

            <template v-slot:item.itemMineralGroup>
              <div v-if="itemMineralGroup">
                {{ itemMineralGroup }}
              </div>
            </template>

            <template v-slot:item.mineralNameDetail>
              <div v-if="mineralNameDetail">
                {{ mineralNameDetail }}
              </div>
            </template>

            <template v-slot:item.reference>
              <div v-if="itemReference && itemReference.length > 0">
                <ul class="tw:list-[circle] tw:pl-5">
                  <li v-for="(item, index) in itemReference" :key="index">
                    <span v-html="item" />
                  </li>
                </ul>
              </div>
            </template>

            <template v-slot:item.unitWeight>
              <div v-if="unitWeight">
                {{ unitWeight }}
              </div>
            </template>

            <template v-slot:item.acquisitionDate>
              <div v-if="acquisitionDate">
                {{ acquisitionDate }}
              </div>
            </template>

            <template v-slot:item.gatheringAgent>
              <div v-if="gatheringAgent">
                {{ gatheringAgent }}
              </div>
            </template>

            <template v-slot:item.unitDateText>
              <div v-if="unitDateText">
                {{ unitDateText }}
              </div>
            </template>

            <template v-slot:item.kindOfUnit>
              <div v-if="kindOfUnit">
                {{ kindOfUnit }}
              </div>
            </template>

            <template v-slot:item.mindat_url="{ item }">
              <a
                :href="item.mindat_url"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:text-primary tw:underline tw:wrap-anywhere"
                title="Link to Mindat.org"
                >{{ item.mindat_url }}
                <UIcon
                  name="i-lucide-external-link"
                  class="tw:size-4 tw:shrink-0"
                  aria-hidden="true"
                />
              </a>
            </template>

            <template v-slot:item.taxon_id_pbdb="{ item }">
              <a
                :href="`https://paleobiodb.org/classic/basicTaxonInfo?taxon_no=${encodeURIComponent(item.taxon_id_pbdb)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:text-primary tw:underline"
                title="Link to taxon record in PBDB"
                >Link to taxon record in PBDB<UIcon
                  name="i-lucide-external-link"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
            </template>

            <template v-slot:item.taxon_id_eol="{ item }">
              <a
                :href="`https://eol.org/pages/${encodeURIComponent(item.taxon_id_eol)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:text-primary tw:underline"
                title="Link to taxon record in Encyclopedia of Life"
                >Link to taxon record in Encyclopedia of Life<UIcon
                  name="i-lucide-external-link"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
            </template>

            <template v-slot:item.taxon_id_tol="{ item }">
              <a
                :href="`https://tolweb.org/${encodeURIComponent(item.taxon_id_tol)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:text-primary tw:underline"
                title="Link to taxon record in Tree of life"
                >Link to taxon record in Tree of life<UIcon
                  name="i-lucide-external-link"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
            </template>

            <template v-slot:item.taxon_id="{ item }">
              <a
                :href="`https://fossiilid.info/${encodeURIComponent(item.taxon_id)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:text-primary tw:underline"
                title="Link to taxon record in fossiilid.info"
                >Link to taxon record in fossiilid.info<UIcon
                  name="i-lucide-external-link"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
            </template>

            <template v-slot:item.recordURI="{ item }">
              <a
                :href="item.recordURI"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-primary tw:underline tw:wrap-anywhere"
                >{{ item.recordURI }}</a
              >
            </template>

            <template v-slot:item.relatedResource="{ item }">
              <a
                :href="item.relatedResource"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-primary tw:underline tw:wrap-anywhere"
                >{{ item.relatedResource }}</a
              >
            </template>
          </SpecimenTable>
        </section>
      </div>

      <div
        class="tw:order-4 tw:min-w-0"
        :class="
          localityExists && detailViewImages.length > 0
            ? 'tw:sm:col-span-1'
            : 'tw:sm:col-span-2'
        "
      >
        <section
          class="tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-default tw:shadow-sm"
          v-if="
            filteredItemHeadersSecondary &&
            filteredItemHeadersSecondary.length > 0
          "
        >
          <h2
            class="tw:px-6 tw:pt-5 tw:pb-2 tw:text-lg tw:font-bold tw:text-highlighted"
          >
            {{ $t("detail.sourceAndRights") }}
          </h2>
          <SpecimenTable
            density="compact"
            :mobile-breakpoint="9000"
            disable-sort
            disable-filtering
            disable-pagination
            hide-default-footer
            :headers="filteredItemHeadersSecondary"
            :items="[item]"
          >
            <template v-slot:item.institutionHomepage>
              <div
                v-if="representationTitle || representationURI"
                class="tw:flex tw:justify-start"
              >
                <div class="tw:mr-3 tw:self-center" v-if="representationTitle">
                  <a
                    v-if="representationURI"
                    class="tw:text-primary tw:underline"
                    :href="representationURI"
                    :title="representationURI"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ representationTitle }}</a
                  >
                  <div v-else>{{ representationTitle }}</div>
                </div>
              </div>
            </template>

            <template v-slot:item.contentContactName>
              <div>
                {{ contentContactName }}
              </div>
            </template>

            <template v-slot:item.contentContactEmail>
              <DetailContactLink
                v-if="contentContactEmail"
                :href="`mailto:${contentContactEmail}`"
                icon="i-lucide-mail"
                :text="contentContactEmail"
              />
            </template>

            <template v-slot:item.contentContactPhone>
              <DetailContactLink
                v-if="contentContactPhone"
                :href="`tel:${contentContactPhone}`"
                icon="i-lucide-phone"
                :text="contentContactPhone"
              />
            </template>

            <template v-slot:item.contentContactAddress>
              <DetailContactLink
                v-if="contentContactAddress"
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contentContactAddress)}`"
                icon="i-lucide-map-pin"
                :text="contentContactAddress"
                external
              />
            </template>

            <template v-slot:item.copyrights>
              <ExpandableDetailText :text="copyrights" />
            </template>

            <template v-slot:item.termsofusestatements>
              <ExpandableDetailText :text="termsofusestatements" />
            </template>

            <template v-slot:item.disclaimers>
              <ExpandableDetailText :text="disclaimers" />
            </template>

            <template v-slot:item.acknowledgements>
              <ExpandableDetailText :text="acknowledgements" />
            </template>

            <template v-slot:item.dateLastEdited>
              <div>{{ dateLastEdited }}</div>
            </template>

            <template v-slot:item.last_harvested_processing>
              <div>{{ computedLastHarvestedProcessing }}</div>
            </template>

            <template v-slot:item.providerurl="{ item }">
              <a
                :href="item.providerurl"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-primary tw:underline tw:wrap-anywhere"
                >{{ item.providerurl }}</a
              >
            </template>

            <template v-slot:item.specimenVerifier>
              <div>{{ specimenVerifier }}</div>
            </template>

            <template v-slot:item.unitGuid>
              <div>{{ unitGuid }}</div>
            </template>

            <template v-slot:item.cetaf_identifier>
              <a
                :href="
                  getCetafIdentifierUrl(
                    item.datasourcecountry,
                    item.cetaf_identifier,
                  )
                "
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-primary tw:underline tw:wrap-anywhere"
                >{{
                  getCetafIdentifierUrl(
                    item.datasourcecountry,
                    item.cetaf_identifier,
                  )
                }}</a
              >
            </template>
          </SpecimenTable>
        </section>
      </div>

      <div v-if="hasMedia" class="tw:order-2 tw:flex tw:min-w-0 tw:items-end">
        <div class="tw:w-full">
          <div
            v-if="localityExists"
            class="detail-map tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-default tw:shadow-sm"
          >
            <TabMap :response-results="response" :is-detail-view="true" />
          </div>

          <div v-if="!localityExists && detailViewImages.length > 0">
            <image-carousel
              class="tw:mb-0! tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:shadow-sm"
              :images="detailViewImages"
            />
          </div>
        </div>
      </div>

      <div
        v-if="localityExists && imageExists && detailViewImages.length > 0"
        class="tw:order-3 tw:min-w-0 tw:self-start"
      >
        <image-carousel
          class="tw:mb-0! tw:w-full tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:shadow-sm"
          :images="detailViewImages"
        />
      </div>

      <details
        v-if="responseFromSource"
        class="tw:group tw:order-5 tw:min-w-0 tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-default tw:shadow-sm tw:sm:col-span-2"
      >
        <summary
          class="tw:flex tw:cursor-pointer tw:list-none tw:items-center tw:justify-between tw:gap-3 tw:px-6 tw:py-5 tw:font-semibold tw:text-highlighted tw:marker:hidden"
        >
          {{ $t("detail.dataFromProvider") }}
          <UIcon
            name="i-lucide-chevron-down"
            class="tw:size-5 tw:shrink-0 tw:transition-transform tw:group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div
          class="tw:max-h-125 tw:overflow-auto tw:border-t tw:border-default tw:p-5"
        >
          <ProviderDataTree :data="responseFromSource" />
        </div>
      </details>
    </div>
  </main>

  <main
    v-else
    class="tw:mx-auto tw:max-w-7xl tw:px-4 tw:py-6 tw:sm:px-6 tw:lg:px-8"
  >
    <GoBackButton />
    <div class="tw:grid tw:grid-cols-1 tw:gap-6 tw:sm:grid-cols-2">
      <USkeleton class="tw:h-36 tw:rounded-[20px] tw:sm:col-span-2" />
      <USkeleton class="tw:h-80 tw:rounded-[20px]" />
      <USkeleton class="tw:h-80 tw:rounded-[20px]" />
    </div>
  </main>
</template>
