// import axios from "axios";
import { ImageService } from "@/services/image.service";

const state = {
  images: [],
  pagination: {
    page: null,
    pageCount: null,
    hasMore: null,
  },
  currentImage: null
};

export const mutations = {
  SET_IMAGES(state, images) {
    state.images = images.pictures;
    state.pagination.page = images.page;
    state.pagination.pageCount = images.pageCount;
    state.pagination.hasMore = images.hasMore;
  },
  SET_CURRENT_IMAGE(state, image) {
    state.currentImage = image;
  }
};

export const actions = {
  fetchImages({ commit, state }, page) {
    return ImageService.getPaginated(page ?? state.pagination.page)
      .then(({ data }) =>
        commit("SET_IMAGES", data)
      );
  },

  fetchImage({ commit }, id) {
    return ImageService.get(id)
      .then(({ data }) =>
        commit("SET_CURRENT_IMAGE", data)
      );
  },

  resetImage({ commit }) {
    return commit("SET_CURRENT_IMAGE", null)
  }
};

export const images = {
  namespaced: true,
  state,
  actions,
  mutations
};
