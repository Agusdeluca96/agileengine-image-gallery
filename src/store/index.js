import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'

import { auth } from "./auth.module";
import { images } from "./images.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    images,
  },
  plugins: [new VuexPersistence().plugin]
});
