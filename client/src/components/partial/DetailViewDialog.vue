<template>
  <v-dialog
    fullscreen
    hide-overlay
    style="position: fixed; z-index: 10000;"
    :value="$attrs.value"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn
          icon
          dark
          @click="$emit('update:dialogState', false)"
          title="Close dialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Detail view (dialog)</v-toolbar-title>
        <v-spacer />
        <v-btn
          text
          dark
          @click="$emit('update:dialogState', false)"
          title="Close dialog"
        >
          Close
        </v-btn>
      </v-toolbar>

      <DetailView
        v-if="response !== null && response.numFound === 1"
        :id="response.docs[0].id"
        :data-from-search="response"
        is-dialog
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import DetailView from "../DetailView";

export default {
  name: "DetailViewDialog",
  components: { DetailView },
  computed: {
    ...mapState("search", ["response"])
  }
};
</script>

<style scoped />
