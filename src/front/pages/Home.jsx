import React, { useEffect } from "react"
import quizBossLogo from '../assets/img/quizboss-logo.jpg';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../index.css";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
    <div className="container">
      <img src={quizBossLogo} alt="Quiz Boss Logo" className="logo" />
      <h1>Bienvenido a <span className="highlight">Quiz Boss</span></h1>
      <div className="auth-buttons">
        <button>Registrarse</button>
        <button>Iniciar Sesión</button>
        <button>Recuperar Contraseña</button>
      </div>
      <div className="instructions">
        <h2>¿Cómo jugar?</h2>
        <p>Responde preguntas, gana puntos y conviértete en el jefe del conocimiento.</p>
      </div>
      <footer>&copy; 2025 Quiz Boss. Todos los derechos reservados.</footer>
    </div>
  );
};

