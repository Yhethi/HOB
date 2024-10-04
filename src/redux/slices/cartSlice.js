import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codigo_barras: "",
  descripcion: "",
  id: 0,
  imagen_url:
    "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
  nombre: "",
  usuario_id: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action) => {
      const { id, codigo_barras, descripcion, imagen_url, nombre, usuario_id } =
        action.payload;
      state.push({
        id: id,
        usuario_id: usuario_id,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen_url: imagen_url,
        codigo_barras: codigo_barras,
      });
    },
  },
});

export const { addCartItem } = cartSlice.actions;
export default cartSlice.reducer;
