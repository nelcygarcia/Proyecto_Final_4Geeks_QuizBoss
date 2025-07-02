import { useContext } from "react";
import { ThemeContext } from "../hooks/ThemeContext";
import "../css/ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className="theme-toggle-icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
    >
      <span className="theme-toggle-tooltip">
        {theme === "light" ? "Modo oscuro" : "Modo claro"}
      </span>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;