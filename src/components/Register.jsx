import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "./tools/ParticlesBackground";
import { Header } from "./Header";
import { clearCart } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

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
  const dispatch = useDispatch();
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
        // Intentar registrar al usuario
        await axios.post("/api/auth/register", form);

        const { email, password } = form;
        const response = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem("authToken", response.data.token);

          dispatch(
            loginUser({
              token: response.data.token,
              user: response.data.user,
            })
          );

          // Opcional: cargar datos adicionales después de iniciar sesión (productos, configuraciones, etc.)
          fetch(`/api/productos?userId=${response.data.user.id}`)
            .then((res) => res.json())
            .then((data) => dispatch(setProducts(data)))
            .catch((error) =>
              console.error("Error fetching productos:", error)
            );

          dispatch(clearCart());
          localStorage.setItem("cartItems", JSON.stringify([]));

          navigate("/perfil");
        } else {
          console.error("Error al iniciar sesión automáticamente");
        }
      } catch (err) {
        console.error(
          err.response?.data?.error || "Error al registrar o iniciar sesión",
          err
        );
        alert(
          err.response?.data?.error ||
            "Hubo un problema al registrarse e iniciar sesión"
        );
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
