import React from "react";
import "../assets/styles/userProfile.scss";
import {
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Header } from "./Header";

export const UserProfile = () => {
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "1234 Elm Street, Springfield, IL",
    profileImage: "https://via.placeholder.com/150", // Link a una imagen de perfil
  };

  return (
    <>
      <Header />
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
    </>
  );
};
