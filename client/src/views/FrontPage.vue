<template>
  <v-container class="FrontPage">
    <!-- Todo: Info -->
    <v-row no-gutters>
      <v-col class="pa-3" cols="12" sm="6" md="3">
        <v-card>
          <v-card-title>Number of records: 1110669</v-card-title>
        </v-card>
      </v-col>
    </v-row>

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
    <!--    </v-card>-->
  </v-container>
</template>

<script>
import HoverCard from "@/components/front_page/HoverCard";
export default {
  name: "FrontPage",
  components: { HoverCard },
  data: () => ({
    cards: [
      {
        title: "Fossils",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        button: "View Fossils",
        url:
          '/search?recordbasis="FossileSpecimen" OR "FossilSpecimen" OR "RecentPreservedSpecimen" OR "fossil"',
        image: require("@/assets/front_page/fossil.png")
      },
      {
        title: "Minerals",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        button: "View Minerals",
        url: '/search?recordbasis="MineralSpecimen"',
        image: require("@/assets/front_page/mineral_2.png")
      },
      {
        title: "Rocks",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        button: "View Rocks",
        url:
          '/search?recordbasis="RockSpecimen" OR "SedimentSample" OR "TechnologicalSample"',
        image: require("@/assets/front_page/rock.png")
      },
      {
        title: "Meteorites",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        button: "View Meteorites",
        url: '/search?recordbasis="RockSpecimen"',
        image: require("@/assets/front_page/meteorite_1.png")
      }
    ]
  })
};
</script>

<style scoped></style>
