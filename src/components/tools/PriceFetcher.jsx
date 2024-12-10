// src/components/PriceFetcher.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setRateCOP,
  setRateUSD,
  setRateVES,
} from "../../redux/slices/cartSlice";

const PriceFetcher = () => {
  const [refreshPrice, setRefreshPrice] = useState(false);
  const isDev = import.meta.env.VITE_IS_DEV;
  const bsExtra = parseFloat(import.meta.env.VITE_VES_EXTRA_VALUE);
  const copExtra = parseFloat(import.meta.env.VITE_COP_EXTRA_VALUE);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  async function fetchCustomRate(userId) {
    try {
      const response = await axios.get("/api/customRate", {
        params: { userId },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener los custom rates:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  useEffect(() => {
    let interval;
    const fetchPrice = async () => {
      let valueVes;
      let valueCop;
      let valueUsd = 1;
      try {
        const is_custom_rate = user.userSettings?.is_custom_rate;
        if (is_custom_rate === 1) {
          const customRates = await fetchCustomRate(user.id);

          valueVes = customRates.usd_to_bolivares;
          valueCop = customRates.usd_to_pesos;
          valueUsd = customRates.usd;
        } else if (is_custom_rate === 0) {
          const { data } = await axios.get("/api/prices");
          valueVes = data.priceVES + bsExtra;
          valueCop = data.priceCOP - copExtra;
        }
      } catch (error) {
        valueVes = 55.0 + bsExtra;
        valueCop = 4274.99 - copExtra;
      }

      let precioVes = parseFloat(valueVes);
      let precioCop = parseFloat(valueCop);
      let precioUsd = parseFloat(valueUsd);

      if (!isNaN(precioVes) && !isNaN(precioCop) && !isNaN(precioUsd)) {
        console.log("DATAS: ", precioVes, precioCop, precioUsd);

        dispatch(setRateVES(precioVes));
        dispatch(setRateCOP(precioCop));
        dispatch(setRateUSD(precioUsd));
      } else {
        console.error("Invalid price data:", precioVes, precioCop, precioUsd);
      }
    };

    fetchPrice();

    interval = setInterval(() => {
      if (user.userSettings?.is_custom_rate === 0) {
        setRefreshPrice((prev) => !prev);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshPrice, user]);

  return <></>;
};

export default PriceFetcher;

// async function getVEStoCOPRate() {

// }
