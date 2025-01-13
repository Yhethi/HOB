import React, { useEffect, useState } from "react";
import "../assets/styles/userProfile.scss";
import {
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Header } from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLoading } from "../redux/slices/loaderSlice";
import UpdateExchangeRatesModal from "./UpdateExchangeRatesModal";
import axios from "axios";
import { fetchUserData } from "../redux/actions/fetchUserData";
import Loader from "./tools/Loader";
import socket from "../../socket";
import { ProductTable } from "./ProductTable";
import { ProductModal } from "./ProductModal";
import { ConfirmDelete } from "./ConfirmDelete";
import { useProducts } from "../hooks/useProducts";

export const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = {
    name: user.nombre,
    email: user.email,
    phone: "+1 (555) 123-4567",
    address: "1234 Elm Street, Springfield, IL",
    profileImage: "https://via.placeholder.com/150",
  };

  const handleSave = async (newRates) => {
    dispatch(setIsLoading(true));
    try {
      await axios.patch("/api/customRate/updateCustomRate", newRates);
    } catch (er) {
      console.log(er);
    } finally {
      dispatch(fetchUserData());
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.u_nivel === 2) {
        socket.emit("registerUser", user.id);
        socket.on("newNotification", (data) => {
          alert(`Nueva notificación:\n${data.message}`);
        });
      }
    }
    return () => {
      socket.off("newNotification");
    };
  }, []);

  const { products, createProduct, updateProduct, deleteProduct } =
    useProducts();

  const [isModalOpenProducts, setIsModalOpenProducts] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpenProducts(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedProduct({ id });
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    await deleteProduct(selectedProduct.id);
    setIsDeleteOpen(false);
  };

  const saveProduct = async (product) => {
    if (selectedProduct) {
      await updateProduct(product);
    } else {
      await createProduct(product);
    }
  };

  return (
    <>
      <Header />
      <Loader />
      <div className="global_profile">
        <UpdateExchangeRatesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          user={user}
        />
        <div className="up_profile">
          <div className="upCards cards_up_left">
            <div className="card" onClick={() => setIsModalOpen(true)}>
              <p>Cambiar Tasas</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
          </div>
          <div className="profile-card">
            <div className="profile-header">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="profile-image"
              />
              <h2 className="profile-name">{userData.name}</h2>
              <button className="edit-button">
                <FaUserEdit /> Edit Profile
              </button>
            </div>
            <div className="profile-details">
              <div className="profile-item">
                <FaEnvelope className="icon" />
                <span>{userData.email}</span>
              </div>
              <div className="profile-item">
                <FaPhone className="icon" />
                <span>{userData.phone}</span>
              </div>
              <div className="profile-item">
                <FaMapMarkerAlt className="icon" />
                <span>{userData.address}</span>
              </div>
            </div>
          </div>
          <div className="upCards cards_up_right">
            <div className="card">
              <p>Productos</p>
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
            <div className="card">
              <p>Texto</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#00000"
              >
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleCreate}>Agregar Producto</button>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ProductModal
        isOpen={isModalOpenProducts}
        onClose={() => setIsModalOpenProducts(false)}
        onSave={saveProduct}
        initialData={selectedProduct}
      />
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};
