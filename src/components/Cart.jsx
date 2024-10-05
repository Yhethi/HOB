import React, { useEffect } from "react";
import "../assets/styles/cart.scss";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { setShowCart } from "../redux/slices/cartSlice";
export const Cart = () => {
  const showCart = useSelector((state) => state.cart.visible);
  const dispatch = useDispatch();
  useEffect(() => {
    const cartContainer = document.querySelector(".cart__global");
    if (showCart) {
      cartContainer.style.transform = "translateX(0px)";
    } else {
      cartContainer.style.transform = "translateX(400px)";
    }
  }, [showCart]);
  const toggleShowCart = () => {
    dispatch(setShowCart(!showCart));
  };
  return (
    <div className="cart__global">
      <div className="cart__close">
        <CloseIcon onClick={toggleShowCart} />
      </div>
      <div className="cart__container__cards">
        <div className="cart__card">
          <div className="card__image">
            <img
              src="https://images-na.ssl-images-amazon.com/images/I/41hbmiP+77L._AC_UL450_SR450,320_.jpg"
              alt=""
            />
          </div>
          <div className="cart__title">test__title</div>
          <div className="card__quantity">0</div>
        </div>
        <div className="cart__card">
          <div className="card__image">
            <img
              src="https://images-na.ssl-images-amazon.com/images/I/41hbmiP+77L._AC_UL450_SR450,320_.jpg"
              alt=""
            />
          </div>
          <div className="cart__title">test__title</div>
          <div className="card__quantity">0</div>
        </div>
      </div>
    </div>
  );
};
