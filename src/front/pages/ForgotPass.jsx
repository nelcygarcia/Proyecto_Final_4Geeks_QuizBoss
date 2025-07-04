import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import quizBossLogo from '../assets/img/quizboss-logo.jpg';
import '../css/RecoverPass.css';

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
        <div className="container">
            <img src={quizBossLogo} alt="QuizBoss Logo" className="logo rounded-3" />
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
                <p className="login-register-text">
                    ¿Ya recordaste?{" "}
                    <Link to="/login" className="login-link">
                        Iniciar sesión
                    </Link>
                </p>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}

export default ForgotPass;
