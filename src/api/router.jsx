import App from "../App.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import NotFound from "../components/NotFound.jsx";
import { UserProfile } from "../components/UserProfile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "perfil/:perfil",
    element: <UserProfile />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
]);
