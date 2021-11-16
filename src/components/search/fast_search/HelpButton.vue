<template>
  <v-dialog
    :value="showHelp"
    @click:outside="$emit('close')"
    scrollable
    style="z-index: 2000"
    :max-width="$vuetify.breakpoint.mdAndUp ? '960px' : ''"
  >
    <v-card>
      <v-card-title class="font-weight-medium pb-3" style="font-size: 2rem">{{
        $t("searchHelp.title")
      }}</v-card-title>
      <v-divider></v-divider>

      <v-card-text
        style="max-height: 350px; padding: 20px 24px 20px; font-size: 1.125rem"
      >
        <v-row no-gutters justify="center">
          <v-col cols="12" md="10" lg="9">
            <ul>
              <li>
                {{ $t("searchHelp.help1") }} (<router-link
                  class="help-link"
                  :to="{ path: 'search', query: { q: '*oa' } }"
                  >*</router-link
                >).
              </li>

              <li>
                <span v-html="$t('searchHelp.help2')" />
                <router-link
                  class="help-link"
                  :to="{
                    path: 'search',
                    query: { q: '+bryozoa -germany +tub*' },
                  }"
                  >+bryozoa -germany +tub*</router-link
                >.
              </li>

              <!--              <li>-->
              <!--                <span v-html="$t('searchHelp.help3')" />-->
              <!--                <router-link-->
              <!--                  class="help-link"-->
              <!--                  :to="{ path: 'search', query: { q: '&quot;160-12&quot;' } }"-->
              <!--                  >"160-12"</router-link-->
              <!--                >.-->
              <!--              </li>-->

              <li>
                {{ $t("searchHelp.help4.prepend") }}
                <router-link
                  class="help-link"
                  :to="{
                    path: 'search',
                    query: { q: 'stratigraphy:Burtnieki*' },
                  }"
                  >stratigraphy:Burtnieki*</router-link
                >

                {{ $t("searchHelp.help4.append") }}
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
      required: true,
    },
  },
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
