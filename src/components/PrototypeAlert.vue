<template>
  <v-alert
    border="left"
    elevation="2"
    colored-border
    color="info"
    icon="fas fa-window-maximize"
  >
    This website is a <b>prototype</b> of a new GeoCASe application (<a
      href="http://www.geocase.eu/"
      title="http://www.geocase.eu/"
      target="GeocaseWindow"
      rel="noopener noreferrer"
      >current one</a
    >) to test data flow and new features.
  </v-alert>
</template>

<script>
export default {
  name: "PrototypeAlert",
};
</script>

<style scoped />
