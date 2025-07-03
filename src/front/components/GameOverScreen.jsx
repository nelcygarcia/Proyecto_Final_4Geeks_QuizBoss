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
  userXP,
  onXpUpdate,
}) => {
  const isVictory = score >= 3;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const xpEarned = score * 10;
  const newTotalXP = userXP + xpEarned;

  const calculateRank = (xp) => {
    if (xp < 500) return "Principiante";
    if (xp < 850) return "Aprendiz";
    if (xp < 1500) return "Avanzado";
    if (xp < 3000) return "Experto";
    return "Maestro";
  };

  const newRank = calculateRank(newTotalXP);

  useEffect(() => {
    if (onXpUpdate) {
      onXpUpdate(newTotalXP, newRank);
    }
  }, [newTotalXP,newRank]);

  
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
        Tu puntuación: <span className="score-final"> <strong>{score}</strong> </span> de{" "}
        <span className="score-total"> <strong>{totalQuestions}</strong></span> preguntas
      </p>

      <p className="text-light mb-2 fs-5">
        Has ganado <strong>{xpEarned}</strong> puntos de experiencia.
      </p>
      <p className="mb-4 fs-5">
        Tu ranking actual es: <strong>{newRank}</strong>
      </p>

      <div
        className="d-flex flex-column gap-3 mt-4 w-100"
        style={{ maxWidth: "300px" }}
      >
        <button
          className="btn btn-success btn-lg game-over-button"
          onClick={onRematch}
        >
          Revancha {/*Repetir tema y dificultad*/}
        </button>
        <button
          className="btn btn-info btn-lg game-over-button"
          onClick={onNewGame}
        >
          Juego Nuevo
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
  userXP: PropTypes.number.isRequired,
  onXpUpdate: PropTypes.func.isRequired,
};

export default GameOverScreen;
