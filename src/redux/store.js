import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productsSlice.js";
import sidebarReducer from "./slices/sidebarSlice.js";
import authReducer from "./slices/authSlice.js";
import loaderReducer from "./slices/loaderSlice.js";
import darkModeReducer from "./slices/darkModeSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
    loader: loaderReducer,
    darkMode: darkModeReducer,
  },
});
