import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./GameOverScreen.css";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import gameOverAnimation from "../animations/gameOver.json";

const GameOverScreen = ({
  score,
  totalQuestions,
  onRematch,
  onNewGame,
  onGoHome,
}) => {
  const isVictory = score >= 3;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener ("resize", handleResize);
  },[]);

  return (
    <div className={`game-over-screen d-flex flex-column align-items-center justify-content-center ${
      !isVictory ? "disaster-mode" : ""
    }`}
  >
    {isVictory ? (
    <Confetti width={windowSize.width} height={windowSize.height} />) : (
    <Lottie
      animationData={gameOverAnimation}
      loop={true}
      autoplay={true}
      style={{ height: "200px", width: "200px" }}
    />
    )}

      <h1 className="text-light mb-4">
        {isVictory ? "¡Juego Terminado!" : "¡Desastre Total!"}
      </h1>

      <p className="text-light mb-4 fs-4">
        Tu puntuación: <span className="score-final">{score}</span> de{" "}
        <span className="score-total">{totalQuestions}</span> preguntas
      </p>

      <div
        className="d-flex flex-column gap-3 mt-4 w-100"
        style={{ maxWidth: "300px" }}
      >
        <button
          className="btn btn-success btn-lg game-over-button"
          onClick={onRematch}
        >
          Revancha (Mismas preguntas)
        </button>
        <button
          className="btn btn-info btn-lg game-over-button"
          onClick={onNewGame}
        >
          Juego Nuevo (Otras preguntas)
        </button>
        <button
          className="btn btn-secondary btn-lg game-over-button"
          onClick={onGoHome}>
          Volver a Inicio
        </button>
      </div>
    </div>
  );
};

GameOverScreen.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onRematch: PropTypes.func.isRequired,
  onNewGame: PropTypes.func.isRequired,
  onGoHome: PropTypes.func.isRequired,
};

export default GameOverScreen;
