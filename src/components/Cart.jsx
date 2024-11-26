import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/cart.scss";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import {
  addCartItem,
  additionCartItem,
  deleteCartItem,
  setShowCart,
  subtractCartItem,
} from "../redux/slices/cartSlice";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbShoppingCart } from "react-icons/tb";
import AnimatedButton from "./tools/AnimatedButton";

export const Cart = () => {
  const showCart = useSelector((state) => state.cart.visible);
  const dispatch = useDispatch();
  const cartContainerRef = useRef(null);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    if (cartContainerRef.current) {
      cartContainerRef.current.style.transform = showCart
        ? "translateX(0)"
        : "translateX(1500px)";
    }
  }, [showCart]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        dispatch(setShowCart(false));
      } else {
        dispatch(setShowCart(true));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const toggleShowCart = () => {
    dispatch(setShowCart(!showCart));
  };
  const cartItems = useSelector((state) => state.cart.products);

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

  useEffect(() => {
    console.log("Estado del carrito:", cartItems);
  }, [cartItems]);

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
                          className="set_quantity"
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
                          className="set_quantity"
                          onClick={() => {
                            handleAddOrSubtract(item.id, "add");
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* <div className="cart__barcode">#: {item.codigo_barras}</div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="contenedor__totales">
        <div className="totales">
          <span>BS.1234</span>
          <span>Cop 1234</span>
          <span>$ 1234</span>
        </div>
        <AnimatedButton />
      </div>
    </div>
  );
};
