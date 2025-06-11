import React from 'react';
import PropTypes from 'prop-types'; // Para validación de props
import './GameStartScreen.css'; 

const GameStartScreen = ({ onStartGame }) => {
  return (
    <div className="start-screen d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-light mb-4">¡Bienvenido a QuizBoss!</h1>
      <p className="text-light mb-5 fs-5">Pon a prueba tus conocimientos.</p>
      <button
        className="btn btn-primary btn-lg start-game-button"
        onClick={onStartGame}
      >
        Empieza el Juego !
      </button>
    </div>
  );
};


GameStartScreen.propTypes = {
  onStartGame: PropTypes.func.isRequired,
};

export default GameStartScreen;