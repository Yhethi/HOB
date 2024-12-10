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
import useAuth from "../assets/hooks/useAuth";
import Loader from "./tools/Loader";

export const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customRates, setCustomRates] = useState({
    user_id: user.id,
    usd_to_bolivares: user.customRates?.usd_to_bolivares || "",
    usd_to_pesos: user.customRates?.usd_to_pesos || "",
    usd: user.customRates?.usd || "",
  });

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
    setCustomRates(newRates);
    dispatch(setIsLoading(true));
    try {
      await axios.patch("/api/updateCustomRate", newRates);
    } catch (er) {
      console.log(er);
    } finally {
      dispatch(fetchUserData());
      dispatch(setIsLoading(false));
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
    </>
  );
};
