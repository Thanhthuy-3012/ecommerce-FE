import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import i18n from "./i18n";
import AdminDashboardLayout from "./views/layouts/admin/dashboard/index.vue";
import AdminBaseLayout from "./views/layouts/admin/default/index.vue";
import ShopDashboardLayout from "./views/layouts/shop/dashboard/index.vue";
import ShopBaseLayout from "./views/layouts/shop/default/index.vue";
import "./assets/scss/main.scss";
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
window.toastr = require('toastr')
import moment from "moment";

Vue.use(VueToastr2)

Vue.component("dashboard-layout", AdminDashboardLayout);
Vue.component("base-layout", AdminBaseLayout);
Vue.component("shop-dashboard-layout", ShopDashboardLayout);
Vue.component("shop-base-layout", ShopBaseLayout);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();
Vue.config.productionTip = false;

Vue.filter("fomartDate", function (date) {
  if (date) {
    return moment(new Date(date)).format('YYYY/MM/DD');
  }
});

new Vue({
  router,
  vuetify,
  pinia,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
