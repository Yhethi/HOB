import React, { useState } from "react";
import "../assets/styles/login.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../assets/hooks/useAuth";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { setProducts } from "../redux/slices/productsSlice";

export const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", { email, password });
      localStorage.setItem("authToken", response.data.token); // Guarda el token en localStorage
      console.log("data:", response.data);
      if (response.data.success) {
        dispatch(
          loginUser({
            token: response.data.token, // Token del backend
            user: response.data.user, // Usuario devuelto por el backend
          })
        );
        fetch(`/api/productos?userId=${response.data.user.id}`)
          .then((response) => response.json())
          .then((data) => dispatch(setProducts(data)))
          .catch((error) => console.error("Error fetching productos:", error));
        navigate("/perfil");
      } else {
        // Si no se logra iniciar sesión
        dispatch(logoutUser());
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error(err.response?.data?.error || "Error desconocido");
      alert(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Welcome Back</h2>
      <div className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleLogin} className="login-button">
          Log In
        </button>
      </div>
    </div>
  );
};
