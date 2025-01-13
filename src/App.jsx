import React, { useEffect, useState } from "react";
import "./assets/styles/App.scss";
import { Header } from "./components/Header";
import { Products } from "./components/Products";
import { BackgroundAnimated } from "./components/BackgroundAnimated";
import { useDispatch, useSelector } from "react-redux";
import { Cart } from "./components/Cart";
import PriceFetcher from "./components/tools/PriceFetcher";
import Loader from "./components/tools/Loader";
import { fetchUserData } from "./redux/actions/fetchUserData";
import socket from "./../socket";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  useEffect(() => {
    if (user) {
      if (user.u_nivel === 2) {
        socket.emit("registerUser", user.id);
        socket.on("newNotification", (data) => {
          alert(`Nueva notificación:\n${data.message}`);
        });
      }
    }
    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <div className="global__container">
      <Loader />
      <BackgroundAnimated />
      <Header />
      <Products userToGet={null} />
      <Cart />
      <PriceFetcher />
    </div>
  );
}

export default App;
