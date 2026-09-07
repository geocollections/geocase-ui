<template>
  <v-hover v-slot="{ isHovering: hover, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      @click="viewInfo"
      flat
      class="StatsCard pa-4 text-center"
      :class="{ 'hover-enter text-primary': hover, 'hover-leave': !hover }"
    >
      <div
        style="font-size: 1.25rem"
        class="animate__animated"
        :class="{
          animate__headShake: hover,
        }"
      >
        {{ text }}
      </div>
      <div
        :class="{
          animate__headShake: hover,
        }"
        class="font-weight-bold animate__animated"
        style="font-size: 1.75rem"
      >
        {{ count }}
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import { useSearchStore } from "@/stores/search";

import { mapActions, mapState } from "pinia";

export default {
  name: "StatsCard",
  props: ["text", "count", "id"],
  computed: {
    ...mapState(useSearchStore, ["search"]),
  },
  methods: {
    ...mapActions(useSearchStore, ["updateSearchField"]),
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
.hover-enter {
  transition: all 200ms ease-in;
}

.hover-leave {
  transition: all 200ms ease-out;
}
</style>
