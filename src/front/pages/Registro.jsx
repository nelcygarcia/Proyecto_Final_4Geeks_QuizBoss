import React, { useState } from "react";
import '../css/Registro.css';

export const Registro = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí iría el envío al backend
    console.log("Registrando:", { username, password });
  };

  return (
    <div className="registro-container">
  <div className="registro-card">
    <h1>Registro</h1>
    <form onSubmit={handleSubmit} className="registro-form">
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
    </form>
  </div>
</div>
  );
};
