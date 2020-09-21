<template>
  <v-hover v-slot:default="{ hover }" :close-delay="800">
    <v-card
      :elevation="hover ? 12 : 6"
      tile
      height="300"
      hover
      class="d-flex flex-column"
      :style="`background-image: url(&quot;${image}&quot;); background-size:cover`"
    >
      <v-spacer />

      <v-card-title
        class="justify-center text-uppercase font-weight-bold animate__animated animate__faster white--text"
        :class="{
          animate__slideInUp: hover,
          animate__slideInDown: !hover
        }"
        >{{ title }}</v-card-title
      >

      <v-card-text
        v-show="hover"
        :class="{
          'animate__slideInUp opacity-1': hover,
          'animate__slideOutDown opacity-0': !hover
        }"
        class="text-center animate__animated animate__faster white--text font-weight-bold"
        >{{ text }}</v-card-text
      >

      <v-card-actions
        v-show="hover"
        :class="{
          'animate__slideInUp opacity-1': hover,
          'animate__slideOutDown opacity-0': !hover
        }"
        class="justify-center mb-2 animate__animated animate__faster"
      >
        <v-btn dark class="font-weight-bold " elevation="6" :to="url" tile>{{
          button
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: "HoverCard",

  props: ["title", "text", "button", "url", "image"]
};
</script>

<style scoped>
.opacity-0 {
  opacity: 0;
  transition: all 800ms ease;
}

.opacity-1 {
  opacity: 1;
  transition: opacity 800ms ease;
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
