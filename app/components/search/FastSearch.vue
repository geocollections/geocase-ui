<template>
  <v-row
    no-gutters
    :class="{ 'py-6': !inAppHeader, 'justify-center': !inAppHeader }"
  >
    <v-col
      :cols="!inAppHeader ? 10 : 12"
      :sm="!inAppHeader ? 6 : 12"
      :md="!inAppHeader ? 5 : 12"
      :lg="!inAppHeader ? 4 : 12"
      :class="!inAppHeader ? 'px-2' : 'px-4'"
    >
      <text-field-wrapper
        class="fast-search-input"
        :class="{ 'in-app-header': inAppHeader }"
        v-model="fastSearch"
        :label="$t('frontPage.quickSearch')"
        :append-icon="!inAppHeader ? 'fa:far fa-question-circle' : ''"
        @click:append="handleHelpButtonClick"
        append-inner-icon="fa:fas fa-search"
        @click:append-inner="doFastSearch"
        @keyup="doFastSearch"
        :autofocus="$route.name === 'FrontPage'"
        theme="light"
        clear-icon="fa:fas fa-times"
        :height="!inAppHeader ? '60' : ''"
        autocomplete="off"
        :variant="inAppHeader ? 'solo-filled' : 'solo'"
      />
    </v-col>

    <help-button :show-help="showHelp" @close="showHelp = false" />
  </v-row>
</template>

<script>
import { useSearchStore } from "@/stores/search";

import { mapActions, mapState } from "pinia";
import { debounce } from "lodash";
import TextFieldWrapper from "@/components/input_wrappers/TextFieldWrapper.vue";
import HelpButton from "@/components/search/fast_search/HelpButton.vue";
import queryMixin from "@/mixins/queryMixin";
export default {
  name: "FastSearch",

  props: {
    inAppHeader: Boolean,
  },

  components: { HelpButton, TextFieldWrapper },

  mixins: [queryMixin],

  data: () => ({
    showHelp: false,
  }),

  computed: {
    ...mapState(useSearchStore, ["search"]),

    fastSearch: {
      get() {
        return this.search.q.value;
      },

      set: debounce(function (value) {
        this.updateSearchField({ id: "q", value: value });
        this.updateSortBy([]);
        this.updateSortDesc([]);
        if (this.search.page !== 1) this.updatePage(1);
      }, 250),
    },
  },

  methods: {
    ...mapActions(useSearchStore, [
      "updateSearchField",
      "updatePage",
      "updateSortBy",
      "updateSortDesc",
    ]),

    doFastSearch(event) {
      if (
        event.type === "click" ||
        event.keyCode === 13 ||
        event.key === "Enter"
      ) {
        setTimeout(() => {
          this.$router.push({
            name: "Search",
            params:
              this.$i18n.locale !== "en" ? { locale: this.$i18n.locale } : {},
            query: { ...this.$route.query, q: this.fastSearch, page: 1 },
          });
        }, 250);
      }
    },

    handleHelpButtonClick() {
      this.showHelp = !this.showHelp;
    },
  },
};
</script>

<style scoped>
.fast-search-input {
  font-size: 1.25rem;
  font-weight: 600;
}

.fast-search-input.in-app-header {
  font-size: 1rem;
}

.fast-search-input :deep(.v-input__icon--clear > .v-icon--link) {
  font-size: 1.75rem !important;
}

.fast-search-input :deep(.v-input__append) {
  margin-top: 4px !important;
  margin-left: 12px !important;
  align-self: center;
}

.fast-search-input :deep(.v-input__icon--append > .v-icon--link) {
  color: white !important;
  text-shadow: 2px 2px 4px #000000;
  font-size: 2rem;
}

.fast-search-input :deep(.v-input__icon--append > .v-icon--link:hover) {
  text-shadow: 1px 1px 2px #000000;
  opacity: 0.9;
}

.fast-search-input :deep(.v-label) {
  font-size: 1.25rem;
}

.fast-search-input.in-app-header :deep(.v-label) {
  font-size: 1rem;
}
</style>
