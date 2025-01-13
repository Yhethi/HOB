import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    {
      id: 0,
      user_id: 0,
      descripcion: "",
      nombre: "",
      precio: 0,
      imagen_url:
        "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
      codigo_barras: "",
    },
  ],
  allProducts: [],
};

export const productsSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
      state.products = action.payload;
    },
    getProductFilter: (state, action) => {
      const textToFind = action.payload.toLowerCase();
      state.products = state.allProducts.filter((element) => {
        return (
          element.id.toString().includes(textToFind) ||
          element.codigo_barras.toString().includes(textToFind) ||
          element.nombre.toLowerCase().includes(textToFind)
        );
      });
    },
  },
});

export const { getProductFilter, setProducts } = productsSlice.actions;
export default productsSlice.reducer;
