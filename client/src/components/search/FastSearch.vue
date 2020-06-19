<template>
  <v-row no-gutters justify="center" class="py-6">
    <v-col cols="10" sm="6" md="5" lg="4" class="px-2">
      <TextFieldWrapper
        class="fast-search-input"
        v-model="fastSearch"
        label="Fast search"
        background-color="amber lighten-5"
        append-outer-icon="far fa-question-circle"
        fast
        @click:append-outer="handleHelpButtonClick"
        clearable
        clear-icon="fas fa-times"
      />
    </v-col>

    <v-dialog v-model="showHelp" scrollable style="z-index: 2000;">
      <v-card>
        <v-card-title class="headline">Search help</v-card-title>
        <v-divider></v-divider>

        <v-card-text style="max-height: 300px; padding: 20px 24px 20px;">
          <v-row no-gutters justify="center">
            <v-col cols="12" md="9" lg="8">
              <ul>
                <li>
                  Enter term(s) for quickly searching through all main data
                  tables. Uppercase and lowercase is not differentiated, for
                  wildcard use asterisk (<a
                    class="help-link"
                    href="http://geocase.geocollections.info?search=acrochordiceras"
                    >*</a
                  >).
                </li>

                <li>
                  In case of multiple terms the results will include any of the
                  terms. To require a specific keyword to be present, precede it
                  with '<b class="secondary--text">+</b>'. To exclude a term,
                  precede it with '<b class="secondary--text">-</b>'. For
                  instance:
                  <a
                    class="help-link"
                    href="http://geocase.geocollections.info?search=%2Bacrochordiceras %2Bturkey -balarama"
                    >+acrochordiceras +turkey -balarama</a
                  >.
                </li>

                <li>
                  To search exact expression, use
                  <b class="secondary--text">double quotation marks</b>. Use
                  them also if the term includes special characters like '+' or
                  '-', for instance:
                  <a
                    class="help-link"
                    href='http://geocase.geocollections.info?search="160-12"'
                    >"160-12"</a
                  >.
                </li>

                <li>
                  Quick search box can also be used for more advanced queries,
                  if you know names of database fields. For example, query by
                  <a
                    class="help-link"
                    href="http://geocase.geocollections.info?search=stratigraphy:Burtnieki*"
                    >stratigraphy:Burtnieki*</a
                  >
                  will search all records, where stratigraphy is set to
                  Burtnieki Stage. NB! In this kind of search, uppercase is
                  important ('asaphus' and 'Asaphus' are not the same) and * is
                  useful.
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="showHelp = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import TextFieldWrapper from "../input_wrappers/TextFieldWrapper";
import { mapActions } from "vuex";
export default {
  name: "FastSearch",

  components: { TextFieldWrapper },

  data: () => ({
    showHelp: false
  }),

  computed: {
    fastSearch: {
      get() {
        return this.$store.state.search.fastSearch;
      },
      set(value) {
        this.$router.push({ path: "/", query: { search: value || undefined } });
      }
    }
  },

  watch: {
    "$route.query": {
      handler: function(newVal) {
        if (newVal && newVal.search) {
          this.updateFastSearch(newVal.search);
        } else {
          this.updateFastSearch("");
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions("search", ["updateFastSearch"]),

    handleHelpButtonClick() {
      this.showHelp = !this.showHelp;
    }
  }
};
</script>

<style scoped>
.fast-search-input >>> .v-input__icon--append-outer > .v-icon--link {
  color: white !important;
  text-shadow: 2px 2px 4px #000000;
}

.fast-search-input >>> .v-input__icon--append-outer > .v-icon--link:hover {
  text-shadow: 1px 1px 2px #000000;
  /*text-shadow: unset;*/
  opacity: 0.9;
}

.help-link {
  font-weight: bold;
  text-decoration: none;
}
</style>
