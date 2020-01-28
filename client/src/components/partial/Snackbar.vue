<template>
  <v-snackbar
    :value="snackbar"
    color="error"
    style="z-index: 2500;"
    @input="updateSnackbar"
  >
    <div v-html="error"></div>
    <v-btn color="black" icon @click="updateSnackbar(!snackbar)">
      <v-icon>mdi-close-circle-outline</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "Snackbar",

  computed: {
    ...mapState("search", ["snackbar", "error"])
  },

  methods: {
    ...mapActions("search", ["updateSnackbar"])
  }
};
</script>

<style scoped />
