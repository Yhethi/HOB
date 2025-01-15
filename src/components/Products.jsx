import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setZoomDynamic } from "../js/zoomImg";
import { Product } from "./Product";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { setProducts } from "../redux/slices/productsSlice";
import { testProducts } from "../test/listProducts";
import { setIsLoading } from "../redux/slices/loaderSlice";

export const Products = ({ userToGet }) => {
  // Redux
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.products);
  // Redux
  const boxProductContainer = useRef(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(setIsLoading(true));
    if (user) {
      try {
        if (userToGet) {
          fetch(`/api/productos?userId=${userToGet}`)
            .then((response) => response.json())
            .then((data) => dispatch(setProducts(data)))
            .catch((error) =>
              console.error("Error fetching productos:", error)
            );
        } else {
          fetch(`/api/productos?userId=${user.id}`)
            .then((response) => response.json())
            .then((data) => dispatch(setProducts(data)))
            .catch((error) =>
              console.error("Error fetching productos:", error)
            );
        }
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          dispatch(setIsLoading(false));
        }, 1000);
      }
    } else {
      dispatch(setProducts(testProducts));
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 1000);
    }
  }, [user, dispatch]);
  const [prevWidth, setPrevWidth] = useState(window.innerWidth);

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
