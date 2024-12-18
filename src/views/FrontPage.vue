<template>
  <div>
    <v-container class="FrontPage">
      <!-- STATS -->
      <v-row no-gutters>
        <v-col cols="12" sm="4" v-for="item in stats" :key="item.text">
          <StatsCard :text="item.text" :count="item.count" :id="item.id" />
        </v-col>
      </v-row>

      <!-- 4 HOVER CARDS -->
      <v-row no-gutters>
        <v-col
          class="pa-3"
          cols="12"
          sm="6"
          md="3"
          v-for="cardId in cardIds"
          :key="getCards[cardId].title"
        >
          <HoverCard
            :card="getCards[cardId]"
            @update:isLeaving="
              updateCardIsLeaving({ id: cardId, isLeaving: $event })
            "
          />
        </v-col>
      </v-row>
    </v-container>
    <!-- teaser-map-container -->
    <v-container
      class="teaser-map"
      :class="{ 'height-50vh': $vuetify.breakpoint.mdAndDown }"
      fluid
    >
      <MapCard />
    </v-container>
  </div>
</template>

<script>
import HoverCard from "@/components/front_page/HoverCard";
import { mapActions, mapGetters, mapState } from "vuex";
import StatsCard from "@/components/front_page/StatsCard";
import MapCard from "@/components/front_page/MapCard";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard, MapCard },

  computed: {
    ...mapState("frontpage", ["cardIds"]),
    ...mapGetters("frontpage", ["stats", "getCards"]),
  },

  methods: {
    ...mapActions("frontpage", ["updateCardIsLeaving"]),
  },
};
</script>

<style scoped>
.teaser-map {
  padding: 0;
  min-height: 320px;
  max-height: 800px;
  height: 650px;
}

.height-50vh {
  height: 50vh;
}
</style>
