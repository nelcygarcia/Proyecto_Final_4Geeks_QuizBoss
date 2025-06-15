import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import quizBossLogo from "../../assets/img/quizboss-logo.jpg";

export const HomePrivate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = store.auth.token || localStorage.getItem("token");
            const user_id = store.auth.user_id || localStorage.getItem("user_id");

            if (!token || !user_id) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}api/usuarios/${user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Error al obtener datos del usuario");

                const userData = await response.json();

                // ✅ Guarda los datos en el store para que otros componentes los usen
                dispatch({ type: "set_user_data", payload: userData });
                dispatch({ type: "set_avatar", payload: userData.avatar });
                dispatch({
                    type: "set_hello",
                    payload: `Hola ${userData.user_name}`,
                });
            } catch (error) {
                console.error("Error al obtener usuario:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-white text-center">
            <img
                src={quizBossLogo}
                alt="Banner partida"
                className="img-fluid mb-3"
                style={{ maxHeight: "350px", objectFit: "contain" }}
            />

            {/* Mensaje de bienvenida (viene del store) */}
            {store.message && <h2 className="mb-4">{store.message}</h2>}

            {/* Avatar visible (puede ser clickeable si quieres) */}
            <img
                src={store.avatar}
                alt="Avatar del usuario"
                className="rounded-circle mb-4"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />

            {/* Botón de acción principal */}
            <button
                className="btn btn-warning btn-lg shadow px-5 py-3 mb-3"
                style={{ fontSize: "1.8rem", borderRadius: "12px" }}
            >
                🎮 Iniciar Partida
            </button>
        </div>
    );
};
