import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // console.log("Payload recibido:", action.payload);
      state.isLogged = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("authToken", action.payload.token);
    },
    logoutUser: (state) => {
      state.isLogged = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
