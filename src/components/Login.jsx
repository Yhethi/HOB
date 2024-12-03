import React, { useState } from "react";
import "../assets/styles/login.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../assets/hooks/useAuth";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { setProducts } from "../redux/slices/productsSlice";
import { setIsLoading } from "../redux/slices/loaderSlice";
import ParticlesBackground from "./tools/ParticlesBackground";
import { Header } from "./Header";
import { clearCart } from "../redux/slices/cartSlice";

export const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [toRegister, setToRegister] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await axios.post("/api/login", { email, password });
      localStorage.setItem("authToken", response.data.token);

      if (response.data.success) {
        dispatch(
          loginUser({
            token: response.data.token,
            user: response.data.user,
          })
        );
        fetch(`/api/productos?userId=${response.data.user.id}`)
          .then((response) => response.json())
          .then((data) => dispatch(setProducts(data)))
          .catch((error) => console.error("Error fetching productos:", error));
        dispatch(clearCart());
        localStorage.setItem("cartItems", JSON.stringify([]));
        navigate("/perfil");
      } else {
        dispatch(logoutUser());
        localStorage.removeItem("authToken");
        dispatch(setIsLoading(false));
      }
    } catch (err) {
      console.error(err.response?.data?.error || "Error desconocido");
      alert(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 500);
    }
  };

  return (
    <>
      <Header />
      <div className="center_form_login">
        <ParticlesBackground />
        <form
          className={`form_login ${toRegister && "toRegister"}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <p className="title">Iniciar sesión</p>
          <p className="message">
            Ingresa tus credenciales para acceder a la app.
          </p>

          <label>
            <input
              className="input"
              type="email"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Correo Electronico</span>
          </label>

          <label>
            <input
              className="input"
              type="password"
              placeholder=""
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Contraseña</span>
          </label>

          {error && <p className="error-message">{error}</p>}

          <button className="submit" type="submit">
            Iniciar Sesión
          </button>
          <p
            className="signin"
            onClick={() => {
              setToRegister(true);
              setTimeout(() => {
                navigate("/register");
              }, 500);
            }}
          >
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </form>
      </div>
    </>
  );
};
