<template>
  <v-fab-transition class="ScrollToTop">
    <v-btn
      v-scroll="onScroll"
      v-show="showFab"
      fab
      fixed
      bottom
      right
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
export default {
  name: "ScrollToTop",

  data: () => ({
    showFab: false,
  }),

  computed: {
    style() {
      return "z-index: 51600;";
    },
  },

  methods: {
    onScroll(event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 300;
    },

    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>

<style scoped></style>
