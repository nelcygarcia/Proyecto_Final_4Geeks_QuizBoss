import React from "react";
import PropTypes from "prop-types";
import "./GameOverScreen.css";

const GameOverScreen = ({
  score,
  totalQuestions,
  onRematch,
  onNewGame,
  onGoHome,
}) => {
  return (
    <div className="game-over-screen d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-light mb-4">¡Juego Terminado!</h1>
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
