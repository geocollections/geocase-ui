import Vue from "vue";
import App from "@/App";
import router from "@/router/index";
import store from "@/store";
import vuetify from "@/plugins/vuetify";
import VueIziToast from "vue-izitoast";
import VueI18n from "vue-i18n";

import "izitoast/dist/css/iziToast.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "animate.css";

Vue.use(VueIziToast);
Vue.use(VueI18n);

Vue.config.productionTip = false;

// Todo: Translations
/******************************
 *** TRANSLATION CODE START ***
 ******************************/

/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
