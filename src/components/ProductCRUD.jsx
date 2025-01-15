import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";

const ProductCRUD = ({ closeModal }) => {
  //   const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  //   const products = useSelector((state) => state.products.products);
  const { products } = useProducts();
  console.log("Here-products", products);
  const API_URL = "/api/productos";

  // Fetch de productos cuando el modal se abra

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(API_URL, newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: "" }); // Limpia el formulario
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setProducts(
        products.map((product) => (product.id === id ? response.data : product))
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="product-crud__container">
      <h2>Manage Products</h2>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cod. Barra</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {
    "id": 1,
    "codigo_barras": "1234567890123",
    "nombre": "Producto A",
    "descripcion": "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from ",
    "precio": 15,
    "imagen_url": "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
    "user_id": 4,
    "cantidad": 100
} */}

          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.codigo_barras}</td>
              <td>
                <img className="table__img" src={product.imagen_url} alt={product.imagen_url} />
              </td>
              <td>{product.nombre}</td>
              <td>{product.precio}</td>
              <td>{product.cantidad}</td>
              <td>
                <div className="d-flex-center">
                  <button
                    onClick={() =>
                      handleUpdateProduct(product.id, {
                        name: "Updated Product",
                        price: product.price,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex-center">
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default ProductCRUD;
