import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loaderSlice";
import axios from "axios";

const UpdateExchangeRatesModal = ({ isOpen, onClose, onSave, user }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const [exchangeRates, setExchangeRates] = useState({
    user_id: user?.id,
    usd_to_bolivares: user?.customRates.usd_to_bolivares || "",
    usd_to_pesos: user?.customRates.usd_to_pesos || "",
    usd: user?.customRates.usd || 1,
  });
  const [checkBoxRate, setCheckBoxRate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExchangeRates((prevRates) => ({
      ...prevRates,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    dispatch(setIsLoading(true));
    const data = {
      user_id: user.id,
      isCustomRate: checkBoxRate,
    };
    try {
      onSave(exchangeRates);
      await axios.patch("/api/customRate/updateCustomRateCheckBox", data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsLoading(false));
    }
    onClose();
  };

  useEffect(() => {
    setCheckBoxRate(user.userSettings?.is_custom_rate);
  }, []);
  const { rateVES, rateCOP } = useSelector((state) => state.cart);
  return (
    <div className="exchangeRate__container">
      <div className="overlay">
        <div className="modal_rates">
          <h2>Actualizar Tasa de Cambio</h2>
          <div className="flex_cosmic">
            <p>Habilitar Tasa Perzonalizada</p>
            <label className="cosmic-toggle">
              <input
                className="toggle"
                type="checkbox"
                checked={checkBoxRate}
                onChange={() => setCheckBoxRate(!checkBoxRate)}
              />
              <div className="slider">
                <div className="cosmos"></div>
                <div className="energy-line"></div>
                <div className="energy-line"></div>
                <div className="energy-line"></div>
                <div className="toggle-orb">
                  <div className="inner-orb"></div>
                  <div className="ring"></div>
                </div>
                <div className="particles">
                  <div
                    style={{ "--angle": "30deg" }}
                    className="particle"
                  ></div>
                  <div
                    style={{ "--angle": "60deg" }}
                    className="particle"
                  ></div>
                  <div
                    style={{ "--angle": "90deg" }}
                    className="particle"
                  ></div>
                  <div
                    style={{ "--angle": "120deg" }}
                    className="particle"
                  ></div>
                  <div
                    style={{ "--angle": "150deg" }}
                    className="particle"
                  ></div>
                  <div
                    style={{ "--angle": "180deg" }}
                    className="particle"
                  ></div>
                </div>
              </div>
            </label>
          </div>
          <div className="field">
            <label htmlFor="usd_to_bolivares">
              USD a Bolívares: {rateVES} (Recomendada)
            </label>
            <input
              type="number"
              id="usd_to_bolivares"
              name="usd_to_bolivares"
              value={exchangeRates.usd_to_bolivares}
              onChange={handleChange}
              readOnly={checkBoxRate ? false : true}
              className={!checkBoxRate ? "readonly" : ""}
            />
          </div>
          <div className="field">
            <label htmlFor="usd_to_pesos">
              USD a Pesos: {rateCOP} (Recomendada)
            </label>
            <input
              type="number"
              id="usd_to_pesos"
              name="usd_to_pesos"
              value={exchangeRates.usd_to_pesos}
              onChange={handleChange}
              readOnly={checkBoxRate ? false : true}
              className={!checkBoxRate ? "readonly" : ""}
            />
          </div>
          {/* <div className="field">
          <label htmlFor="usd">USD:</label>
          <input
            type="number"
            id="usd"
            name="usd"
            value={exchangeRates.usd}
            onChange={handleChange}
            readOnly={checkBoxRate ? false : true}
            className={!checkBoxRate ? "readonly" : ""}
          />
        </div> */}
          <div className="actions">
            <button className="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button" onClick={handleSave}>
              Guardar
            </button>
          </div>
          <div className="foot_letters">
            <p>
              La tasa no personalizada y recomendada es una referencia del
              estado actual del mercado de Binance
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.61 126.61">
              <g fill="#f3ba2f">
                <path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z" />
                <path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z" />
                <path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z" />
                <path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z" />
                <path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateExchangeRatesModal;
