<template>
  <v-card
    rounded="0"
    class="CookieLaw tw:fixed! tw:bottom-0 tw:z-[100000] tw:w-full py-3 px-6"
    elevation="12"
  >
    <div class="d-flex flex-row justify-center">
      <div
        class="align-self-center pr-3"
        :class="{
          'tw:text-sm': $vuetify.display.smAndDown,
        }"
      >
        {{ $t("cookiePolicy.introduction") }}

        <NuxtLink
          to="/access"
          class="table-link text-decoration-none"
          :title="$t('cookiePolicy.readMoreButton')"
          >{{ $t("cookiePolicy.readMoreButton") }}
          <v-icon size="small" color="primary">fa:fas fa-cookie-bite</v-icon>
        </NuxtLink>
      </div>

      <div class="align-self-center">
        <v-btn
          color="primary"
          @click="$emit('accept')"
          :title="$t('a11y.closeCookie')"
        >
          OK
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CookieLaw",
};
</script>
