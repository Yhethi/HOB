// src/components/PriceFetcher.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBinanceCOP, setBinanceVES } from "../../redux/slices/cartSlice";

const PriceFetcher = () => {
  const [refreshPrice, setRefreshPrice] = useState(false);
  const isDev = import.meta.env.VITE_IS_DEV;
  const bsExtra = parseFloat(import.meta.env.VITE_VES_EXTRA_VALUE);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        let valueVes;
        let valueCop;

        if (isDev === "true") {
          // const { data } = await axios.get("http://localhost:5000/api/pricesVes");
          valueVes = {
            price: "44.000",
          };
        } else {
          const dataVes = await axios.get("/api/pricesVes").data;
          const dataCop = await axios.get("/api/pricesCop").data;
          valueVes = dataVes;
          valueCop = dataCop;
        }
        let dataVes = valueVes;

        let precioVes = parseFloat(dataVes.price);
        let precioCop = parseFloat(dataCop.price);

        if (!isNaN(precioVes) && !isNaN(precioCop)) {
          let suma = precioVes + bsExtra;
          dispatch(setBinanceVES(suma));
          dispatch(setBinanceCOP(precioCop));
        } else {
          console.error("Invalid price data:", dataVes.price);
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
