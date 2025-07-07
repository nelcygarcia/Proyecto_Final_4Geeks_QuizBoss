import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Registro.css";

export const Registro = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [registroExitoso, setRegistroExitoso] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("home-background");

    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    return () => {
      document.body.classList.remove("home-background");
    };
  }, []);

  const validateEmail = (value) => {
    if (!value.includes("@")) {
      setEmailError("El correo debe contener '@'");
    } else {
      setEmailError("");
    }
  };

  const validateUsername = (value) => {
    if (value.length < 3) {
      setUsernameError("El nombre de usuario debe tener al menos 3 caracteres");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail(email);
    validateUsername(username);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (
      emailError ||
      usernameError ||
      passwordError ||
      confirmPasswordError ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return; 
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/api/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            user_name: username,
            password,
            ranking_user: 0,
            avatar: "/avatars/2.PNG",
            experiencia: 0,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Error en el registro");
      }

      setRegistroExitoso(true);
    } catch (err) {
      setEmailError(err.message);
    }
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
        <form onSubmit={handleSubmit} className="registro-form" noValidate>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            required
          />
          {emailError && (
            <div className="registro-error">
              <span>⚠️</span> {emailError}
            </div>
          )}

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validateUsername(e.target.value);
            }}
            required
          />
          {usernameError && (
            <div className="registro-error">
              <span>⚠️</span> {usernameError}
            </div>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
          />
          {passwordError && (
            <div className="registro-error">
              <span>⚠️</span> {passwordError}
            </div>
          )}

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(e.target.value);
            }}
            required
          />
          {confirmPasswordError && (
            <div className="registro-error">
              <span>⚠️</span> {confirmPasswordError}
            </div>
          )}

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};