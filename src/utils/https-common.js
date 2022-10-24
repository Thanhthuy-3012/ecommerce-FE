import axios from "axios";
import { URLS, CONSTANTS } from "../utils";

const requestServer = axios.create({
  baseURL: URLS.BASE_URL_SERVER,
  timeout: 600000,
  headers: {
    "Content-type": "application/json",
  },
});

requestServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONSTANTS.TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete requestServer.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export const API = {
  requestServer,
};
