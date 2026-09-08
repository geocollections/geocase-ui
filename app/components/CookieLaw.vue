<template>
  <v-card rounded="0" class="CookieLaw py-3 px-6" elevation="12">
    <div class="d-flex flex-row justify-center">
      <div
        class="align-self-center pr-3"
        :class="{
          'text-sm': $vuetify.display.smAndDown,
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
          title="Close cookie notification"
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

<style scoped>
.CookieLaw {
  position: fixed;
  bottom: 0;
  z-index: 100000;
  width: 100%;
}

.text-sm {
  font-size: 14px;
}
</style>
