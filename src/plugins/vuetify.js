import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@fortawesome/fontawesome-free/css/all.css";
import en from "vuetify/lib/locale/en";
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);
export default new Vuetify({
  icons: {
    iconfont: "fa",
  },
  lang: {
    locales: { en },
    current: "en",
  },
});
