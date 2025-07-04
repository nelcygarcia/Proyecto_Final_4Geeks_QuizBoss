import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { CustomNavbar } from "../../components/CustomNavbar";
import "../../components/GameStartScreen.css"



export const HomePrivate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const user = store.userData;
    const user = store.userData;

    const [currentRightPhraseIndex, setCurrentRightPhraseIndex] = useState(0);
    const [ranking, setRanking] = useState([]);


    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/ranking`);
                if (!response.ok) throw new Error("Error al obtener el ranking");

                const data = await response.json();
                setRanking(data);
            } catch (error) {
                console.error("Error al obtener el ranking:", error);
            }
        };

        if (store.userData) {
            fetchRanking(); // Se actualiza cuando cambia userData
        }
    }, [store.userData]);

    const frasesDerecha = [
        "📚 Aprende algo nuevo en cada partida.",
        "👾 Desafía a tu propio récord.",
        "🚀 El conocimiento es poder.",
        "🧩 Cada pregunta es una nueva oportunidad.",
        "🔍 Piensa rápido, responde mejor.",
        "🥇 ¡Conviértete en el campeón del Quiz!"
    ];

    useEffect(() => {

        const intervalRight = setInterval(() => {
            setCurrentRightPhraseIndex((prev) => (prev + 1) % frasesDerecha.length);
        }, 4000);

        return () => {
            { clearInterval(intervalRight); }
        };
    }, []);

    useEffect(() => {

    }, [store.userData])

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
                    `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Error al obtener datos del usuario");

                const userData = await response.json();

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
        <>
            <CustomNavbar playerName="Rigo" />

            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">

                {/* Fila central con ranking - avatar - frases */}
                <div className="d-flex justify-content-between align-items-center w-100 px-5" style={{ gap: "250px" }}>

                    {/* IZQUIERDA: RANKING */}
                    <div
                        className="d-none d-md-block marco"
                        style={{
                            width: "280px",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "10px",
                            padding: "15px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                            overflowY: "none"
                        }}
                    >
                        <h6 className="text-center fw-bold mb-3 text-dark">🏆 Top Jugadores</h6>
                        <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            <table className="table table-sm table-bordered table-hover align-middle mb-0" style={{ overflowY: "auto", maxHeight: "186px" }}>
                                <thead className="table-warning text-center">
                                    <tr>
                                        <th style={{ fontSize: "0.8rem" }}>#</th>
                                        <th style={{ fontSize: "0.8rem" }}>Jugador</th>
                                        <th style={{ fontSize: "0.8rem" }}>Ranking</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {ranking.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.user_name}</td>
                                            <td>{user.ranking_user}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CENTRO: AVATAR + SALUDO */}
                    <div className="text-center">
                        {store.message && <h2 className="mb-4 start-screen-title" >Hola {user.user_name}</h2>}

                        <img
                            src={store.avatar}
                            alt="Avatar del usuario"
                            className="rounded-circle mb-4 marco"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                    </div>

                    {/* DERECHA: FRASES */}
                    <div className="d-none d-md-block" style={{ width: "260px" }}>
                        <div className="alert alert-dark shadow-sm rounded-3 p-3 text-end marco">
                            <strong>{frasesDerecha[currentRightPhraseIndex]}</strong>
                        </div>
                    </div>
                </div>

                {/* BOTÓN ABAJO */}
                <div className="mt-4">
                    <button
                        className="start-game-button"
                        onClick={() => navigate("/sala")}
                        style={{ fontSize: "1.8rem", borderRadius: "12px", maxWidth: "500px" }}
                    >
                        <div>🎮 Seleccionar Partida</div>
                    </button>
                </div>
            </div>
        </>
    );
}