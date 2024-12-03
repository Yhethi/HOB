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
import { setProducts } from "../redux/slices/productsSlice";
import { store } from "../redux/store";
import { testProducts } from "../test/listProducts";
import { setIsLoading } from "../redux/slices/loaderSlice";

export const Products = () => {
  // Redux
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.products);
  // Redux
  const boxProductContainer = useRef(null);
  const showCart = useSelector((state) => state.cart.visible);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(setIsLoading(true));
    if (user) {
      try {
        fetch(`/api/productos?userId=${user.id}`)
          .then((response) => response.json())
          .then((data) => dispatch(setProducts(data)))
          .catch((error) => console.error("Error fetching productos:", error));
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          dispatch(setIsLoading(false));
        }, 500);
      }
    } else {
      dispatch(setProducts(testProducts));
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 500);
    }
  }, [user, dispatch]);
  const [prevWidth, setPrevWidth] = useState(window.innerWidth);

  useEffect(() => {
    const currentWidth = window.innerWidth;
    if (boxProductContainer.current) {
      if (currentWidth <= 768) {
        boxProductContainer.current.style.transform = showCart
          ? "translateX(-100%)"
          : "translateX(0%)";
      }
    }
    if (currentWidth > 768) {
      boxProductContainer.current.style.paddingRight = showCart
        ? "400px"
        : "0px";
    }
  }, [showCart]);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth > 768 && currentWidth <= 768) {
        boxProductContainer.current.style.transform = showCart
          ? "translateX(-100%)"
          : "translateX(0%)";
        boxProductContainer.current.style.paddingRight = showCart
          ? "0px"
          : "0px";
      } else if (prevWidth <= 768 && currentWidth > 768) {
        boxProductContainer.current.style.paddingRight = showCart
          ? "400px"
          : "0px";
        boxProductContainer.current.style.transform = showCart
          ? "translateX(0%)"
          : "translateX(0%)";
      }
      setPrevWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, prevWidth]);

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
