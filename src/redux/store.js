import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import loadingSlice from "./slice/loadingSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    loading: loadingSlice,
  },
});

export default store;
