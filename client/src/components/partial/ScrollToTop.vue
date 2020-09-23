<template>
  <v-fab-transition class="ScrollToTop">
    <v-btn
      v-scroll="onScroll"
      v-show="showFab"
      fab
      fixed
      bottom
      left
      color="amber"
      dark
      @click="toTop"
      :style="style"
    >
      <v-icon large>fas fa-angle-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ScrollToTop",

  data: () => ({
    showFab: false
  }),

  computed: {
    ...mapState("settings", ["searchDrawer"]),

    style() {
      let style = "z-index: 1600;";
      if (this.searchDrawer)
        style += `left: ${this.$vuetify.application.left + 16}px`;
      return style;
    }
  },

  methods: {
    onScroll(event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 300;
    },

    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>

<style scoped></style>
