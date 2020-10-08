<template>
  <v-container class="FrontPage">
    <!-- Todo: ALERT NEW PORTAL -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-alert
          v-if="showAlert"
          dismissible
          prominent
          type="info"
          text
          @input="hideAlert"
        >
          <div class="font-weight-bold" style="font-size: 1.25rem;">
            This is GeoCASe 2.0 prototype interface. It has incomplete functionality and data, and is intended for testing purposes only.
          </div>
          <div>
            This box will be replaced by brief introduction about GeoCASe.
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- STATS -->
    <v-row no-gutters>
      <v-col cols="12" sm="4" v-for="item in stats" :key="item.text">
        <StatsCard :text="item.text" :count="item.count" />
      </v-col>
    </v-row>

    <!-- 4 HOVER CARDS -->
    <v-row no-gutters>
      <v-col
        class="pa-3"
        cols="12"
        sm="6"
        md="3"
        v-for="card in cards"
        :key="card.title"
      >
        <HoverCard
          :title="card.title"
          :text="card.text"
          :button="card.button"
          :url="card.url"
          :image="card.image"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HoverCard from "@/components/front_page/HoverCard";
import { mapActions, mapGetters, mapState } from "vuex";
import StatsCard from "@/components/front_page/StatsCard";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard },

  computed: {
    ...mapState("frontpage", ["cards", "showAlert"]),
    ...mapGetters("frontpage", ["stats"])
  },

  methods: {
    ...mapActions("frontpage", ["hideAlert"])
  }
};
</script>

<style scoped></style>
