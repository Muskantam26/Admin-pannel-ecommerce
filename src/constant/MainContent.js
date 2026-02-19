import appLogo from "../assets/appLogo.png";
import appFavicon from "../assets/appFavicon.png";
import axios from "axios";
import store from "../redux/store";

export const MainContent = {
  appName: "VEDANZO",
  appFullName: "VEDANZO",
  appLogo: appLogo,
  appFavicon: appFavicon,
  appURL: "https://www.psnft.space",
  contactNo: "+919876543210",
  email: "info@psnft.space",
  address: "North Oak , Sanjauli , Shimla (HP) 171006",
  appDescription: "VEDANZO Marketplace",
};

export const backendConfig = {
  base: import.meta.env.VITE_API_BASE_URL,
  origin: import.meta.env.VITE_API_ORIGIN,
};

// https://cnfp6kct-1960.inc1.devtunnels.ms/

export const Axios = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
