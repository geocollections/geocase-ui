<template>
  <v-app>
    <AppHeader />
    <main
      class="tw:flex tw:flex-1"
      :class="{
        'tw:pt-16': route.name !== 'FrontPage',
      }"
    >
      <SearchDrawer
        v-if="route.name === 'Search'"
        v-model:drawer="settings.searchDrawer"
      />
      <div class="tw:min-w-0 tw:flex-1">
        <LandingImage v-if="route.name === 'FrontPage'" /><slot />
      </div>
    </main>
    <CookieLaw v-if="cookie.cookieLaw" @accept="cookie.closeCookieLaw()" />
    <AppFooter />
  </v-app>
</template>
<script setup>
import { useCookieStore } from "@/stores/cookie";
import { useFrontpageStore } from "@/stores/frontpage";
import { useSearchStore } from "@/stores/search";
import { useSettingsStore } from "@/stores/settings";
import SearchDrawer from "@/components/app_markup/app_header/SearchDrawer.vue";
import AppHeader from "@/components/app_markup/AppHeader.vue";
import AppFooter from "@/components/app_markup/AppFooter.vue";
import LandingImage from "@/components/app_markup/app_header/LandingImage.vue";
import CookieLaw from "@/components/CookieLaw.vue";
const route = useRoute();
const cookie = useCookieStore();
const settings = useSettingsStore();
const { $toast } = useNuxtApp();
watch(
  () => settings.error,
  (value) => {
    if (value) {
      $toast.error(settings.errorMessage, "Error", { position: "topCenter" });
      settings.updateErrorState(false);
    }
  },
);
watch(
  () => settings.info,
  (value) => {
    if (value) {
      $toast.info(settings.infoMessage, "Info", { position: "topCenter" });
      settings.updateInfoState(false);
    }
  },
);
onMounted(() => {
  useFrontpageStore().getStats();
  useSearchStore().getAllFieldNames();
});
</script>
