import { useSelector } from "react-redux";
import App from "../App.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import NotFound from "../components/NotFound.jsx";
import { UserProfile } from "../components/UserProfile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Register from "../components/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/perfil",
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
]);
