import appLogo from "../assets/appLogo.png";
import appFavicon from "../assets/appFavicon.png";
import axios from "axios";
import store from "../redux/store";
import { getCurrentUser } from "../redux/authStorage";

export const MainContent = {
  appName: "VEDANZO",
  appFullName: "VEDANZO",
  appLogo: appLogo,
  appFavicon: appFavicon,
  appURL: "https://www.psnft.space/",
  contactNo: "+919876543210",
  email: "info@psnft.space",
  address: "North Oak , Sanjauli , Shimla (HP) 171006",
  appDescription: "VEDANZO Marketplace",
};

export const backendConfig = {
  base: "http://192.168.1.4:3000/api/",
  origin: "http://192.168.1.4:3000/",
};

// https://cnfp6kct-1960.inc1.devtunnels.ms/

export const Axios = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
});
const getToken = getCurrentUser()?.token;
Axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token || getToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
