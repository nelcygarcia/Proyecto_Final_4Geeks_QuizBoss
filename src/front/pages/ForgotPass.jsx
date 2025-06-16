import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recover_password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setMsg(data.msg);

        } catch (error) {
            setMsg("Error al enviar solicitud");
        }
    };

    return (
        <div>
            <h1>Recuperar contraseña</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Introduce tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar enlace</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}

export default ForgotPass;
