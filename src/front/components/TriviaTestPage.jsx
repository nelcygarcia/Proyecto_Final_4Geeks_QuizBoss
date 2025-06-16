import React, { useState } from "react";
import { useTrivIAGenerator } from "../hooks/TrivIAGenerator"; 

export const TriviaTestPage = () => {
  const { generateSingleQuestion, loading, error } = useTrivIAGenerator();
  const [question, setQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ciencia'); 
  const [selectedDifficulty, setSelectedDifficulty] = useState('facil'); 

  const handleGenerateQuestion = async () => {
    try {
      const generatedQuestion = await generateSingleQuestion(selectedCategory, selectedDifficulty);
      setQuestion(generatedQuestion);
    } catch (err) {
      // El error ya se maneja dentro del hook, pero puedes añadir logging adicional aquí
      console.error("Error en TriviaTestPage al generar pregunta:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Página de Prueba de Trivia con Perplexity AI</h1>
      

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select" style={{ marginRight: '10px' }}>Categoría:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="cultura general">Cultura General</option>
          <option value="deportes">Deportes</option>
          <option value="peliculas">Películas</option>
          <option value="anime">Anime</option>
          <option value="ciencia">Ciencia</option>
        </select>

        <label htmlFor="difficulty-select" style={{ marginRight: '10px' }}>Dificultad:</label>
        <select
          id="difficulty-select"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="facil">Fácil</option>
          <option value="normal">Normal</option>
          <option value="dificil">Difícil</option>
        </select>

        <button
          onClick={handleGenerateQuestion}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? "Generando..." : "Generar Pregunta de Trivia"}
        </button>
      </div>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

      {question && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#000' }}>
          <h3>Pregunta: {question.question}</h3>
          <p style={{ fontWeight: 'bold' }}>Opciones:</p>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {answer}
                {answer === question.correctAnswer && (
                  <span style={{ color: 'green', marginLeft: '10px', fontWeight: 'bold' }}>(Correcta)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};