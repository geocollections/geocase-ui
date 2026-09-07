<template>
  <button
    type="button"
    class="collection-card"
    @click="goToSearchView(card.url)"
  >
    <div
      class="collection-image"
      :style="{ backgroundImage: 'url(' + card.image + ')' }"
      aria-hidden="true"
    ></div>
    <div class="collection-body">
      <h3>{{ card.title }}</h3>
      <p>{{ card.text }}</p>
      <span class="collection-action"
        >{{ card.button }}
        <v-icon small color="inherit" aria-hidden="true"
          >mdi-arrow-top-right</v-icon
        ></span
      >
    </div>
  </button>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "HoverCard",

  props: ["card"],

  methods: {
    ...mapActions("search", ["resetSearch"]),
    ...mapActions("search", ["removeStratigraphyFromTableHeaders"]),

    // Resetting search fields before redirecting to search route
    goToSearchView(url) {
      // Special case for clicking on meteorites card (removes stratigraphy header from table)
      if (url.endsWith('recordbasis="Meteorite"'))
        this.removeStratigraphyFromTableHeaders();
      this.resetSearch();
      this.$router.push({ path: url });
    },
  },
};
</script>

<style scoped>
.collection-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  background: #fff;
  color: #203932;
  border: 1px solid #e3e5dc;
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}
.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 32px #20393214;
}
.collection-card:focus-visible {
  outline: 3px solid #916421;
  outline-offset: 4px;
}
.collection-image {
  height: 200px;
  width: 100%;
  background: #e0e4dc center / cover no-repeat;
}
.collection-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
}
h3 {
  font-size: 24px;
  letter-spacing: -0.025em;
}
p {
  color: #627067;
  font-size: 14px;
  line-height: 1.65;
  margin: 12px 0 24px;
}
.collection-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  font-size: 13px;
  font-weight: 800;
}
@media (prefers-reduced-motion: reduce) {
  .collection-card {
    transition: none;
  }
  .collection-card:hover {
    transform: none;
  }
}
</style>
