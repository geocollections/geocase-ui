<template>
  <div>
    <v-container class="FrontPage">
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
              {{ $t("frontPage.prototype_alert.title") }}
            </div>
            <div>
              <!-- TODO:  This is GeoCASe 2.0 beta interface. Please report problems in GitHub (https://github.com/geocollections/geocase-ui). The old portal is accessible at: http://old.geocase.eu. -->
              {{ $t("frontPage.prototype_alert.text") }}
            </div>
          </v-alert>
        </v-col>
      </v-row>

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
    ...mapState("frontpage", ["showAlert", "cardIds"]),
    ...mapGetters("frontpage", ["stats", "getCards"])
  },

  methods: {
    ...mapActions("frontpage", ["hideAlert", "updateCardIsLeaving"])
  }
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
