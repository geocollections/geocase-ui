<script setup>
definePageMeta({ name: "FrontPage", path: "/:locale(en|ee|de)?" });
useHead({ title: "Welcome" });
</script>

<template>
  <div>
    <v-container class="FrontPage">
      <v-row no-gutters>
        <v-col cols="12" sm="4" v-for="item in stats" :key="item.text">
          <StatsCard :text="item.text" :count="item.count" :id="item.id" />
        </v-col>
      </v-row>

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
    <v-container
      class="teaser-map"
      :class="{ 'height-50vh': $vuetify.display.mdAndDown }"
      fluid
    >
      <MapCard />
    </v-container>
  </div>
</template>

<script>
import { useFrontpageStore } from "@/stores/frontpage";

import HoverCard from "@/components/front_page/HoverCard.vue";
import { mapActions, mapState } from "pinia";
import StatsCard from "@/components/front_page/StatsCard.vue";
import MapCard from "@/components/front_page/MapCard.vue";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard, MapCard },

  computed: {
    ...mapState(useFrontpageStore, ["cardIds"]),
    ...mapState(useFrontpageStore, ["stats", "getCards"]),
  },

  methods: {
    ...mapActions(useFrontpageStore, ["updateCardIsLeaving"]),
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
