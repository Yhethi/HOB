import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Products } from "./components/Products";
import { BackgroundAnimated } from "./components/BackgroundAnimated";
import { useDispatch, useSelector } from "react-redux";
import { Cart } from "./components/Cart";
import PriceFetcher from "./components/tools/PriceFetcher";
import Loader from "./components/tools/Loader";
import { fetchUserData } from "./redux/actions/fetchUserData";
import socket from "./../socket";
import "./styles/main.scss";
import { Outlet, useLocation } from "react-router-dom";

function InitialApp() {
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

  const hideComponents = shouldHideComponents();

  return (
    <div>
      <Header />
      <BackgroundAnimated />
      <Products userToGet={null} />
      <Cart />
      <PriceFetcher />
    </div>
  );
}

export default InitialApp;
// Test