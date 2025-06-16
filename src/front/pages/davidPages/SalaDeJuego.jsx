import React, { useState } from 'react';
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
    const [selectedCategory, setSelectedCategory] = useState('cultura general'); 
    const [selectedDifficulty, setSelectedDifficulty] = useState('facil');

    const {
        userName,
        score,
        currentQuestion,
        feedback,
        selectedAnswerButton,
        timeLeft,
        gameStatus,
        totalQuestions, 
        error, 
        isLoading, 
        handleAnswerSelected,
        startGame,
        startRematch, 
        startNewGame, 
    } = useGameLogic();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleStartGame = () => {
        startGame(5, selectedCategory, selectedDifficulty); 
    };

    const handleStartNewGame = () => {
        startNewGame(5, selectedCategory, selectedDifficulty); 
    };

    const renderGameContent = () => {
        switch (gameStatus) {
            case 'inicio':
                return (
                    //  pasamos las props de GameStartScreen
                    <GameStartScreen
                        userName={userName}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedDifficulty={selectedDifficulty}
                        setSelectedDifficulty={setSelectedDifficulty}
                        onStartGame={handleStartGame}
                        isLoading={isLoading}
                        error={error}
                    />
                );
            case 'loadingQuestions': 
                return (
                    <div className="text-center">
                        <h2 className="text-muted">Preparado para darle al coco?</h2>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                );
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
                        <h2 className="text-muted">Preparando la primera pregunta...</h2>
                    </div>
                );
            case 'gameOver':
                return (
                    <GameOverScreen
                        score={score}
                        totalQuestions={totalQuestions}
                        onRematch={() => startRematch(5, selectedCategory, selectedDifficulty)} // Pasamos los parámetros aquí
                        onNewGame={handleStartNewGame} 
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