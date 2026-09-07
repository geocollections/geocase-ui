<template>
  <v-fab-transition class="ScrollToTop">
    <v-btn
      v-scroll="onScroll"
      v-show="showFab"
      icon
      fixed
      bottom
      right
      color="amber"
      theme="dark"
      @click="toTop"
      :style="style"
    >
      <v-icon size="large">fa:fas fa-angle-up</v-icon>
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
      return "position: fixed; bottom: 24px; right: 24px; z-index: 51600;";
    },
  },

  methods: {
    onScroll(event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 300;
    },

    toTop() {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
  },
};
</script>

<style scoped></style>
