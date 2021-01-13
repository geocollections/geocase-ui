<template>
  <v-card tile class="CookieLaw py-3 px-6" elevation="12">
    <div class="d-flex flex-row justify-center">
      <div
        class="align-self-center pr-3"
        :class="{
          'text-sm': $vuetify.breakpoint.smAndDown
        }"
      >
        {{ $t("cookiePolicy.introduction") }}

        <v-dialog
          v-model="cookieDialog"
          max-width="500px"
          style="z-index: 150000;"
        >
          <template v-slot:activator="{ on }">
            <a class="table-link" v-on="on" title="Read Our Cookie Policy"
              >{{ $t("cookiePolicy.readMoreButton") }}
              <v-icon small color="primary">fas fa-cookie-bite</v-icon>
            </a>
          </template>
          <v-card>
            <v-card-title>{{ $t("cookiePolicy.title") }}</v-card-title>
            <v-card-text>{{ $t("cookiePolicy.text") }}</v-card-text>
          </v-card>
        </v-dialog>
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
  data: () => ({
    cookieDialog: false
  })
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
