import axios from "axios";
import { API_ENDPOINT } from "./endpoints";

axios.interceptors.request.use(
  function (config) {
    config.headers["Custom-Language"] = "en";
    // config.baseURL = process.env.REACT_APP_BASE_URL;
    config.baseURL = API_ENDPOINT;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
};
