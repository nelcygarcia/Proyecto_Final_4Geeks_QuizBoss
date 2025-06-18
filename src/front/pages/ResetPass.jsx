import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      setMsg(data.msg);
    } catch (err) {
      setMsg("Error al cambiar la contraseña");
    }

    if (data.msg === "Contraseña actualizada con éxito") {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }

  return (
    <div>
      <h1>Restablecer contraseña</h1>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Restablecer</button>
        <p className="login-register-text">
                    ¿Probamos de nuevo?{" "}
                    <Link to="/login" className="login-link">
                        Iniciar sesión
                    </Link>
                </p>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default ResetPassword;
