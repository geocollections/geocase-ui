<template>
  <section class="landing-image">
    <v-container class="hero-content">
      <p class="hero-eyebrow">GeoCASe / {{ $t("frontPage.heroEyebrow") }}</p>
      <h1>{{ $t("frontPage.title") }}</h1>
      <p class="hero-description">{{ $t("frontPage.heroDescription") }}</p>
      <FastSearch hero />
      <router-link class="hero-link" to="search">
        {{ $t("frontPage.browseAll") }}
        <v-icon small color="white" aria-hidden="true">mdi-arrow-right</v-icon>
      </router-link>
    </v-container>
  </section>
</template>

<script>
import FastSearch from "@/components/search/FastSearch";
export default {
  name: "LandingImage",
  components: { FastSearch },
};
</script>

<style scoped>
.landing-image {
  background:
    linear-gradient(
      90deg,
      rgba(19, 32, 31, 0.96),
      rgba(19, 32, 31, 0.7) 55%,
      rgba(19, 32, 31, 0.28)
    ),
    url("https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg")
      center / cover;
  color: #fff;
  padding: 132px 24px 76px;
}
.hero-content {
  max-width: 1200px;
}
.hero-eyebrow {
  color: #e4bd7a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
h1 {
  max-width: 820px;
  font-size: clamp(2.3rem, 4.6vw, 4.4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.045em;
}
.hero-description {
  max-width: 680px;
  color: #dbe3df;
  font-size: 24px;
  line-height: 1.55;
  margin: 24px 0 8px;
}
.hero-link {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}
.hero-link:hover {
  color: #e4bd7a;
}
.hero-link:focus-visible {
  outline: 2px solid #e4bd7a;
  outline-offset: 6px;
}
@media (max-width: 600px) {
  .landing-image {
    padding: 108px 12px 48px;
  }
  .hero-description {
    font-size: 20px;
  }
}
</style>
