import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import quizBossLogo from "../../assets/img/quizboss-logo.jpg";
import { CustomNavbar } from "../../components/CustomNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import quizBossLogo from "../../assets/img/quizboss-logo.jpg";
import { CustomNavbar } from "../../components/CustomNavbar";

export const HomePrivate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [currentLeftPhraseIndex, setCurrentLeftPhraseIndex] = useState(0);
    const [currentRightPhraseIndex, setCurrentRightPhraseIndex] = useState(0);

    const frasesIzquierda = [
        "🧠 ¡Pon a prueba tu conocimiento!",
        "💡 Cada respuesta cuenta. ¡Demuestra lo que sabes!",
        "🏆 Solo los mejores llegarán al final.",
        "🔥 ¡Reta tu mente con cada pregunta!",
        "🎯 Aprende mientras juegas.",
        "⏳ El tiempo corre… ¿estás listo?"
    ];

    const frasesDerecha = [
        "📚 Aprende algo nuevo en cada partida.",
        "👾 Desafía a tu propio récord.",
        "🚀 El conocimiento es poder.",
        "🧩 Cada pregunta es una nueva oportunidad.",
        "🔍 Piensa rápido, responde mejor.",
        "🥇 ¡Conviértete en el campeón del Quiz!"
    ];

    useEffect(() => {
        const intervalLeft = setInterval(() => {
            setCurrentLeftPhraseIndex((prev) => (prev + 1) % frasesIzquierda.length);
        }, 4000);

        const intervalRight = setInterval(() => {
            setCurrentRightPhraseIndex((prev) => (prev + 1) % frasesDerecha.length);
        }, 4000);

        return () => {
            clearInterval(intervalLeft);
            clearInterval(intervalRight);
        };
    }, []);

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
            {/* Slider izquierdo */}
            <div
                className="position-fixed d-none d-md-block"
                style={{
                    top: "50%",
                    left: "15vw",
                    transform: "translateY(-50%)",
                    width: "260px",
                    zIndex: 1030
                }}
            >
                <div className="alert alert-dark shadow-sm rounded-3 p-3 text-start">
                    <strong>{frasesIzquierda[currentLeftPhraseIndex]}</strong>
                </div>
            </div>

            {/* Slider derecho */}
            <div
                className="position-fixed d-none d-md-block"
                style={{
                    top: "50%",
                    right: "15vw",
                    transform: "translateY(-50%)",
                    width: "260px",
                    zIndex: 1030
                }}
            >
                <div className="alert alert-dark shadow-sm rounded-3 p-3 text-end">
                    <strong>{frasesDerecha[currentRightPhraseIndex]}</strong>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-white text-center">
                <img
                    src={quizBossLogo}
                    alt="Banner partida"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "350px", objectFit: "contain" }}
                />
        <>
            <CustomNavbar playerName="Rigo" />
            {/* Slider izquierdo */}
            <div
                className="position-fixed d-none d-md-block"
                style={{
                    top: "50%",
                    left: "15vw",
                    transform: "translateY(-50%)",
                    width: "260px",
                    zIndex: 1030
                }}
            >
                <div className="alert alert-dark shadow-sm rounded-3 p-3 text-start">
                    <strong>{frasesIzquierda[currentLeftPhraseIndex]}</strong>
                </div>
            </div>

            {/* Slider derecho */}
            <div
                className="position-fixed d-none d-md-block"
                style={{
                    top: "50%",
                    right: "15vw",
                    transform: "translateY(-50%)",
                    width: "260px",
                    zIndex: 1030
                }}
            >
                <div className="alert alert-dark shadow-sm rounded-3 p-3 text-end">
                    <strong>{frasesDerecha[currentRightPhraseIndex]}</strong>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-white text-center">
                <img
                    src={quizBossLogo}
                    alt="Banner partida"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "350px", objectFit: "contain" }}
                />

                {store.message && <h2 className="mb-4">{store.message}</h2>}

                <img
                    src={store.avatar}
                    alt="Avatar del usuario"
                    className="rounded-circle mb-4"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />

                <button
                    className="btn btn-warning btn-lg shadow px-5 py-3 mb-3"
                    onClick={() => navigate("/sala")}
                    style={{ fontSize: "1.8rem", borderRadius: "12px" }}
                >
                    🎮 Iniciar Partida
                </button>
            </div>
        </>
    );
};

