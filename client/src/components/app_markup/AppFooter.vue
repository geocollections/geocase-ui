<template>
  <v-footer absolute app color="primary" dark padless>
    <v-card flat tile width="100%" class="transparent">
      <v-card-text class="pt-1 px-1 pb-0 text-center white--text">
        GeoCASe user interface prototype developed at the Department of Geology,
        TalTech. Code available in Github
        <v-btn
          icon
          href="https://github.com/geocollections/geocase-ui"
          target="GithubWindow"
          color="secondary"
        >
          <v-icon>mdi-github-circle</v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="pt-1 px-1 pb-0 text-center white--text">
        GeoGASe portal software developed at Museum für Naturkunde Berlin. Code
        available in Github
        <v-btn
          icon
          href="https://github.com/MfN-Berlin/geocase-infrastructure"
          target="GithubWindow"
          color="secondary"
        >
          <v-icon>mdi-github-circle</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider />

      <v-card-text class="pa-1 text-center white--text">
        {{ new Date().getFullYear() }} - <strong>GeoCASe</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped></style>
