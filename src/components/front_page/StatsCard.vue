<template>
  <button type="button" class="stats-card" @click="viewInfo">
    <span class="stats-count">{{ count }}</span>
    <span class="stats-label"
      >{{ text }}
      <v-icon small color="inherit" aria-hidden="true"
        >mdi-arrow-top-right</v-icon
      ></span
    >
  </button>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "StatsCard",
  props: ["text", "count", "id"],
  computed: {
    ...mapState("search", ["search"]),
  },
  methods: {
    ...mapActions("search", ["updateSearchField"]),
    viewInfo() {
      if (this.id === 2) {
        this.$router.push("partners_and_providers");
      } else if (this.id === 3) {
        if (!this.search["country"].showCheckboxes)
          this.updateSearchField({ id: "country", showCheckboxes: true });
        this.$router.push("search");
      } else this.$router.push("search");
    },
  },
};
</script>

<style scoped>
.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px;
  color: #203932;
  border-radius: 12px;
}
.stats-card:hover {
  background: #eaece3;
}
.stats-card:focus-visible {
  outline: 3px solid #916421;
  outline-offset: -3px;
}
.stats-count {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.2;
}
.stats-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #617068;
}
@media (max-width: 600px) {
  .stats-card {
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 8px;
  }
  .stats-label {
    text-align: right;
  }
}
</style>
