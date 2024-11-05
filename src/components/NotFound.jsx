import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/notFound.scss";
import { BackgroundAnimated } from "./BackgroundAnimated";
import notFound from "../assets/images/NotFound/notFound.png";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    <>
      <BackgroundAnimated />
      <div className="not-found">
        <div className="not-found__content">
          <img
            src={notFound}
            alt="404 Not Found"
            className="not-found__image"
          />
          <h1 className="not-found__title">
            4<span className="not-found__zero">0</span>4
          </h1>
          <p className="not-found__message">
            Esa URL no existe por favor vuelve al principio dando click al boton de aca abajo
          </p>
          <button onClick={goBack} className="not-found__button">
            Go Back Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
