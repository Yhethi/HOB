import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/cart.scss";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  addCartItem,
  additionCartItem,
  clearCart,
  deleteCartItem,
  getActualCart,
  getActualTotals,
  setShowCart,
  subtractCartItem,
} from "../redux/slices/cartSlice";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbShoppingCart } from "react-icons/tb";
import AnimatedButton from "./tools/AnimatedButton";
import { FinalizarCompra } from "./tools/FinalizarCompra";

export const Cart = () => {
  const showCart = useSelector((state) => state.cart.visible);
  const dispatch = useDispatch();
  const cartContainerRef = useRef(null);

  useEffect(() => {
    if (cartContainerRef.current) {
      cartContainerRef.current.style.transform = showCart
        ? "translateX(0)"
        : "translateX(1500px)";
    }
  }, [showCart]);
  const [prevWidth, setPrevWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth > 768 && currentWidth <= 768) {
        dispatch(setShowCart(false));
      } else if (prevWidth <= 768 && currentWidth > 768) {
        dispatch(setShowCart(true));
      }
      setPrevWidth(currentWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, prevWidth]);

  useEffect(() => {
    if (prevWidth < 768) {
      dispatch(setShowCart(false));
    } else {
      dispatch(setShowCart(true));
    }
  }, []);

  const toggleShowCart = () => {
    dispatch(setShowCart(!showCart));
  };
  const totales = useSelector((state) => state.cart.totales);
  const handleDeleteItem = (id) => {
    dispatch(deleteCartItem(id));
  };

  const getElementById = (id) => {
    const elementFounded = cartItems.find((element) =>
      element.id.toString().includes(id)
    );
    return elementFounded;
  };
  const handleAddOrSubtract = (id, type) => {
    let element = getElementById(id);
    if (element && type == "add" && element.cantidad >= 0) {
      dispatch(addCartItem({ ...element, cantidad: 1 }));
    } else if (element && type == "noAdd" && element.cantidad >= 1) {
      dispatch(subtractCartItem({ ...element, cantidad: 1 }));
    }
  };

  const handleInputChange = (e, id) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value <= 999) {
      dispatch(
        additionCartItem({
          id: id,
          cantidad: value || 0,
        })
      );
      if (value === 0) {
        handleDeleteItem(id);
      }
    }
  };
  const handleBlur = (id) => {
    const element = getElementById(id);
    if (element) {
      dispatch(
        additionCartItem({
          id: element.id,
          cantidad: element.cantidad,
        })
      );
    }
  };
  const cartItems = useSelector((state) => state.cart.products); // Asegúrate de usar el nombre correcto del estado

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch(getActualCart(savedCartItems));
    setTimeout(() => {
      dispatch(getActualTotals(savedCartItems));
    }, 100);
  }, [dispatch]);

  useEffect(() => {
    // console.log("Guardando carrito en localStorage: ", cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleEmptyCart = () => {
    dispatch(clearCart());
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  return (
    <div className="cart__global" ref={cartContainerRef}>
      <div className="cart__close">
        <CloseIcon onClick={toggleShowCart} />
      </div>
      {cartItems.length < 1 ? (
        <div className="empty__cart">
          <div className="empty__internal">
            <TbShoppingCart />
          </div>
        </div>
      ) : (
        <div className="cart_with_products">
          <div className="cart__container__cards">
            {cartItems.map((item, key) => {
              return (
                <div className="cart__card" key={item.id}>
                  <div
                    className="delete__button"
                    onClick={() => {
                      handleDeleteItem(item.id);
                    }}
                  >
                    <FaRegTrashCan />
                  </div>
                  <div className="card__image">
                    <img src={item.imagen_url} alt={item.nombre} />
                  </div>
                  <div className="cart__info">
                    <div className="cart__title">{item.nombre}</div>
                    {/* <div className="cart__description">{item.descripcion}</div> */}
                    <div className="card_data">
                      <div className="cart__price">
                        Precio: ${item.precio.toFixed(2)}
                      </div>
                      <div className="cantidad_container">
                        <label>Cantidad:</label>
                        <div className="buttons_cantidad">
                          <button
                            className="set_quantity resta"
                            onClick={() => {
                              handleAddOrSubtract(item.id, "noAdd");
                            }}
                          >
                            -
                          </button>
                          <input
                            className="cart__quantity"
                            max="999"
                            value={item.cantidad}
                            onChange={(e) => {
                              handleInputChange(e, item.id);
                            }}
                            onBlur={() => {
                              handleBlur(item.id);
                            }}
                          />
                          <button
                            className="set_quantity suma"
                            onClick={() => {
                              handleAddOrSubtract(item.id, "add");
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="contenedor__totales">
            <div className="totales">
              <span className="flex__vaciar__button">
                <button className="vaciar__button" onClick={handleEmptyCart}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                  <span>Vaciar Carrito</span>
                </button>
                Bs.
                {totales.bolivares.toFixed(2)}
              </span>
              <span>Cop. {Math.ceil(totales.pesos / 100) * 100}</span>
              <span>$. {totales.dolares.toFixed(2)}</span>
            </div>
            {/* <AnimatedButton /> */}
            <FinalizarCompra />
          </div>
        </div>
      )}
    </div>
  );
};
