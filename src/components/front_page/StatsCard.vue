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
        <!--        <animateNumber-->
        <!--          :number="count"-->
        <!--          :is-very-large="text === 'Total Records'"-->
        <!--          :is-very-small="text !== 'Total Records'"-->
        <!--        />-->
      </div>
    </v-card>
  </v-hover>
</template>

<script>
// import AnimateNumber from "@/components/partial/AnimateNumber";
export default {
  name: "StatsCard",
  // components: { AnimateNumber },
  props: ["text", "count"]
};
</script>

<style scoped></style>
