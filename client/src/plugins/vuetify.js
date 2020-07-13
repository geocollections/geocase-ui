import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
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
        meteorite: "#607D8B"
      }
    }
  },
  icons: {
    iconfont: "fa"
  }
});
