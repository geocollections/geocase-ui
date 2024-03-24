<template>
  <v-container class="static-page">
    <v-card elevation="6" shaped class="py-6 pl-md-8 pr-md-6">
      <v-tabs
        optional
        show-arrows
        :vertical="isMdAndUp"
        :class="{ 'v-item-group-mb-3': !isMdAndUp }"
      >
        <v-tab
          class="my-1 justify-start"
          v-for="(item, index) in staticPages"
          :key="index"
          :to="item.to"
          :class="{ 'v-tab--active': $route.path.endsWith(item.to) }"
        >
          <v-icon left>
            {{ item.icon }}
          </v-icon>

          {{ item.text }}
        </v-tab>

        <v-tabs-items class="px-4 px-md-0 pl-md-6 pt-4 pt-md-0">
          <router-view
            class="px-2 mx-auto static-page__router-view"
            :class="`static-page__${$route.name.toLowerCase()}`"
          />
        </v-tabs-items>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StaticPage",

  metaInfo() {
    return {
      title: this.$route.name,
    };
  },

  computed: {
    ...mapGetters("settings", ["staticPages"]),

    isMdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>

<style scoped>
.static-page {
  max-width: 1000px;
}
.v-item-group-mb-3 >>> .v-item-group:first-child {
  margin-bottom: 12px;
}

/* To normalize icon sizes (larger ones seem to have 30px width) */
.static-page >>> .v-tab .v-icon {
  min-width: 30px;
}

.static-page__router-view {
  max-width: 700px;
}

.static-page__help {
  width: 100%;
  height: 100%;
}
</style>
