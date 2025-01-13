import React from "react";
import { useParams } from "react-router-dom";
import Loader from "./tools/Loader";
import { BackgroundAnimated } from "./BackgroundAnimated";
import { Header } from "./Header";
import { Cart } from "./Cart";
import PriceFetcher from "./tools/PriceFetcher";
import { Products } from "./Products";

const Tienda = () => {
  const { id_del_usuario } = useParams();
  return (
    <div className="global__container">
      <Loader />
      <BackgroundAnimated />
      <Header />
      <Products userToGet={id_del_usuario} />
      <Cart />
      <PriceFetcher />
    </div>
  );
};

export default Tienda;
