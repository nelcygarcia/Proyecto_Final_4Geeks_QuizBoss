import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username, // corregido aquí
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar en localStorage
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
          <button type="submit">Entrar</button>
          <button
            className="login-recover"
            onClick={() => navigate("/recover-password")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>
    </div>
  );
};