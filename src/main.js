import Vue from "vue";
import App from "@/App";
import router from "@/router/index";
import store from "@/store";
import VueIziToast from "vue-izitoast";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "izitoast/dist/css/iziToast.min.css";
import "animate.css";
import vuetify from "@/plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VueIziToast);

new Vue({
  router,
  vuetify,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
