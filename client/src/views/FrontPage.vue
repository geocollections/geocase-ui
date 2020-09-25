<template>
  <v-container class="FrontPage">
    <!-- Todo: ALERT NEW PORTAL -->
    <v-row no-gutters>
      <v-col cols="12">
        <div>
          Todo: Alert box (new portal)
        </div>
      </v-col>
    </v-row>

    <!-- Todo: INTRODUCTION -->
    <v-row no-gutters>
      <v-col cols="12">
        <div>
          Todo: Introduction text
        </div>
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
import { mapGetters, mapState } from "vuex";
import StatsCard from "@/components/front_page/StatsCard";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard },

  computed: {
    ...mapState("frontpage", ["cards"]),
    ...mapGetters("frontpage", ["stats"])
  }
};
</script>

<style scoped></style>
