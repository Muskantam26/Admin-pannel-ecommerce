import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, removeToken, saveToken } from "../authStorage";

const initialState = {
  token: null,
  userId: null,
  role: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { token, userId, role } = action.payload;

      state.token = token;
      state.userId = userId;
      state.role = role;
      state.isLoggedIn = true;

      saveToken(userId, token, role);
    },

    logoutUser(state) {
      removeToken();

      state.token = null;
      state.userId = null;
      state.role = null;
      state.isLoggedIn = false;
    },

    loadUserFromStorage(state) {
      const user = getCurrentUser();

      if (user?.token && user?.userId) {
        state.token = user.token;
        state.userId = user.userId;
        state.role = user.role;
        state.isLoggedIn = true;
      }
    },
  },
});

export const { loginUser, logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
