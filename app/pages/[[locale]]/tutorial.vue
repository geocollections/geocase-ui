<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";

definePageMeta({
  name: "Tutorial",
  path: "/:locale(en|ee|de)?/tutorial",
  layout: "default",
});

const { t } = useI18n();
const { localePath } = useAppNavigation();

useHead(() => ({ title: t("tutorialPage.pageTitle") }));

const steps = [
  { key: "collections", icon: "i-lucide-panels-top-left" },
  { key: "search", icon: "i-lucide-search" },
  { key: "results", icon: "i-lucide-list-filter" },
  { key: "map", icon: "i-lucide-map-pinned" },
  { key: "records", icon: "i-lucide-file-search" },
];
const notes = ["locations", "mapDetails", "images", "imageDetails", "sources"];
const providerSteps = ["install", "connect", "map", "publish", "harvest"];
const datasetFields = [
  "title",
  "datasetId",
  "contentContact",
  "technicalContact",
  "ownerInstitution",
  "ownerCountry",
  "terms",
  "lastModified",
];
const specimenFields = [
  "unitId",
  "recordBasis",
  "scientificName",
  "country",
  "coordinates",
  "stratigraphy",
  "imageUrl",
  "imageLicence",
];
const specimenTypes = ["fossils", "minerals", "rocks", "meteorites"];
const providerResources = [
  {
    key: "installationLink",
    href: "http://wiki.bgbm.org/bps/index.php/Installation",
  },
  {
    key: "connectionLink",
    href: "http://wiki.bgbm.org/bps/index.php/DatasourceSetup#Setting_up_the_database_connection",
  },
  {
    key: "structureLink",
    href: "http://wiki.bgbm.org/bps/index.php/DatasourceSetup#Setting_up_the_Database_Structure",
  },
  {
    key: "mappingDocumentation",
    href: "http://wiki.bgbm.org/bps/index.php/ABCD2Mapping",
  },
];
const datasetFieldLinks: Record<string, string> = {
  title: "https://terms.tdwg.org/wiki/abcd2:DataSet-Title",
  datasetId: "https://terms.tdwg.org/wiki/abcd2:DatasetID",
  contentContact: "https://terms.tdwg.org/wiki/abcd2:ContentContact",
  technicalContact: "https://terms.tdwg.org/wiki/abcd2:TechnicalContact",
  ownerInstitution: "https://terms.tdwg.org/wiki/abcd2:DataSet-Owner",
  ownerCountry: "https://terms.tdwg.org/wiki/abcd2:DataSet-Owner-Address",
  terms: "https://terms.tdwg.org/wiki/abcd2:DataSet-IPRStatements",
  lastModified: "https://terms.tdwg.org/wiki/abcd2:DataSet-DateModified",
};
const specimenFieldLinks: Record<string, string> = {
  unitId: "https://terms.tdwg.org/wiki/abcd2:UnitID",
  recordBasis: "https://terms.tdwg.org/wiki/abcd2:RecordBasis",
  scientificName:
    "https://terms.tdwg.org/wiki/abcd2:TaxonIdentified-FullScientificNameString",
  country: "https://terms.tdwg.org/wiki/abcd2:Gathering-Country",
  coordinates: "https://terms.tdwg.org/wiki/abcd2:Gathering-SiteCoordinates",
  stratigraphy:
    "https://terms.tdwg.org/wiki/abcd-efg:UnitStratigraphicDetermination",
  imageUrl: "https://terms.tdwg.org/wiki/abcd2:MultiMediaObject-FileURI",
  imageLicence:
    "https://terms.tdwg.org/wiki/abcd2:MultiMediaObject-IPRStatements",
};
</script>

<template>
  <article
    class="tw:mx-auto tw:w-full tw:max-w-6xl tw:min-w-0 tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <header
      class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <p
        class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-[0.12em] tw:text-home-link tw:uppercase"
      >
        <span
          class="tw:size-2 tw:rounded-full tw:bg-geocase"
          aria-hidden="true"
        />
        {{ t("tutorialPage.eyebrow") }}
      </p>
      <h1
        class="tw:max-w-3xl tw:text-[clamp(2.25rem,5vw,3.5rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]"
      >
        {{ t("tutorialPage.heroTitle") }}
      </h1>
      <p
        class="tw:mt-5 tw:max-w-3xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
      >
        {{ t("tutorialPage.heroDescription") }}
      </p>
      <div class="tw:mt-7 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        <NuxtLink
          :to="localePath('/search')"
          class="tw:inline-flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-hero"
        >
          {{ t("tutorialPage.exploreSearch") }}
          <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink
          :to="localePath('/dataset')"
          class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-lg tw:py-3 tw:font-bold tw:text-home-link tw:no-underline tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
        >
          {{ t("tutorialPage.exploreDatasets") }}
          <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
        </NuxtLink>
      </div>
    </header>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="steps-title">
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase"
      >
        {{ t("tutorialPage.stepsEyebrow") }}
      </p>
      <div
        class="tw:mt-2 tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4"
      >
        <h2
          id="steps-title"
          class="tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
        >
          {{ t("tutorialPage.stepsTitle") }}
        </h2>
        <p class="tw:max-w-2xl tw:leading-7 tw:text-home-muted">
          {{ t("tutorialPage.stepsDescription") }}
        </p>
      </div>
      <ol class="tw:mt-7 tw:grid tw:list-none tw:gap-4 tw:p-0 tw:md:grid-cols-2">
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="tutorial-step-card tw:flex tw:min-w-0 tw:items-start tw:gap-4 tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-5 tw:transition-colors tw:hover:bg-home-surface tw:sm:p-6"
        >
          <span
            class="tw:grid tw:size-12 tw:shrink-0 tw:place-items-center tw:rounded-xl tw:bg-home-link/10 tw:text-home-link"
            aria-hidden="true"
          >
            <UIcon :name="step.icon" class="tw:size-6" />
          </span>
          <span class="tw:min-w-0">
            <span
              class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span class="tw:mt-1 tw:block tw:text-lg tw:font-bold">
              {{ t(`tutorialPage.steps.${step.key}.title`) }}
            </span>
            <span
              class="tw:mt-2 tw:block tw:text-sm tw:leading-6 tw:text-home-muted"
            >
              {{ t(`tutorialPage.steps.${step.key}.description`) }}
            </span>
          </span>
        </li>
      </ol>
    </section>

    <section
      class="tw:mb-4 tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-8"
      aria-labelledby="notes-title"
    >
      <div
        class="tw:grid tw:items-start tw:gap-6 tw:md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] tw:md:gap-10"
      >
        <div>
          <p
            class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase"
          >
            {{ t("tutorialPage.notesEyebrow") }}
          </p>
          <h2
            id="notes-title"
            class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight"
          >
            {{ t("tutorialPage.notesTitle") }}
          </h2>
        </div>
        <ul class="tw:grid tw:list-none tw:gap-3 tw:p-0">
          <li
            v-for="note in notes"
            :key="note"
            class="tw:flex tw:items-start tw:gap-3 tw:rounded-2xl tw:bg-white tw:p-4"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="tw:mt-0.5 tw:size-5 tw:shrink-0 tw:text-home-link"
              aria-hidden="true"
            />
            <span class="tw:leading-7 tw:text-home-muted">{{
              t(`tutorialPage.notes.${note}`)
            }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="providers-title">
      <div
        class="tw:grid tw:items-start tw:gap-7 tw:lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] tw:lg:gap-12"
      >
        <div>
          <p
            class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase"
          >
            {{ t("tutorialPage.providers.eyebrow") }}
          </p>
          <h2
            id="providers-title"
            class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
          >
            {{ t("tutorialPage.providers.title") }}
          </h2>
          <p class="tw:mt-4 tw:leading-7 tw:text-home-muted">
            {{ t("tutorialPage.providers.description") }}
          </p>

          <div class="tw:mt-6 tw:rounded-2xl tw:bg-home-surface tw:p-5">
            <h3 class="tw:flex tw:items-center tw:gap-2 tw:font-bold">
              <UIcon
                name="i-lucide-braces"
                class="tw:text-home-link"
                aria-hidden="true"
              />
              {{ t("tutorialPage.providers.apiTitle") }}
            </h3>
            <p class="tw:mt-2 tw:text-sm tw:leading-6 tw:text-home-muted">
              {{ t("tutorialPage.providers.apiDescription") }}
            </p>
            <div class="tw:mt-4 tw:flex tw:flex-wrap tw:gap-x-5 tw:gap-y-2">
              <a
                href="https://api.geocase.eu/"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
              >
                {{ t("tutorialPage.providers.apiLink") }}
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://swagger.io/specification/"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-1 tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
              >
                {{ t("tutorialPage.providers.openApiLink") }}
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="tw:size-4"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 class="tw:text-lg tw:font-bold">
            {{ t("tutorialPage.providers.stepsTitle") }}
          </h3>
          <ol class="tw:mt-4 tw:grid tw:list-none tw:gap-3 tw:p-0">
            <li
              v-for="(step, index) in providerSteps"
              :key="step"
              class="tw:flex tw:items-start tw:gap-4 tw:rounded-2xl tw:border tw:border-home-border tw:p-4 tw:sm:p-5"
            >
              <span
                class="tw:grid tw:size-9 tw:shrink-0 tw:place-items-center tw:rounded-full tw:bg-home-link tw:text-sm tw:font-extrabold tw:text-white"
                aria-hidden="true"
              >
                {{ index + 1 }}
              </span>
              <span>
                <span class="tw:block tw:font-bold">{{
                  t(`tutorialPage.providers.steps.${step}.title`)
                }}</span>
                <span
                  class="tw:mt-1 tw:block tw:text-sm tw:leading-6 tw:text-home-muted"
                  >{{
                    t(`tutorialPage.providers.steps.${step}.description`)
                  }}</span
                >
              </span>
            </li>
          </ol>
          <div class="tw:mt-4 tw:flex tw:flex-wrap tw:gap-x-5 tw:gap-y-2">
            <a
              v-for="resource in providerResources"
              :key="resource.key"
              :href="resource.href"
              target="_blank"
              rel="noopener noreferrer"
              class="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
            >
              {{ t(`tutorialPage.providers.${resource.key}`) }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="tw:size-4"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
      <p
        class="tw:mt-6 tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-4 tw:text-sm tw:leading-6 tw:text-home-muted"
      >
        {{ t("tutorialPage.providers.interoperability") }}
        <a
          href="https://github.com/tdwg/abcd"
          target="_blank"
          rel="noopener noreferrer"
          class="tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
          >ABCD</a
        >
        <a
          href="https://www.gbif.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
          >GBIF</a
        >.
      </p>

      <section
        class="tw:mt-10 tw:rounded-3xl tw:bg-home-surface tw:p-5 tw:sm:mt-12 tw:sm:p-8"
        aria-labelledby="metadata-title"
      >
        <h3
          id="metadata-title"
          class="tw:text-xl tw:font-bold tw:tracking-tight tw:sm:text-2xl"
        >
          {{ t("tutorialPage.providers.metadataTitle") }}
        </h3>
        <p class="tw:mt-2 tw:max-w-3xl tw:leading-7 tw:text-home-muted">
          {{ t("tutorialPage.providers.metadataDescription") }}
        </p>
        <dl class="tw:mt-5 tw:grid tw:gap-3 tw:sm:grid-cols-2">
          <div
            v-for="field in datasetFields"
            :key="field"
            class="tw:rounded-xl tw:bg-white tw:p-4"
          >
            <dt class="tw:font-bold">
              <a
                :href="datasetFieldLinks[field]"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-home-link tw:underline tw:underline-offset-4"
              >
              {{ t(`tutorialPage.providers.datasetFields.${field}.name`) }}
              </a>
            </dt>
            <dd class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-home-muted">
              {{
                t(`tutorialPage.providers.datasetFields.${field}.description`)
              }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="tw:mt-10" aria-labelledby="specimen-fields-title">
        <h3
          id="specimen-fields-title"
          class="tw:text-xl tw:font-bold tw:tracking-tight tw:sm:text-2xl"
        >
          {{ t("tutorialPage.providers.specimenFieldsTitle") }}
        </h3>
        <p class="tw:mt-2 tw:max-w-3xl tw:leading-7 tw:text-home-muted">
          {{ t("tutorialPage.providers.specimenFieldsDescription") }}
        </p>
        <div
          class="tw:mt-5 tw:overflow-x-auto tw:rounded-2xl tw:border tw:border-home-border"
        >
          <table
            class="tw:w-full tw:min-w-180 tw:border-collapse tw:text-left tw:text-sm"
          >
            <thead class="tw:bg-home-hero tw:text-white">
              <tr>
                <th scope="col" class="tw:p-3 tw:sm:p-4">
                  {{ t("tutorialPage.providers.fieldColumn") }}
                </th>
                <th
                  v-for="type in specimenTypes"
                  :key="type"
                  scope="col"
                  class="tw:p-3 tw:sm:p-4"
                >
                  {{ t(`tutorialPage.providers.types.${type}`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="field in specimenFields"
                :key="field"
                class="tw:border-t tw:border-home-border even:tw:bg-home-surface/70"
              >
                <th scope="row" class="tw:min-w-64 tw:p-3 tw:sm:p-4">
                  <a
                    :href="specimenFieldLinks[field]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tw:block tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
                  >
                    {{ t(`tutorialPage.providers.fieldLabels.${field}`) }}
                  </a>
                  <span class="tw:mt-1 tw:block tw:font-normal tw:text-home-muted">{{
                    t(`tutorialPage.providers.fieldDescriptions.${field}`)
                  }}</span>
                </th>
                <td
                  v-for="type in specimenTypes"
                  :key="type"
                  class="tw:p-3 tw:text-center tw:sm:p-4"
                >
                  <span
                    class="tw:inline-flex tw:min-w-8 tw:justify-center tw:rounded-full tw:px-2 tw:py-1 tw:text-xs tw:font-extrabold"
                    :class="
                      t(
                        `tutorialPage.providers.specimenFields.${field}.${type}`,
                      ) ===
                      'required'
                        ? 'tw:bg-home-link tw:text-white'
                        : t(
                              `tutorialPage.providers.specimenFields.${field}.${type}`,
                            ) === 'recommended'
                          ? 'tw:bg-home-hover tw:text-home-link'
                          : t(
                                `tutorialPage.providers.specimenFields.${field}.${type}`,
                              ) === 'optional'
                            ? 'tw:bg-home-hover tw:text-home-muted'
                            : 'tw:bg-white tw:text-home-muted'
                    "
                    :aria-label="
                        t(
                          `tutorialPage.providers.statusNames.${t(
                            `tutorialPage.providers.specimenFields.${field}.${type}`,
                          )}`,
                        )
                    "
                  >
                    {{
                      t(
                        `tutorialPage.providers.statuses.${t(
                          `tutorialPage.providers.specimenFields.${field}.${type}`,
                        )}`,
                      )
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="tw:mt-3 tw:text-sm tw:leading-6 tw:text-home-muted">
          <span class="tw:font-bold tw:text-home-ink">
            {{ t("tutorialPage.providers.statuses.required") }} —
            {{ t("tutorialPage.providers.statusNames.required") }}.
            {{ t("tutorialPage.providers.statuses.recommended") }} —
            {{ t("tutorialPage.providers.statusNames.recommended") }}.
            {{ t("tutorialPage.providers.statuses.optional") }} —
            {{ t("tutorialPage.providers.statusNames.optional") }}.
          </span>
          {{ t("tutorialPage.providers.contactNote") }}
          <a
            href="mailto:geocase@mfn.berlin"
            class="tw:ml-1 tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
            >geocase@mfn.berlin</a
          >.
        </p>
      </section>
    </section>
  </article>
</template>
