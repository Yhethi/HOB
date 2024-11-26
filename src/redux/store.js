import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productsSlice.js";
import cartReducer from "./slices/cartSlice";
import sidebarReducer from "./slices/sidebarSlice.js";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    cart: cartReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
  },
});
