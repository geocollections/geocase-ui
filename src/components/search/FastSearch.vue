<template>
  <div v-if="hero" class="hero-quick-search">
    <form class="hero-search-form" role="search" @submit.prevent="doFastSearch">
      <text-field-wrapper
        v-model="fastSearch"
        class="hero-search-field"
        :label="$t('frontPage.quickSearch')"
        prepend-inner-icon="mdi-magnify"
        autocomplete="off"
        solo
        flat
        light
        height="52"
      />
      <v-btn
        type="submit"
        class="hero-search-submit"
        color="#264e40"
        dark
        depressed
        height="40"
      >
        {{ $t("header.search") }}
      </v-btn>
    </form>
    <button
      type="button"
      class="hero-search-help"
      :aria-label="$t('header.help')"
      :title="$t('header.help')"
      @click="handleHelpButtonClick"
    >
      <v-icon size="22" color="white" aria-hidden="true"
        >mdi-help-circle-outline</v-icon
      >
    </button>
    <help-button :show-help="showHelp" @close="showHelp = false" />
  </div>
  <v-row
    v-else
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
        :append-outer-icon="!inAppHeader ? 'far fa-question-circle' : ''"
        @click:append-outer="handleHelpButtonClick"
        append-icon="fas fa-search"
        @click:append="doFastSearch"
        @keyup.native="doFastSearch"
        :autofocus="$route.name === 'FrontPage'"
        light
        clear-icon="fas fa-times"
        :height="!inAppHeader ? '60' : ''"
        autocomplete="off"
        :solo="!inAppHeader"
        :solo-inverted="inAppHeader"
      />
    </v-col>

    <help-button :show-help="showHelp" @close="showHelp = false" />
  </v-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { debounce } from "lodash";
import TextFieldWrapper from "@/components/input_wrappers/TextFieldWrapper";
import HelpButton from "@/components/search/fast_search/HelpButton";
import queryMixin from "@/mixins/queryMixin";
export default {
  name: "FastSearch",

  props: {
    inAppHeader: Boolean,
    hero: Boolean,
  },

  components: { HelpButton, TextFieldWrapper },

  mixins: [queryMixin],

  data: () => ({
    showHelp: false,
  }),

  computed: {
    ...mapState("search", ["search"]),

    fastSearch: {
      get() {
        return this.search.q.value;
      },

      set: debounce(function (value) {
        this.updateSearchField({ id: "q", value: value });
        // #113 removing sorting
        this.updateSortBy([]);
        this.updateSortDesc([]);
        // #112
        if (this.search.page !== 1) this.updatePage(1);
      }, 250),
    },
  },

  methods: {
    ...mapActions("search", [
      "updateSearchField",
      "updatePage",
      "updateSortBy",
      "updateSortDesc",
    ]),

    doFastSearch(event) {
      if (
        event.type === "click" ||
        event.type === "submit" ||
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
.hero-quick-search {
  width: 100%;
  max-width: 540px;
  padding: 20px 0 18px;
}
.hero-search-form {
  display: flex;
  align-items: center;
  padding: 0 6px 0 2px;
  background: #fff;
  border: 1px solid #dbe3df;
  border-radius: 10px;
}
.hero-search-form:focus-within {
  outline: 2px solid #e4bd7a;
  outline-offset: 3px;
}
.hero-search-field {
  min-width: 0;
}
.hero-search-field >>> .v-input__slot {
  min-height: 52px;
  margin: 0;
  background: transparent !important;
}
.hero-search-field >>> input,
.hero-search-field >>> .v-label {
  font-size: 16px;
  font-weight: 400;
}
.hero-search-field >>> .v-input__prepend-inner {
  padding-right: 10px;
}
.hero-search-field >>> .v-icon {
  font-size: 20px;
}
.hero-search-submit {
  flex-shrink: 0;
  border-radius: 7px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 700;
}
.hero-search-help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-height: 32px;
  margin-top: 6px;
  color: #dbe3df;
  font-size: 13px;
}
.hero-search-help:hover {
  opacity: 0.8;
}
.hero-search-help:focus-visible {
  outline: 2px solid #e4bd7a;
  outline-offset: 2px;
}

.fast-search-input {
  font-size: 1.25rem;
  font-weight: 600;
}

.fast-search-input.in-app-header {
  font-size: 1rem;
}

.fast-search-input >>> .v-input__icon--clear > .v-icon--link {
  font-size: 1.75rem !important;
}

.fast-search-input >>> .v-input__append-outer {
  margin-top: 4px !important;
  margin-left: 12px !important;
  align-self: center;
}

.fast-search-input >>> .v-input__icon--append-outer > .v-icon--link {
  color: white !important;
  text-shadow: 2px 2px 4px #000000;
  /*font-size: 30px;*/
  font-size: 2rem;
}

.fast-search-input >>> .v-input__icon--append-outer > .v-icon--link:hover {
  text-shadow: 1px 1px 2px #000000;
  /*text-shadow: unset;*/
  opacity: 0.9;
}

.fast-search-input >>> .v-label {
  font-size: 1.25rem;
}

.fast-search-input.in-app-header >>> .v-label {
  font-size: 1rem;
}
</style>
