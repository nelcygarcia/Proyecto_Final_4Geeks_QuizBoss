// src/front/components/GameStartScreen.jsx
import React from 'react';
import './GameStartScreen.css';

const GameStartScreen = ({
    userName,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    onStartGame,
    isLoading,
    error
}) => {
    return (
        <div className="game-start-container">
            <div className="start-screen-card">
                <h1 className="start-screen-title">¡Bienvenido, {userName}!</h1>
                <p className="start-screen-subtitle">¡Prepárate para el desafío de Trivia!</p>

                <div className="options-group">
                    <div className="select-wrapper">
                        <label htmlFor="category-select" className="select-label">Selecciona una categoría:</label>
                        <select
                            id="category-select"
                            className="trivia-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="cultura general">Cultura General</option>
                            <option value="deportes">Deportes</option>
                            <option value="peliculas">Películas</option>
                            <option value="anime">Anime</option>
                            <option value="ciencia">Ciencia</option>
                        </select>
                    </div>

                    <div className="select-wrapper">
                        <label htmlFor="difficulty-select" className="select-label">Selecciona la dificultad:</label>
                        <select
                            id="difficulty-select"
                            className="trivia-select"
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                        >
                            <option value="facil">Fácil</option>
                            <option value="normal">Normal</option>
                            <option value="dificil">Difícil</option>
                        </select>
                    </div>
                </div>

                <button
                    className="start-game-button"
                    onClick={onStartGame}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cargando preguntas...' : 'Comenzar Juego'}
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default GameStartScreen;