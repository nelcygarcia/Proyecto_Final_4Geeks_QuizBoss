import quizBossLogo from '../assets/img/quizboss-logo.jpg';
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../hooks/ThemeContext";

export const Home = () => {

	const navigate = useNavigate(); 
	const { theme,setTheme } = useContext(ThemeContext);

	useEffect(() => {
		document.body.classList.add("home-background");

		return () => {
			document.body.classList.remove("home-background");
		};
	}, []);
	

	return (
		<div className="container">
        	<div className="title-container">
      			<h1>
        			Bienvenido a 
        			<img src={quizBossLogo} alt="Quiz Boss Logo" className="logo-inline" />
      			</h1>
    		</div>
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

