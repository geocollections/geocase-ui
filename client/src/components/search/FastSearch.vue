<template>
  <v-row no-gutters justify="center" class="py-6">
    <v-col cols="10" sm="6" md="5" lg="4" class="px-2">
      <TextFieldWrapper
        v-model="fastSearch"
        label="Fast search"
        background-color="amber lighten-5"
        append-outer-icon="mdi-help-circle-outline"
        fast
        @click:append-outer="handleHelpButtonClick"
        clearable
      />
    </v-col>

    <v-expand-transition>
      <v-col cols="12" class="mt-2" v-show="showHelp">
        <v-row no-gutters justify="center">
          <v-col cols="12" md="9" lg="8">
            <ul>
              <li>
                Enter term(s) for quickly searching through all main data
                tables. Uppercase and lowercase is not differentiated, for
                wildcard use asterisk (<b class="secondary--text">*</b>).
              </li>

              <li>
                In case of multiple terms the results will include any of the
                terms. To require a specific keyword to be present, precede it
                with '<b class="secondary--text">+</b>'. To exclude a term,
                precede it with '<b class="secondary--text">-</b>'. For
                instance:
                <b class="secondary--text">+scolecodonts +valga -conjungaspis</b
                >.
              </li>

              <li>
                To search exact expression, use
                <b class="secondary--text">double quotation marks</b>. Use them
                also if the term includes special characters like '+' or '-',
                for instance: <b class="secondary--text">"OM6-3"</b>.
              </li>

              <li>
                Quick search box can also be used for more advanced queries, if
                you know names of database fields. For example, query by
                <b class="secondary--text">stratigraphy:Burtnieki*</b> will
                search all records, where stratigraphy is set to Burtnieki
                Stage. NB! In this kind of search, uppercase is important
                ('asaphus' and 'Asaphus' are not the same) and * is useful.
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-col>
    </v-expand-transition>
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
        this.updateFastSearch(value);
      }
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

<style scoped />
