import React, { useState } from "react";

export const ProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formValues, setFormValues] = useState(
    initialData || { nombre: "", precio: "", descripcion: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formValues.nombre}
          onChange={handleChange}
          required
        />
        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={formValues.precio}
          onChange={handleChange}
          required
        />
        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formValues.descripcion}
          onChange={handleChange}
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};
