import React, { useEffect, useState } from "react";
import "./assets/styles/App.scss";
import axios from "axios";
import { Scanner } from "./components/Scanner";
import { Header } from "./components/Header";
import { Products } from "./components/Products";
import { BackgroundAnimated } from "./components/BackgroundAnimated";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./redux/slices/userSlice";
import { setProducts } from "./redux/slices/productsSlice";

function App() {
  const [codigo_barras, setCodigo_barras] = useState("0");
  const [nombre, setNombre] = useState("Producto");
  const [descripcion, setDescripcion] = useState("D");
  const [productos, setProductos] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    // fetch("/api/productos")
    //   .then((response) => response.json())
    //   .then((data) => dispatch(setProducts(data)))
    //   .catch((error) => console.error("Error fetching productos:", error));
    dispatch(
      setProducts([
        {
          id: 1,
          codigo_barras: "1234567890123",
          nombre: "Producto A",
          descripcion:
            "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from ",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: 1,
          cantidad: 100,
        },
        {
          id: 2,
          codigo_barras: "2345678901234",
          nombre: "Producto B",
          descripcion: "Descripción del Producto B",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: 1,
          cantidad: 50,
        },
        {
          id: 3,
          codigo_barras: "3456789012345",
          nombre: "Producto C Arroz",
          descripcion: "Descripción del Producto C",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: 2,
          cantidad: 75,
        },
        {
          id: 4,
          codigo_barras: "123456789",
          nombre: "Producto Daniel",
          descripcion: "D",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
        {
          id: 5,
          codigo_barras: "23207938",
          nombre: "Producto Eloy",
          descripcion: "E",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
        {
          id: 6,
          codigo_barras: "435",
          nombre: "Producto Pedro",
          descripcion: "F",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
        {
          id: 6,
          codigo_barras: "435",
          nombre: "Producto Pedro",
          descripcion: "F",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
        {
          id: 7,
          codigo_barras: "435",
          nombre: "Producto Pedro 2",
          descripcion: "F",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
        {
          id: 8,
          codigo_barras: "435",
          nombre: "Producto Pedro 3 cod435",
          descripcion: "F",
          precio: 11.1,
          imagen_url:
            "https://orientalgeneralstores.co.ke/wp-content/uploads/2022/12/test-product.jpg",
          usuario_id: null,
          cantidad: null,
        },
      ])
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Verifica que los campos no estén vacíos
    if (!nombre || !descripcion || !codigo_barras) {
      console.error("faltan datos");
      return;
    }
    console.log(nombre, descripcion);

    if (nombre && descripcion) {
      axios
        .post("/api/productos", {
          codigo_barras,
          nombre,
          descripcion,
        })
        .then((response) => {
          console.log(response);
          setProductos([...productos, response.data]);
          setNombre("");
          setDescripcion("");
          setCodigo_barras("");
        })
        .catch((error) => {
          console.error("Error al insertar producto:", error);
        });
    } else {
      console.error("Nombre y descripción son requeridos");
    }
  };

  return (
    <div className="global__container">
      <BackgroundAnimated />
      <Header />
      <Products />
      {/* <Scanner /> */}
      {/* <h1>Productos</h1>
      <ul>
        {productos.map((producto) => (
          <>
            <li key={producto.id}>
              {producto.id} {producto.codigo_barras} {producto.nombre} {producto.descripcion}
            </li>
          </>
        ))}
      </ul>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Codigo de Barras"
          value={codigo_barras}
          onChange={(e) => setCodigo_barras(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Agregar</button>
      </form> */}
    </div>
  );
}

export default App;
