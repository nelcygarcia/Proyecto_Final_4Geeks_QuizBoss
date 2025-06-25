// src/front/pages/davidPages/SalaDeJuego.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalaDeJuegos.css';

import UserProfile from '../../components/UserProfile';
import QuestionCard from '../../components/QuestionCard';
import HomeButton from '../../components/HomeButton';
import GameStartScreen from '../../components/GameStartScreen';
import useGameLogic from '../../hooks/useGameLogic';
import GameOverWrapper from '../../components/GameOverWrapper';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import thinkingBrainGif from '../../assets/img/thinking_brain.gif'; 


const SalaDeJuego = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('cultura general');
    const [selectedDifficulty, setSelectedDifficulty] = useState('facil');
    const { store } = useGlobalReducer();
    const token = store.auth?.token;

    
    const currentUserName = store.userData?.user_name || 'Invitado'; //
    const currentUserAvatar = store.avatar || '/avatars/default.png'; 
 
    const {
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
        navigate('/homeprivate');
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
                    <GameStartScreen
                        userName={currentUserName} 
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
                    <div className="text-center d-flex flex-column align-items-center justify-content-center">
                        <img
                            src={thinkingBrainGif}
                            alt="La IA está pensando"
                            className="img-fluid mb-3"
                            style={{ maxWidth: '150px', height: 'auto' }}
                        />
                        <h2 className="text-muted mt-3">La IA está exprimiéndose el cerebro para tus preguntas...</h2>
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
                    <GameOverWrapper
                        score={score}
                        totalQuestions={totalQuestions}
                        token={token}
                        userName={currentUserName} // Pasar el nombre al GameOverWrapper también
                        onRematch={() => startRematch(5, selectedCategory, selectedDifficulty)}
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
                    {gameStatus === 'playing' && (
                        <UserProfile
                            userName={currentUserName} // Usamos el nombre del store
                            userAvatarUrl={currentUserAvatar} // Pasamos la URL del avatar
                            score={score} // El score sigue siendo del hook de juego
                        />
                    )}
                </div>
            </header>

            <main className="game-main flex-grow-1 d-flex justify-content-center align-items-center p-3">
                {renderGameContent()}
            </main>
        </div>
    );
};

export default SalaDeJuego;