import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Products } from "./components/Products";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/tools/Loader";
import { fetchUserData } from "./redux/actions/fetchUserData";
import "./styles/main.scss";
import { Outlet, useLocation } from "react-router-dom";
import { setIsLoading } from "./redux/slices/loaderSlice";

const hideComponentsInRoutes = ["/login", "/register", "/perfil"];
const shouldHideComponents = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return hideComponentsInRoutes.some((path) => {
    const pathRegex = new RegExp(`^${path.replace(/:[^/]+/g, "[^/]+")}$`);
    return pathRegex.test(currentPath);
  });
};

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.loader.isLoading);
  useEffect(() => {
    dispatch(fetchUserData());
    if (!isLoading) {
      dispatch(setIsLoading(true));
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 500);
    }
  }, []);

  const hideComponents = shouldHideComponents();

  return (
    <div>
      <Loader />
      {!hideComponents && (
        <>
          <Header />
          <Products userToGet={null} />
        </>
      )}
      <Outlet />
    </div>
  );
}

export default App;
