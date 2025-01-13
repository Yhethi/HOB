import React from "react";

export const ConfirmDelete = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <p>¿Estás seguro de que deseas eliminar este producto?</p>
      <button onClick={onConfirm}>Sí</button>
      <button onClick={onClose}>No</button>
    </div>
  );
};
