import React, { useEffect, useState } from "react";
import "../assets/styles/UpdateExchangeRatesModal.scss";
import { useDispatch } from "react-redux";
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
      await axios.patch("/api/updateCustomRateCheckBox", data);
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

  return (
    <div className="overlay">
      <div className="modal">
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
                <div style={{ "--angle": "30deg" }} className="particle"></div>
                <div style={{ "--angle": "60deg" }} className="particle"></div>
                <div style={{ "--angle": "90deg" }} className="particle"></div>
                <div style={{ "--angle": "120deg" }} className="particle"></div>
                <div style={{ "--angle": "150deg" }} className="particle"></div>
                <div style={{ "--angle": "180deg" }} className="particle"></div>
              </div>
            </div>
          </label>
        </div>
        <div className="field">
          <label htmlFor="usd_to_bolivares">USD a Bolívares:</label>
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
          <label htmlFor="usd_to_pesos">USD a Pesos:</label>
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
      </div>
    </div>
  );
};

export default UpdateExchangeRatesModal;
