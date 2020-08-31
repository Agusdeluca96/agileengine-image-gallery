import { AuthService } from "@/services/auth.service";

const state = {
  token: null
};

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  }
};

export const actions = {
  async fetchToken({ commit }) {
    const { data, status } = await AuthService.auth();
    if (status === 200) {
      commit("SET_TOKEN", data.token);
    }
  }
};

export const auth = {
  namespaced: true,
  state,
  actions,
  mutations
};
