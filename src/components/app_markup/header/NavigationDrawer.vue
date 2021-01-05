<template>
  <v-navigation-drawer
    :value="drawer"
    @input="$emit('update:navigationDrawer', $event)"
    app
    right
    temporary
    dark
    style="z-index: 2050"
    color="primary"
  >
    <v-list dense>
      <v-subheader>ROUTES</v-subheader>
      <v-list-item v-for="item in routes" :key="item.text" :to="item.to">
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
    routes: [
      {
        text: "Home",
        to: "/",
        icon: "fas fa-home"
      },
      {
        text: "Search",
        to: "/search",
        icon: "fas fa-search"
      },
      { text: "About", to: "/about", icon: "fas fa-info-circle" },
      { text: "Access", to: "/access", icon: "fas fa-database" },
      { text: "Join", to: "/join", icon: "fas fa-signature" },
      { text: "Tutorial", to: "/tutorial", icon: "far fa-question-circle" },
      { text: "About the project (old)", to: "/project", icon: "fas fa-project-diagram" },
      { text: "About efg", to: "/efg", icon: "fas fa-info-circle" },
      {
        text: "Partners",
        to: "/partners_and_providers",
        icon: "far fa-handshake"
      },
      {
        text: "Links",
        to: "/links",
        icon: "fas fa-link"
      },
      {
        text: "Imprint",
        to: "/imprint",
        icon: "fas fa-stamp"
      }
    ]
  })
};
</script>

<style scoped></style>
