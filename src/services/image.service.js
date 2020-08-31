import { ApiService } from "./api.service";

export const ImageService = {
  getPaginated: (page = 1) => ApiService.query("/images", { page: page }),
  get: (imageId = "") => ApiService.get(`/images/${imageId}`)
};
