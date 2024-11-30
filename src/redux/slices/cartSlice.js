import { createSlice } from "@reduxjs/toolkit";
import { calculateTotals } from "../../assets/utils/cartUtils";

const initialState = {
  products: [],
  totales: {
    bolivares: 0.0,
    pesos: 0.0,
    dolares: 0.0,
  },
  binanceVES: 0,
  binanceCOP: 0,
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
        {
          bolivarRate: 35.5,
          pesoRate: 4000,
        },
        state.binanceVES,
        state.binanceCOP
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
        {
          bolivarRate: 35.5,
          pesoRate: 4000,
        },
        state.binanceVES,
        state.binanceCOP
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
        {
          bolivarRate: 35.5,
          pesoRate: 4000,
        },
        state.binanceVES,
        state.binanceCOP
      );
    },
    setBinanceVES: (state, action) => {
      state.binanceVES = action.payload;
    },
    setBinanceCOP: (state, action) => {
      state.binanceCOP = action.payload;
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
        {
          bolivarRate: 35.5,
          pesoRate: 4000,
        },
        state.binanceVES,
        state.binanceCOP
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
  setBinanceVES,
  setBinanceCOP,
  deleteCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
