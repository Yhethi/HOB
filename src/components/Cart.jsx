import React, { useEffect, useRef } from "react";
import "../assets/styles/cart.scss";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { deleteCartItem, setShowCart } from "../redux/slices/cartSlice";
import { FaRegTrashCan } from "react-icons/fa6";

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        dispatch(setShowCart(false)); 
      } else {
        dispatch(setShowCart(true));
      }
    };
    // Ejecuta la función una vez cuando el componente se monta
    handleResize();
    // Escucha los cambios de tamaño de pantalla
    window.addEventListener("resize", handleResize);
    // Limpia el evento al desmontar el componente
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
  return (
    <div className="cart__global" ref={cartContainerRef}>
      <div className="cart__close">
        <CloseIcon onClick={toggleShowCart} />
      </div>
      <div className="cart__container__cards">
        {cartItems.map((item) => {
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
                <div className="cart__barcode">
                  Código: {item.codigo_barras}
                </div>
                <div className="cart__description">{item.descripcion}</div>
                <div className="cart__price">
                  Precio: ${item.precio.toFixed(2)}
                </div>
                <div className="cart__quantity">Cantidad: {item.cantidad}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
