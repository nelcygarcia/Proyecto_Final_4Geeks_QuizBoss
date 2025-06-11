import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../css/Registro.css";

export const Registro = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        user_name: username,
        password: password,
        ranking_user: 0,
        avatar: "./public/avatars/2.PNG", //Pendiente de revisión
        experiencia: 0
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el registro");
        return res.json();
      })
      .then((data) => {
        console.log("Usuario registrado:", data);
        setRegistroExitoso(true); 
      })
      .catch((err) => {
        console.error("Error al registrar:", err);
        alert("Hubo un error al registrar el usuario");
      });
  };

  if (registroExitoso) {
    return (
      <div className="registro-container">
        <div className="registro-card">
          <h2>¡Registro exitoso!</h2>
          <p>Tu cuenta ha sido creada correctamente.</p>
          <button onClick={() => navigate("/homeprivate")}>Continuar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h1>Registro</h1>
        <form onSubmit={handleSubmit} className="registro-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
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
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
          <button
            className="login-home"
            onClick={() => navigate("/")}
          >
          Volver al inicio
          </button>
        </form>
      </div>
    </div>
  );
};