import { useSelector } from "react-redux";
import App from "../App.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import NotFound from "../components/NotFound.jsx";
import { UserProfile } from "../components/UserProfile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../components/Register.jsx";

import { Navigate, Outlet } from "react-router-dom";
import RequireAuth from "../../middleware/RequireAuth.jsx";
import { Login } from "../components/Login.jsx";
import PublicRoute from "../../middleware/PublicRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <RequireAuth />,
        children: [{ path: "" }],
      },
      {
        path: "login",
        element: <PublicRoute />,
        children: [{ path: "", element: <Login /> }],
      },
      {
        path: "register",
        element: <PublicRoute />,
        children: [{ path: "", element: <Register /> }],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
