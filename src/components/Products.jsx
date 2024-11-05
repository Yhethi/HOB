import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import "./../assets/styles/products.scss";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setZoomDynamic } from "../js/zoomImg";
import { addCartItem } from "../redux/slices/cartSlice";
import { Product } from "./Product";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useRef } from "react";

export const Products = () => {
  // Redux
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.products);
  // Redux
  const boxProductContainer = useRef(null);
  const showCart = useSelector((state) => state.cart.visible);

  useEffect(() => {
    if (boxProductContainer.current) {
      boxProductContainer.current.style.paddingRight = showCart
        ? "400px"
        : "0px";
    }
  }, [showCart]);

  useEffect(() => {
    setZoomDynamic();
  }, [allProducts]);

  return (
    <>
      <div className="boxProduct" ref={boxProductContainer}>
        <AnimatePresence>
          {allProducts.map((product, index) => (
            <Product key={product.id} product={product}></Product>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
