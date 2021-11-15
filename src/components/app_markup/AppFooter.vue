<template>
  <v-footer
    class="footer"
    absolute
    app
    dark
    :style="`padding-left: ${$vuetify.application.left}px;`"
  >
    <v-card flat tile width="100%" class="transparent">
      <v-card-text class="pt-1 px-1 pb-0 text-center white--text">
        {{ new Date().getFullYear() }} |
        <strong>{{ $t("footer.title") }}</strong>
      </v-card-text>

      <v-card-text class="pt-0 px-1 pb-0 text-center white--text">
        <span v-html="$t('footer.collab_html')" />
        <br />
        {{ $t("footer.dataBy") }}
        <router-link to="/partners_and_providers">{{
          $t("footer.partnerInstitutions")
        }}</router-link>
        |
        <span v-html="$t('footer.created_html')" />
        <br />
        <div class="d-flex flex-column flex-sm-row justify-center">
          <a
            v-for="(item, index) in footerLogos"
            :key="index"
            :href="item.href"
            target="FooterWindow"
            class="align-self-center"
          >
            <v-img
              :alt="$t(item.alt)"
              :src="item.src"
              height="90"
              max-width="175"
              contain
            ></v-img>
          </a>
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import imageMixin from "@/mixins/imageMixin";

export default {
  name: "AppFooter",
  mixins: [imageMixin],
  computed: {
    footerLogos() {
      return [
        {
          href: "https://cetaf.org/",
          alt: "footer.cetafLogoAltText",
          src: this.getImageUrl(
            "https://files.geocollections.info/img/geocase/footer_logos/cetaf_logo.png"
          ),
        },
        {
          href: "https://taltech.ee/en/department-geology",
          alt: "footer.taltechLogoAltText",
          src: this.getImageUrl(
            "https://files.geocollections.info/img/geocase/footer_logos/taltech1.png"
          ),
        },
        {
          href: "https://www.museumfuernaturkunde.berlin/",
          alt: "footer.mfnLogoAltText",
          src: this.getImageUrl(
            "https://files.geocollections.info/img/geocase/footer_logos/mfn1.png"
          ),
        },
      ];
    },
  },
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
