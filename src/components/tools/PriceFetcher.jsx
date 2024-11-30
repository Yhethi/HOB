// src/components/PriceFetcher.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBinanceVES } from "../../redux/slices/cartSlice";

const PriceFetcher = () => {
  const [refreshPrice, setRefreshPrice] = useState(false);
  const isDev = import.meta.env.VITE_IS_DEV;
  const bsExtra = parseFloat(import.meta.env.VITE_VES_EXTRA_VALUE);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        let value;

        if (isDev === "true") {
          // const { data } = await axios.get("http://localhost:5000/api/prices");
          value = {
            price: "44.000",
          };
        } else {
          const { data } = await axios.get("/api/prices");
          value = data;
        }
        let data = value;

        let precio = parseFloat(data.price);

        if (!isNaN(precio)) {
          // console.log("Precio Actual Binance: ",precio);
          // console.log("Se le añaden: ",bsExtra);
          let suma = precio + bsExtra;
          // console.log("Total suma: ", suma.toFixed(2));
          dispatch(setBinanceVES(suma));
        } else {
          console.error("Invalid price data:", data.price);
        }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    fetchPrice();

    // Opcional: Actualiza el precio cada 10 segundos
    const interval = setInterval(() => {
      setRefreshPrice((prev) => !prev);
    }, 10000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [refreshPrice]);

  return <></>;
};

export default PriceFetcher;

// async function getVEStoCOPRate() {

// }
