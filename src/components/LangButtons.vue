<template>
  <v-menu transition="slide-y-transition" offset-y z-index="2101">
    <template v-slot:activator="{ on }">
      <v-btn aria-label="select language" text x-small v-on="on">
        <span :class="[flagCommonStyles, flagStyles()]" />
      </v-btn>
    </template>

    <v-list color="primary" dark dense>
      <v-list-item
        v-for="item in languages"
        :key="item.text"
        @click="changeLang(item.value)"
      >
        <v-list-item-title class="d-flex">
          <div
            class="mr-2"
            :class="[flagCommonStyles, flagStyles(item.value)]"
          ></div>
          <div class="align-self-center font-weight-bold">{{ item.text }}</div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from "vuex";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "LangButtons",

  mixins: [toastMixin],

  data: () => ({
    languages: [
      { value: "en", text: "ENG" },
      { value: "ee", text: "EST" },
      { value: "de", text: "GER" },
    ],
  }),

  computed: {
    ...mapState("settings", ["language"]),

    flagCommonStyles() {
      return {
        flag: true,
        "flag-squared": true,
        "flag-circle": true,
        "lang-button": true,
      };
    },
  },

  mounted() {
    if (this.language !== this.$i18n.locale)
      this.updateLanguage(this.$i18n.locale);
  },

  methods: {
    ...mapActions("settings", ["updateLanguage"]),

    flagStyles(lang) {
      if (!lang) lang = this.language;
      return {
        "flag-en": lang === "en",
        "flag-ee": lang === "ee",
        "flag-de": lang === "de",
      };
    },

    changeLang(newLang) {
      if (this.language === newLang) return;
      this.$i18n.locale = newLang;
      this.updateLanguage(newLang);
      this.$router.replace({
        name: this.$route.name,
        params: newLang !== "en" ? { locale: newLang } : {},
        query: { ...this.$route.query },
      });
      this.toastInfo({ text: this.$t("messages.languageChange") });
    },
  },
};
</script>

<style scoped>
.lang-button {
  height: 28px;
  width: 28px !important;
}
.flag {
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.flag-en {
  background-image: url("https://files.geocollections.info/img/geocase/flags/en.svg");
}
.flag-ee {
  background-image: url("https://files.geocollections.info/img/geocase/flags/ee.svg");
}
.flag-de {
  background-image: url("https://files.geocollections.info/img/geocase/flags/de.svg");
}
.flag-squared {
  width: 1em;
}
.flag-circle {
  border-radius: 100%;
}
</style>
