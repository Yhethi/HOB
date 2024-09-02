import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Scanner } from "./components/Scanner";

function App() {
  const [codigo_barras, setCodigo_barras] = useState("0");
  const [nombre, setNombre] = useState("Producto");
  const [descripcion, setDescripcion] = useState("D");
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // fetch("/api/productos")
    //   .then((response) => response.json())
    //   .then((data) => setProductos(data))
    //   .catch((error) => console.error("Error fetching productos:", error));
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
    <div className="global__Container">
      <Scanner />
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
