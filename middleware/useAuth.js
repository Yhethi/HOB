import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loginUser, logoutUser } from "../src/redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        dispatch(logoutUser());
        return;
      }

      try {
        const response = await axios.post("/api/auth/validateToken", { token });
        if (response.data.success) {
          dispatch(
            loginUser({
              token,
              user: response.data.user,
            })
          );
        } else {
          dispatch(logoutUser());
          localStorage.removeItem("authToken");
        }
      } catch (err) {
        console.error("Error al validar el token:", err);
        dispatch(logoutUser());
        localStorage.removeItem("authToken");
      }
    };

    validateToken();
  }, [dispatch]);

  return isLogged;
};

export default useAuth;
