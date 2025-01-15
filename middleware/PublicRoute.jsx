import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const user = useSelector((state) => state.auth.user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
