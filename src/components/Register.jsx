import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/Register.scss";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "./tools/ParticlesBackground";
import { Header } from "./Header";
import { clearCart } from "../redux/slices/cartSlice";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [samePassword, setSamePassword] = useState(false);
  const [toLogin, setToLogin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (form.password && form.confirmPassword) {
      setSamePassword(form.password === form.confirmPassword);
    } else {
      setSamePassword(false);
    }
  }, [form.password, form.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!samePassword) {
      alert("Las contraseñas no coinciden");
    } else {
      try {
        await axios.post("/api/register", form);
        dispatch(clearCart());
        localStorage.setItem("cartItems", JSON.stringify([]));
      } catch (err) {
        console.error("Error al registrar", err);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="center_form_register">
        <ParticlesBackground />
        <form
          className={`form_register ${toLogin && "toLogin"}`}
          onSubmit={handleSubmit}
        >
          <p className="title">Registrarse</p>
          <p className="message">Registrate para tener acceso a la app.</p>

          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <span>Nombre</span>
            </label>

            <label>
              <input
                className="input"
                type="text"
                placeholder=""
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <span>Apellido</span>
            </label>
          </div>

          <label>
            <input
              className="input"
              type="email"
              placeholder=""
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <span>Correo Electronico</span>
          </label>

          <label>
            <input
              className="input"
              type="password"
              placeholder=""
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span>Contraseña</span>
          </label>

          <label>
            <input
              className={`input ${
                form.confirmPassword && (samePassword ? "valid" : "invalid")
              }`}
              type="password"
              placeholder=""
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <span>Confirmar Contraseña</span>
          </label>

          <button className="submit" type="submit">
            Registrarse
          </button>
          <p
            className="signin"
            onClick={() => {
              setToLogin(true);
              setTimeout(() => {
                navigate("/login");
              }, 500);
            }}
          >
            Ya tienes una cuenta? <a href="#">Inicia Sesión</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
