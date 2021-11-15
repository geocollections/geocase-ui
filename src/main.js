import Vue from "vue";
import App from "@/App";
import router from "@/router/index";
import store from "@/store";
import vuetify from "@/plugins/vuetify";
import VueIziToast from "vue-izitoast";
import i18n from "@/i18n";
import VueMeta from "vue-meta";

import "izitoast/dist/css/iziToast.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "animate.css";

Vue.use(VueIziToast);
Vue.use(VueMeta);

Vue.config.productionTip = false;

// Gets preferred language from store (fallback is en)
i18n.locale = store?.state?.settings?.language || "en";

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
