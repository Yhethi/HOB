import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./api/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
