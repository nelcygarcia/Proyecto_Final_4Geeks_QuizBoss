import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const UserDataLoader = ({ children }) => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo obtener los datos del usuario");
        }

        const userData = await res.json();

        dispatch({
          type: "set_user_data",
          payload: userData,
        });
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  return children;
};

export default UserDataLoader;
