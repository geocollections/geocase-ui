<template>
  <v-hover v-slot:default="{ hover }" :close-delay="500">
    <v-card flat class="StatsCard pa-4 text-center">
      <div
        style="font-size: 1.25rem;"
        class="animate__animated"
        :class="{
          animate__headShake: hover
        }"
      >
        {{ text }}
      </div>
      <div
        :class="{
          animate__headShake: hover
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
export default {
  name: "StatsCard",
  props: ["text", "count"]
};
</script>

<style scoped></style>
