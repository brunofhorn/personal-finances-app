import axios from "axios";
import { Platform } from "react-native";
import { AppError } from "../helpers/AppError";
import { addTokenToRequest } from "../helpers/axios.helper";

const baseURL = Platform.select({
  ios: "http://localhost:3001",
  android: "http://10.0.2.2:3001",
});

export const personalFinances = axios.create({
  baseURL,
});

addTokenToRequest(personalFinances)

personalFinances.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    }

    return Promise.reject(new AppError("Falha na requisição."))
  }
);
