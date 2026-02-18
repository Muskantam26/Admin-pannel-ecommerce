import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userId: null,
  role: null,
  name: null,
  email: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { token, userId, role, name, email } = action.payload;

      state.token = token;
      state.userId = userId;
      state.role = role;
      state.name = name;
      state.email = email;
      state.isLoggedIn = true;
    },

    logoutUser(state) {
      state.token = null;
      state.userId = null;
      state.role = null;
      state.name = null;
      state.email = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
