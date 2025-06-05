import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SalaDeJuegos.css'; 


import UserProfile from '../../components/UserProfile'; 
import QuestionCard from '../../components/QuestionCard'; 
import HomeButton from '../../components/HomeButton'; 
import useGameLogic from '../../hooks/useGameLogic'; 

const SalaDeJuego = () => {
  const navigate = useNavigate();

  const {
    userName,
    score,
    currentQuestion,
    feedback,
    selectedAnswerButton,
    timeLeft,
    handleAnswerSelected,
  } = useGameLogic(); // El hook se encargará de toda la lógica interna

  const handleGoHome = () => {
    // El hook useGameLogic limpia su timer interno al terminar.

    navigate('/');
  };

  return (
    <div className="game-container">
      <header className="game-header d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start">
          <HomeButton onClick={handleGoHome} />
          <UserProfile userName={userName} score={score} />
        </div>
      </header>

      <main className="game-main flex-grow-1 d-flex justify-content-center align-items-center p-3">
        {currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            feedback={feedback}
            selectedAnswerButton={selectedAnswerButton}
            timeLeft={timeLeft}
            onAnswerSelected={handleAnswerSelected}
            disabled={feedback !== null || timeLeft <= 0}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-muted">Cargando preguntas o juego terminado...</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalaDeJuego;