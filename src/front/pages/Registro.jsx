import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Registro.css";

export const Registro = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [errores, setErrores] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrores({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      general: ""
    });

    if (password !== confirmPassword) {
      setErrores(prev => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden"
      }));
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        user_name: username,
        password: password,
        ranking_user: 0,
        avatar: "./public/avatars/2.PNG",
        experiencia: 0
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw errorData;
        }
        return res.json();
      })
      .then((data) => {
        console.log("Usuario registrado:", data);
        setRegistroExitoso(true);
      })
      .catch((err) => {
        console.error("Error al registrar:", err);
        
        // Mapear los errores del backend a los campos correspondientes
        if (err.msg) {
          if (err.msg.includes("email")) {
            setErrores(prev => ({ ...prev, email: err.msg }));
          } else if (err.msg.includes("nombre de usuario")) {
            setErrores(prev => ({ ...prev, username: err.msg }));
          } else if (err.msg.includes("contraseña")) {
            setErrores(prev => ({ ...prev, password: err.msg }));
          } else {
            setErrores(prev => ({ ...prev, general: err.msg }));
          }
        } else {
          setErrores(prev => ({ ...prev, general: "Hubo un error al registrar el usuario" }));
        }
      });
  };

  if (registroExitoso) {
    return (
      <div className="registro-container">
        <div className="registro-card">
          <h2>¡Registro exitoso!</h2>
          <p>Tu cuenta ha sido creada correctamente.</p>
          <button onClick={() => navigate("/login")}>Continuar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-home-container">
          <button className="registro-home" onClick={() => navigate("/")}>
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
        <h1>Registro</h1>
        {errores.general && (
          <div className="error-message">{errores.general}</div>
        )}
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errores.email ? "error" : ""}
            />
            {errores.email && (
              <div className="error-message">{errores.email}</div>
            )}
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={errores.username ? "error" : ""}
            />
            {errores.username && (
              <div className="error-message">{errores.username}</div>
            )}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errores.password ? "error" : ""}
            />
            {errores.password && (
              <div className="error-message">{errores.password}</div>
            )}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={errores.confirmPassword ? "error" : ""}
            />
            {errores.confirmPassword && (
              <div className="error-message">{errores.confirmPassword}</div>
            )}
          </div>
          
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};