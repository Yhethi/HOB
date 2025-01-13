import axios from "axios";
import { loginUser } from "../slices/authSlice";
import { setIsLoading } from "../slices/loaderSlice";

export const fetchUserData = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No se encontró el token");
      return;
    }

    const response = await axios.get("/api/auth/userData", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response:", response);

    if (response.data.success) {
      const newToken = response.data.token;

      localStorage.setItem("authToken", newToken);
      dispatch(
        loginUser({
          token: newToken,
          user: response.data.user,
        })
      );
    } else {
      console.warn(
        "Error en la respuesta del servidor:",
        response.data.message
      );
    }
  } catch (error) {
    console.error(
      "Error al obtener datos del usuario:",
      error.response?.data || error.message
    );
  } finally {
    dispatch(setIsLoading(false));
  }
};
