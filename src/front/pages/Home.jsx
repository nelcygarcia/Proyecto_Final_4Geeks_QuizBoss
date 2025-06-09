import quizBossLogo from '../assets/img/quizboss-logo.jpg';
import "../index.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const navigate = useNavigate(); 

	return (
		<div className="container">
			<img src={quizBossLogo} alt="Quiz Boss Logo" className="logo" />
			<h1>Bienvenido a <span className="highlight">Quiz Boss</span></h1>
			<div className="auth-buttons">
				<button onClick={() => navigate("/register")}>Registrarse</button>
				<button onClick={() => navigate("/login")}>Iniciar Sesión</button>
			</div>
			<div className="instructions">
				<h2>¿Cómo jugar?</h2>
				<p>Responde preguntas, gana puntos y conviértete en el jefe del conocimiento.</p>
			</div>
			<footer>&copy; 2025 Quiz Boss. Todos los derechos reservados.</footer>
		</div>
	);
};

