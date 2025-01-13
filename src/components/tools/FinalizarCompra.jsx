import React from "react";
import "../../assets/styles/tools/FinalizarCompra.scss";
import { clearCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../../socket";

export const FinalizarCompra = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.products);
  const totales = useSelector((state) => state.cart.totales);

  const handleFinalizar = () => {
    const productNames = cartItems.map(
      (item) => `${item.nombre} x${item.cantidad}`
    );

    // Enviar evento al servidor
    socket.emit("finalizarCompra", {
      buyerId: 3, // ID del comprador
      cartProducts: productNames,
      totals: totales,
    });

    alert(
      `----Gracias por tu compra----\nHas adquirido:\n${productNames.join(
        ",\n"
      )}\n\nPor un valor de:\nBs. ${totales.bolivares.toFixed(2)}\nCop ${
        Math.ceil(totales.pesos / 100) * 100
      }\n$ ${totales.dolares.toFixed(2)}`
    );
    dispatch(clearCart());
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  //   <span>BS.{totales.bolivares.toFixed(2)}</span>
  //   <span>Cop {Math.ceil(totales.pesos / 100) * 100}</span>
  //   <span>$ {totales.dolares.toFixed(2)}</span>

  return (
    <button className="cssbuttons-io" onClick={handleFinalizar}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          className="currentColor"
        >
          <path d="M320-240h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm200-30h200v-60H520v60Zm0-100h200v-60H520v60Zm44-152 56-56 56 56 42-42-56-58 56-56-42-42-56 56-56-56-42 42 56 56-56 58 42 42Zm-314-70h200v-60H250v60Zm-50 472q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </svg>
        Finalizar Compra
      </span>
    </button>
  );
};
