<template>
  <v-container class="StaticPage">
    <v-card elevation="6" shaped class="py-6 pl-sm-8 pr-sm-6">
      <v-tabs optional show-arrows :vertical="isSmAndUp">
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

        <v-tabs-items class="px-4 px-sm-0 pl-sm-6 pt-4 pt-sm-0">
          <router-view class="px-2" />
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
      title: this.$route.name
    };
  },

  computed: {
    ...mapGetters("settings", ["staticPages"]),

    isSmAndUp() {
      return this.$vuetify.breakpoint.smAndUp;
    }
  }
};
</script>

<style scoped></style>
