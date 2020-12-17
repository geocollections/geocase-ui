<template>
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
</template>

<script>
import HoverCard from "@/components/front_page/HoverCard";
import { mapActions, mapGetters, mapState } from "vuex";
import StatsCard from "@/components/front_page/StatsCard";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard },

  computed: {
    ...mapState("frontpage", ["showAlert", "cardIds"]),
    ...mapGetters("frontpage", ["stats", "getCards"])
  },

  methods: {
    ...mapActions("frontpage", ["hideAlert", "updateCardIsLeaving"])
  }
};
</script>

<style scoped></style>
