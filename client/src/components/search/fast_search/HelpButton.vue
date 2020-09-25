<template>
  <v-dialog
    :value="showHelp"
    @click:outside="$emit('close')"
    scrollable
    style="z-index: 2000;"
    :max-width="$vuetify.breakpoint.mdAndUp ? '960px' : ''"
  >
    <v-card>
      <v-card-title class="font-weight-medium pb-3" style="font-size: 2rem"
        >Search help</v-card-title
      >
      <v-divider></v-divider>

      <v-card-text
        style="max-height: 350px; padding: 20px 24px 20px; font-size: 1.125rem"
      >
        <v-row no-gutters justify="center">
          <v-col cols="12" md="10" lg="9">
            <ul>
              <li>
                Enter term(s) for quickly searching through all main data
                tables. Uppercase and lowercase is not differentiated, for
                wildcard use asterisk (<router-link
                  class="help-link"
                  :to="{ path: 'search', query: { q: '*oa' } }"
                  >*</router-link
                >).
              </li>

              <li>
                In case of multiple terms the results will include any of the
                terms. To require a specific keyword to be present, precede it
                with '<b class="secondary--text font-weight-black">+</b>'. To
                exclude a term, precede it with '<b
                  class="secondary--text font-weight-black"
                  >-</b
                >'. For instance:
                <router-link
                  class="help-link"
                  :to="{
                    path: 'search',
                    query: { q: '+acrochordiceras +turkey -balarama' }
                  }"
                  >+acrochordiceras +turkey -balarama</router-link
                >.
              </li>

              <li>
                To search exact expression, use
                <b class="secondary--text">double quotation marks</b>. Use them
                also if the term includes special characters like '+' or '-',
                for instance:
                <router-link
                  class="help-link"
                  :to="{ path: 'search', query: { q: '&quot;160-12&quot;' } }"
                  >"160-12"</router-link
                >.
              </li>

              <li>
                Quick search box can also be used for more advanced queries, if
                you know names of database fields. For example, query by
                <router-link
                  class="help-link"
                  :to="{
                    path: 'search',
                    query: { q: 'stratigraphy:Burtnieki*' }
                  }"
                  >stratigraphy:Burtnieki*</router-link
                >
                will search all records, where stratigraphy is set to Burtnieki
                Stage. NB! In this kind of search, uppercase is important
                ('asaphus' and 'Asaphus' are not the same) and * is useful.
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" large text @click="$emit('close')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "HelpButton",
  props: {
    showHelp: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.help-link {
  font-weight: bold;
  text-decoration: none;
}

.help-link:hover {
  opacity: 0.7;
}

ul > li {
  padding: 4px 0;
}
</style>
