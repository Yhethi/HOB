import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Login } from "./Login.jsx";
import { UserProfile } from "./UserProfile.jsx";
import { fetchUserData } from "../redux/actions/fetchUserData.js";
import useAuth from "../../middleware/useAuth.js";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);
  const isLogged = useAuth();
  return isLogged ? <UserProfile /> : <Login />;
};

export default PrivateRoute;
