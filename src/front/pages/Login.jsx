import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

export const Login = () => {
  const [userOrEmail, setuserOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userOrEmail || !password) {
    setErrorMessage("Completa todos los campos");
    return;
  }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name_or_email: userOrEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user_id);  // que dentro hace dispatch + localStorage
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
            placeholder="Nombre de usuario o correo electrónico"
            value={userOrEmail}
            onChange={(e) => setuserOrEmail(e.target.value)}
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