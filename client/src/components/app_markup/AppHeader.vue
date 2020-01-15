<template>
  <v-app-bar dark app height="64" color="primary">
    <div class="d-flex align-center">
      <v-img
        alt="GeoCASe Logo"
        class="shrink mr-4"
        contain
        :src="require('../../assets/geocase_logo.png')"
        transition="scale-transition"
        width="55"
      />

      <v-toolbar-title
        class="align-center font-weight-bold"
        style="letter-spacing: 1px"
      >
        <span>GeoCASe</span>
        <span class="hidden-xs-only">-prototype</span>
      </v-toolbar-title>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      href="http://www.geocase.eu/"
      target="GeocaseWindow"
      text
      title="Go to current GeoCASe application"
    >
      <span class="mr-2 hidden-xs-only">Current application</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppHeader"
};
</script>

<style scoped></style>
