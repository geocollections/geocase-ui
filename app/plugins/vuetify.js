import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { fa } from "vuetify/iconsets/fa";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#FFA000",
            secondary: "#607D8B",
            accent: "#82B1FF",
            error: "#FF5252",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FFC107",
            main: "#FFA000",
            fossil: "#8BC34A",
            mineral: "#E91E63",
            rock: "#03A9F4",
            meteorite: "#607D8B",
          },
        },
      },
    },
    defaults: {
      VMenu: { zIndex: 3000 },
      VDialog: { zIndex: 3000 },
      VTooltip: { zIndex: 3200 },
      VTextField: { variant: "outlined" },
    },
    icons: { defaultSet: "mdi", aliases, sets: { mdi, fa } },
  });
  nuxtApp.vueApp.use(vuetify);
});
