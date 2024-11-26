import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
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
    },
    deleteCartItem: (state, action) => {
      const existingProductIndex = state.products.findIndex(
        (product) => product.id === action.payload
      );
      if (existingProductIndex !== -1) {
        state.products.splice(existingProductIndex, 1);
      }
    },
  },
});

export const {
  addCartItem,
  setShowCart,
  setPulseCart,
  additionCartItem,
  subtractCartItem,
  deleteCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
