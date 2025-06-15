import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SalaDeJuegos.css';

import UserProfile from '../../components/UserProfile';
import QuestionCard from '../../components/QuestionCard';
import HomeButton from '../../components/HomeButton';
import GameStartScreen from '../../components/GameStartScreen'; 
import GameOverScreen from '../../components/GameOverScreen'; 
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
    gameStatus,
    totalQuestions, 
    handleAnswerSelected,
    startGame,
    startRematch, 
    startNewGame, 
  } = useGameLogic();

  const handleGoHome = () => {
    navigate('/');
  };

  const renderGameContent = () => {
    switch (gameStatus) {
      case 'idle':
        return <GameStartScreen onStartGame={startGame} />;
      case 'playing':
        return currentQuestion ? (
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
            <h2 className="text-muted">Cargando preguntas...</h2>
          </div>
        );
      case 'gameOver':
        return (
          <GameOverScreen
            score={score}
            totalQuestions={totalQuestions}
            onRematch={startRematch}
            onNewGame={startNewGame}
            onGoHome={handleGoHome} 
          />
        );
      default:
        return (
          <div className="text-center text-light">
            <h2>Estado desconocido del juego.</h2>
          </div>
        );
    }
  };

  return (
    <div className="game-container">
      <header className="game-header d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start">
     
          <HomeButton onClick={handleGoHome} />
          {gameStatus === 'playing' && <UserProfile userName={userName} score={score} />}
        </div>
      </header>

      <main className="game-main flex-grow-1 d-flex justify-content-center align-items-center p-3">
        {renderGameContent()}
      </main>
    </div>
  );
};

export default SalaDeJuego;