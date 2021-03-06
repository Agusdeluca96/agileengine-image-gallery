import Vue from "vue";
import App from "./App.vue";
import { store } from "./store";
import { ApiService } from "./services/api.service";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";

Vue.component("v-icon", Icon);

Vue.config.productionTip = false;

ApiService.init();

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
