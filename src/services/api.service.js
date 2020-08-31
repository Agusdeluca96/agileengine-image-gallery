import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { store } from "@/store";

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;

    Vue.axios.interceptors.request.use(
      config => {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common["Authorization"] = "Bearer " + token;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    Vue.axios.interceptors.response.use(
      response => response,
      error => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
          return store.dispatch("auth/fetchToken").then(() => {
            error.config.headers["Authorization"] =
              "Bearer " + store.state.auth.token;
            error.config.baseURL = undefined;
            return Vue.axios.request(error.config);
          });
        }
      }
    );
  },

  query(resource, params) {
    return Vue.axios.get(resource, { params: params }).catch(error => {
      throw new Error(error);
    });
  },

  get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(error);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  }
};
