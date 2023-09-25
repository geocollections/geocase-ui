<template>
  <v-hover v-slot="{ hover }" close-delay="1600">
    <v-card
      :elevation="hover ? 12 : 6"
      @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"
      height="300"
      hover
      class="d-flex flex-column HoverCard"
      :style="`background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(&quot;${card.image}&quot;);`"
      :aria-label="card.imageAltText"
      @click="goToSearchView(card.url)"
    >
      <v-overlay absolute :value="hover">
        <div class="d-flex flex-column text-center">
          <div
            class="
              v-card__title
              justify-center
              text-uppercase
              font-weight-bold
              animate__animated
            "
            :class="{
              animate__fadeInUp: hover,
              animate__fadeOutDown: card.isLeaving,
            }"
          >
            {{ card.title }}
          </div>

          <div
            class="
              v-card__text
              text-center
              animate__animated
              font-weight-medium
            "
            :class="{
              animate__fadeInUp: hover,
              animate__fadeOutDown: card.isLeaving,
            }"
          >
            {{ card.text }}
          </div>

          <div
            class="v-card__actions justify-center animate__animated"
            :class="{
              animate__fadeInUp: hover,
              animate__fadeOutDown: card.isLeaving,
            }"
          >
            <v-btn
              class="font-weight-bold white--text"
              color="black"
              elevation="6"
              :to="card.url"
              >{{ card.button }}</v-btn
            >
          </div>
        </div>
      </v-overlay>

      <v-spacer />

      <v-card-title
        class="
          justify-center
          text-uppercase
          font-weight-bold
          animate__animated animate__faster
          white--text
        "
        :class="{
          animate__fadeOutUp: !card.isLeaving && hover,
          animate__fadeInDown: card.isLeaving,
        }"
        >{{ card.title }}</v-card-title
      >
    </v-card>
  </v-hover>
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

    handleMouseLeave() {
      if (!this.card.isLeaving)
        setTimeout(() => this.$emit("update:isLeaving", true), 800);
    },

    handleMouseEnter() {
      if (this.card.isLeaving) this.$emit("update:isLeaving", false);
    },
  },
};
</script>

<style scoped>
.HoverCard {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.v-card__title,
.v-card__text {
  text-shadow: 2px 2px 4px #000;
}

.v-card__title {
  font-size: 1.5rem;
}

.v-card__text {
  font-size: 1rem;
}
</style>
