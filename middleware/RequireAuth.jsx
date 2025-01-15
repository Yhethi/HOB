import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { fetchUserData } from "../src/redux/actions/fetchUserData";
import Loader from "../src/components/tools/Loader";

const RequireAuth = () => {
  const dispatch = useDispatch();
  const isLogged = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(fetchUserData());
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
