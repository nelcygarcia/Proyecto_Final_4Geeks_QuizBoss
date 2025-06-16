// src/front/components/GameStartScreen.jsx
import React from 'react';

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
        <div className="start-screen"> 
            <h1>Bienvenido, {userName}!</h1>
            <p>¡Prepárate para el desafío de Trivia!</p>

            <div > {/* */}
                <label htmlFor="category-select">Selecciona una categoría:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="cultura general">Cultura General</option>
                    <option value="deportes">Deportes</option>
                    <option value="peliculas">Películas</option>
                    <option value="anime">Anime</option>
                    <option value="ciencia">Ciencia</option>
                </select>

                <label htmlFor="difficulty-select">Selecciona la dificultad:</label>
                <select
                    id="difficulty-select"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                    <option value="facil">Fácil</option>
                    <option value="normal">Normal</option>
                    <option value="dificil">Difícil</option>
                </select>
            </div>

            <button className="start-button" onClick={onStartGame} disabled={isLoading}>
                {isLoading ? 'Cargando preguntas...' : 'Comenzar Juego'}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default GameStartScreen;