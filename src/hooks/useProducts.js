import { useState, useEffect } from "react";
import { productService } from "../services/productService.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loaderSlice.js";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.isLoading);
  const fetchProducts = async () => {
    setIsLoading(true);
    dispatch(setIsLoading(true));
    const data = await productService.getAll(user.id);
    setProducts(data);
    dispatch(setIsLoading(false));
  };

  // const createProduct = async (product) => {
  //   const newProduct = await productService.create(product);
  //   setProducts([...products, newProduct]);
  // };

  // const updateProduct = async (product) => {
  //   const updatedProduct = await productService.update(product.id, product);
  //   setProducts(
  //     products.map((p) => (p.id === product.id ? updatedProduct : p))
  //   );
  // };

  // const deleteProduct = async (id) => {
  //   await productService.remove(id);
  //   setProducts(products.filter((p) => p.id !== id));
  // };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
