import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { TbShoppingCart } from "react-icons/tb";
import {
  addCartItem,
  setPulseCart,
  setShowCart,
} from "../redux/slices/cartSlice";
import { motion } from "framer-motion";

export const Product = ({ product }) => {
  const [cantidad, setCantidad] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.products);

  const incrementQuantity = () => {
    setCantidad((prevCantidad) => prevCantidad + 1);
  };

  const decrementQuantity = () => {
    setCantidad((prevCantidad) => (prevCantidad > 1 ? prevCantidad - 1 : 1));
  };
  const showCart = useSelector((state) => state.cart.visible);
  const isPulsing = useSelector((state) => state.cart.pulse);

  const handleToCart = (id, cantidad) => {
    const elementToAdd = allProducts.find((element) =>
      element.id.toString().includes(id)
    );
    if (elementToAdd) {
      dispatch(addCartItem({ ...elementToAdd, cantidad: parseInt(cantidad) }));
      dispatch(setPulseCart(true));
      setTimeout(() => {
        dispatch(setPulseCart(false));
      }, 500);
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));
  const handleImageClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      className="card__product"
      layout
      initial={{ opacity: 1, y: 3 }}
      animate={{ opacity: 1, y: 3 }}
      exit={{ opacity: 1, y: -3 }}
      transition={{ duration: 0.1, linear: true }}
    >
      <div className="card__product__internal">
        <div className="card_image">
          <img
            src={product.imagen_url}
            // src="https://images-na.ssl-images-amazon.com/images/I/41hbmiP+77L._AC_UL450_SR450,320_.jpg"
            alt={product.descripcion}
            onClick={() => {
              handleToCart(product.id, cantidad);
            }}
          />
        </div>
        <div className="card__product__data">
          <div className="card__product__header">
            <h2>{product.nombre}</h2>
          </div>
          <div className="card_product_price">
            <p>${product.precio}</p>
          </div>
          <div className="card__buttons">
            <div className="quantity-selector">
              <label>Cantidad: </label>
              <div className="internal_quantity">
                <button
                  className="set_quantity resta"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button
                  className="set_quantity suma"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="submit__button"
              onClick={() => handleToCart(product.id, cantidad)}
            >
              <TbShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
