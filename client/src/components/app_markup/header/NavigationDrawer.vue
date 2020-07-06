<template>
  <v-navigation-drawer
    :value="drawer"
    @input="$emit('update:drawer', $event)"
    app
    temporary
    dark
    style="z-index: 2001"
    color="primary"
  >
    <v-list dense>
      <v-subheader>EXTERNAL RESOURCES</v-subheader>
      <v-list-item
        v-for="item in externalResources"
        :key="item.text"
        :href="item.url"
        target="ExternalResourceWindow"
        :title="item.text"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    externalResources: [
      {
        icon: "fas fa-database",
        text: "GeoCASe",
        url: "http://geocase.eu"
      },
      {
        icon: "fab fa-github",
        text: "ABCD-EFG standard GitHub",
        url: "https://github.com/tdwg/efg"
      },
      {
        icon: "far fa-hand-paper",
        text: "ABCD-EFG standard",
        url: "https://www.tdwg.org/community/esp/efg/"
      },
      {
        icon: "fas fa-pager",
        text: "BioCASe portal",
        url: "https://www.biocase.org/"
      },
      {
        icon: "fas fa-leaf",
        text: "GBIF portal",
        url: "https://www.gbif.org/"
      }
    ]
  })
};
</script>

<style scoped>
</style>
