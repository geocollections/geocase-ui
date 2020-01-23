<template>
  <v-text-field v-bind="$attrs" v-on="$listeners" solo hide-details>
    <template v-slot:append-outer v-if="fast">
      <v-tooltip v-model="showHelp" bottom style="z-index: 1600;" color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn small icon @click="showHelp = !showHelp">
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>

        <span v-html="helpText" />
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: "TextFieldWrapper",
  props: {
    fast: Boolean
  },
  data: () => ({
    showHelp: false,
    helpText: `<ul>
<li>Enter term(s) for quickly searching through all main data tables. Uppercase and lowercase is not differentiated, for wildcard use asterisk (<b class="primary--text">*</b>).</li>
<li>In case of multiple terms the results will include any of the terms. To require a specific keyword to be present, precede it with '<b class="primary--text">+</b>'. To exclude a term, precede it with '<b class="primary--text">-</b>'. For instance: <b class="primary--text">+scolecodonts +valga -conjungaspis</b>.</li>
<li>To search exact expression, use <b class="primary--text">double quotation marks</b>. Use them also if the term includes special characters like '+' or '-', for instance: <b class="primary--text">"OM6-3"</b>.</li>
<li>Quick search box can also be used for more advanced queries, if you know names of database fields. For example, query by <b class="primary--text">stratigraphy:Burtnieki*</b> will search all records, where stratigraphy is set to Burtnieki Stage. NB! In this kind of search, uppercase is important ('asaphus' and 'Asaphus' are not the same) and * is useful.</li>
</ul>`
  })
};
</script>

<style scoped></style>
