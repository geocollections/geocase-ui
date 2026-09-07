<template>
  <div class="front-page">
    <v-container class="front-content">
      <div class="stats-grid">
        <StatsCard
          v-for="item in stats"
          :key="item.id"
          :text="item.text"
          :count="item.count"
          :id="item.id"
        />
      </div>
      <section class="collections" aria-labelledby="collections-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ $t("frontPage.collectionsEyebrow") }}</p>
            <h2 id="collections-title">
              {{ $t("frontPage.collectionsTitle") }}
            </h2>
          </div>
          <router-link class="section-link" to="search"
            >{{ $t("frontPage.browseAll") }}
            <v-icon small color="inherit" aria-hidden="true"
              >mdi-arrow-right</v-icon
            ></router-link
          >
        </div>
        <div class="collections-grid">
          <HoverCard
            v-for="cardId in cardIds"
            :key="cardId"
            :card="getCards[cardId]"
          />
        </div>
      </section>
      <section class="map-section" aria-labelledby="map-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ $t("frontPage.mapEyebrow") }}</p>
            <h2 id="map-title">{{ $t("frontPage.mapTitle") }}</h2>
          </div>
          <p class="map-description">{{ $t("frontPage.mapDescription") }}</p>
        </div>
        <div class="teaser-map"><MapCard /></div>
      </section>
    </v-container>
  </div>
</template>

<script>
import HoverCard from "@/components/front_page/HoverCard";
import { mapGetters, mapState } from "vuex";
import StatsCard from "@/components/front_page/StatsCard";
import MapCard from "@/components/front_page/MapCard";
export default {
  name: "FrontPage",

  components: { StatsCard, HoverCard, MapCard },

  computed: {
    ...mapState("frontpage", ["cardIds"]),
    ...mapGetters("frontpage", ["stats", "getCards"]),
  },
};
</script>

<style scoped>
.front-page {
  background: #f6f5f1;
  color: #203932;
}
.front-content {
  max-width: 1200px;
  padding: 0 24px 72px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 28px 0;
  border-bottom: 1px solid #dedfd6;
}
.collections,
.map-section {
  margin-top: 64px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 28px;
}
.eyebrow {
  color: #657467;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin-bottom: 10px;
}
h2 {
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  letter-spacing: -0.035em;
  line-height: 1.2;
}
.section-link {
  color: #264e40;
  font-weight: 700;
  text-decoration: none;
}
.section-link:hover {
  text-decoration: underline;
}
.collections-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.map-description {
  max-width: 350px;
  color: #617068;
  margin-bottom: 0;
}
.teaser-map {
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid #d9ddd5;
}
@media (max-width: 960px) {
  .collections-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .front-content {
    padding: 0 20px 40px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    padding: 16px 0;
  }
  .collections,
  .map-section {
    margin-top: 40px;
  }
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .collections-grid {
    grid-template-columns: 1fr;
  }
  .teaser-map {
    height: 380px;
  }
}
</style>
