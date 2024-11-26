import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Login } from "./Login.jsx";
import { UserProfile } from "./UserProfile.jsx";
import useAuth from "../assets/hooks/useAuth.js";

const PrivateRoute = () => {
  const isLogged = useAuth();
  return isLogged ? <UserProfile /> : <Login />;
};

export default PrivateRoute;
