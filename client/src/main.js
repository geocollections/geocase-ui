import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "leaflet/dist/leaflet.css";

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
