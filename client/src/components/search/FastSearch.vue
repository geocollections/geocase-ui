<template>
  <v-row
    no-gutters
    :justify="!inAppHeader ? 'center' : 'end'"
    :class="{ 'py-6': !inAppHeader }"
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
        v-model="fastSearch"
        label="Fast search"
        :append-outer-icon="!inAppHeader ? 'far fa-question-circle' : ''"
        @click:append-outer="!inAppHeader ? handleHelpButtonClick : ''"
        clearable
        light
        clear-icon="fas fa-times"
        :height="!inAppHeader ? '60' : ''"
        autocomplete="off"
      />
    </v-col>

    <help-button :show-help="showHelp" @close="showHelp = false" />
  </v-row>
</template>

<script>
import TextFieldWrapper from "../input_wrappers/TextFieldWrapper";
import { mapActions, mapState } from "vuex";
import HelpButton from "./fast_search/HelpButton";
import { debounce } from "lodash";
export default {
  name: "FastSearch",

  props: {
    inAppHeader: Boolean
  },

  components: { HelpButton, TextFieldWrapper },

  data: () => ({
    showHelp: false
  }),

  computed: {
    ...mapState("search", ["searchFields"]),

    fastSearch: {
      get() {
        return this.searchFields[0].value;
      },

      set: debounce(function(value) {
        console.log(value);
        this.updateSearchField({ field: "fastsearch", value: value });
      }, 500)
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchField"]),

    handleHelpButtonClick() {
      this.showHelp = !this.showHelp;
    }
  }
};
</script>

<style scoped>
.fast-search-input {
  font-size: 1.25rem;
  font-weight: 600;
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
</style>
