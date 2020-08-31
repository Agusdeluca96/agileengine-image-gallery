import { ApiService } from "./api.service";

export const AuthService = {
  auth: () => ApiService.post(`/auth`, { apiKey: "23567b218376f79d9415" })
};
