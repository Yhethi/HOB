import { createSlice } from "@reduxjs/toolkit";
import { calculateTotals } from "../../assets/utils/cartUtils";

const initialState = {
  products: [],
  totales: {
    bolivares: 0.0,
    pesos: 0.0,
    dolares: 0.0,
  },
  rateVES: 0,
  rateCOP: 0,
  rateUSD: 0,
  visible: false,
  pulse: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setShowCart: (state, action) => {
      state.visible = action.payload;
    },
    setPulseCart: (state, action) => {
      state.pulse = action.payload;
    },
    addCartItem: (state, action) => {
      const {
        id,
        codigo_barras,
        descripcion,
        precio,
        imagen_url,
        nombre,
        usuario_id,
        cantidad,
      } = action.payload;

      const existingProductIndex = state.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].cantidad += cantidad;
      } else {
        state.products.push({
          id,
          codigo_barras,
          descripcion,
          precio,
          imagen_url,
          nombre,
          usuario_id,
          cantidad,
        });
      }

      state.totales = calculateTotals(
        state.products,
        state.rateVES,
        state.rateCOP,
        state.rateUSD
      );
    },
    additionCartItem: (state, action) => {
      const { id, cantidad } = action.payload;
      const existingProductIndex = state.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].cantidad = cantidad;
      } else {
        state.products.push({ id, cantidad });
      }
      state.totales = calculateTotals(
        state.products,
        state.rateVES,
        state.rateCOP,
        state.rateUSD
      );
    },
    subtractCartItem: (state, action) => {
      const { id, cantidad } = action.payload;
      const existingProductIndex = state.products.findIndex(
        (product) => product.id === id
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].cantidad -= cantidad;
        if (state.products[existingProductIndex].cantidad == 0) {
          state.products.splice(existingProductIndex, 1);
        }
      }
      state.totales = calculateTotals(
        state.products,
        state.rateVES,
        state.rateCOP,
        state.rateUSD
      );
    },
    setRateVES: (state, action) => {
      state.rateVES = action.payload;
    },
    setRateCOP: (state, action) => {
      state.rateCOP = action.payload;
    },
    setRateUSD: (state, action) => {
      state.rateUSD = action.payload;
    },
    getActualCart: (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.products = action.payload;
      }
    },
    getActualTotals: (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.totales = calculateTotals(
          state.products,
          state.rateVES,
          state.rateCOP,
          state.rateUSD
        );
      }
    },
    clearCart: (state) => {
      state.products = []; // Limpia el estado de Redux
    },
    deleteCartItem: (state, action) => {
      const existingProductIndex = state.products.findIndex(
        (product) => product.id === action.payload
      );
      if (existingProductIndex !== -1) {
        state.products.splice(existingProductIndex, 1);
      }
      state.totales = calculateTotals(
        state.products,
        state.rateVES,
        state.rateCOP,
        state.rateUSD
      );
    },
  },
});

export const {
  addCartItem,
  setShowCart,
  setPulseCart,
  additionCartItem,
  subtractCartItem,
  setRateVES,
  setRateCOP,
  setRateUSD,
  getActualCart,
  getActualTotals,
  clearCart,
  deleteCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
