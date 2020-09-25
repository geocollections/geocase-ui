<template>
  <v-footer
    class="footer"
    absolute
    app
    dark
    padless
    :style="`padding-left: ${$vuetify.application.left}px;`"
  >
    <v-card flat tile width="100%" class="transparent">
      <v-card-text class="pt-1 px-1 pb-0 text-center white--text">
        {{ new Date().getFullYear() }} | <strong>GeoCASe 2.0</strong>
      </v-card-text>

      <v-card-text class="pt-0 px-1 pb-0 text-center white--text">
        GeoCASe 2.0 portal is collaborative effort of the
        <a href="https://cetaf.org" target="FooterWindow"
          >CETAF Earth Sciences Group</a
        >.<br />
        Portal software created and hosted by
        <a href="https://taltech.ee/en/department-geology" target="FooterWindow"
          >TalTech (Tallinn)</a
        >
        and
        <a href="https://www.museumfuernaturkunde.berlin/" target="FooterWindow"
          >Museum für Naturkunde (Berlin)</a
        >.<br />
        Data by <router-link to="/partners_and_providers">partner institutions</router-link>.
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped>
.footer {
  -webkit-box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}
</style>
