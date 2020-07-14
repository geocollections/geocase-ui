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
                wildcard use asterisk (<a
                  class="help-link"
                  href="http://geocase.geocollections.info?q=acrochordiceras"
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
                  href="http://geocase.geocollections.info?q=%2Bacrochordiceras %2Bturkey -balarama"
                  >+acrochordiceras +turkey -balarama</a
                >.
              </li>

              <li>
                To search exact expression, use
                <b class="secondary--text">double quotation marks</b>. Use them
                also if the term includes special characters like '+' or '-',
                for instance:
                <a
                  class="help-link"
                  href='http://geocase.geocollections.info?q="160-12"'
                  >"160-12"</a
                >.
              </li>

              <li>
                Quick search box can also be used for more advanced queries, if
                you know names of database fields. For example, query by
                <a
                  class="help-link"
                  href="http://geocase.geocollections.info?q=stratigraphy:Burtnieki*"
                  >stratigraphy:Burtnieki*</a
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

        <v-btn color="green darken-1" text @click="$emit('close')">
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

ul > li {
  padding: 4px 0;
}
</style>
