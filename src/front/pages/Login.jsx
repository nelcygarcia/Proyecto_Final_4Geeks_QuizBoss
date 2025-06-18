import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username, 
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: "SET_AUTH",
          payload: {
          token: data.token,
          user_id: data.user_id,
          },
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        navigate("/homeprivate");
      } else {
        if (response.status === 401 || response.status === 404) {
          setErrorMessage("Usuario y/o contraseña incorrectos");
        } else {
          setErrorMessage(data.message || "Error desconocido");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage("Error en la conexión con el servidor");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <div className="login-home-container">
        <button className="login-home" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="home-icon"
          >
            <path d="M3 9.75L12 3l9 6.75v10.5a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75V15a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v5.25a.75.75 0 01-.75.75H3.75A.75.75 0 013 20.25V9.75z" />
          </svg>
        </button>
      </div>

      <h1>Inicio sesión</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="login-error">{errorMessage}</p>}
        <button className="login-private" type="submit">
        Entrar
        </button>

        <div className="login-links">
          <Link to="/recover" className="login-link">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="login-register-text">
            ¿Todavía no tienes tu cuenta?{" "}
            <Link to="/register" className="login-link">
              ¡Crea tu cuenta aquí!
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
);
};