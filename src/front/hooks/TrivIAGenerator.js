// src/front/hooks/TrivIAGenerator.js
import { useState } from "react";

// Función auxiliar para crear el prompt para la IA
function crearPrompt(categoria, dificultad) {
  let categoriaPrompt = '';
  switch (categoria.toLowerCase()) {
    case 'cultura general':
      categoriaPrompt = 'cultura general';
      break;
    case 'deportes':
      categoriaPrompt = 'deportes (por ejemplo, fútbol, baloncesto, atletismo)';
      break;
    case 'peliculas':
      categoriaPrompt = 'películas (incluyendo directores, actores, géneros, tramas)';
      break;
    case 'anime':
      categoriaPrompt = 'anime (series, personajes, géneros, creadores)';
      break;
    case 'ciencia':
      categoriaPrompt = 'ciencia (química, física, biología, astronomía)';
      break;
    default:
      categoriaPrompt = 'cultura general';
  }

  return `
Crea una pregunta de trivia de dificultad ${dificultad.toUpperCase()} sobre el tema ${categoriaPrompt.toUpperCase()}.
Asegúrate de que la pregunta y las opciones sean claras y relacionadas con la categoría.
Debe tener 4 opciones de respuesta y marcar cuál es la correcta. Devuélvelo en formato JSON como este ejemplo:

{
  "question": "¿Qué partícula subatómica tiene carga negativa?",
  "options": ["Protón", "Neutrón", "Electrón", "Fotón"],
  "correct_answer": "Electrón"
}
  `;
}


const adaptQuestionFormat = (apiQuestion) => {
    return {
        question: apiQuestion.question,
        answers: apiQuestion.options,
        correctAnswer: apiQuestion.correct_answer,
    };
};

export const useTrivIAGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar una sola pregunta
  const generateSingleQuestion = async (categoria = 'cultura general', dificultad = 'facil') => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar", 
          messages: [
            { role: "system", content: "Eres un generador de preguntas de trivia experto. Genera solo la salida JSON." },
            { role: "user", content: crearPrompt(categoria, dificultad) }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de API: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extraer el JSON de la respuesta
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");

      if (start === -1 || end === -1) {
          throw new Error("La respuesta de la API no contiene un JSON válido en el formato esperado.");
      }

      const triviaJson = content.slice(start, end + 1);
      const triviaObj = JSON.parse(triviaJson);

      return adaptQuestionFormat(triviaObj); 
    } catch (err) {
      console.error("Error al generar pregunta de trivia:", err);
      setError(`No se pudo generar la pregunta: ${err.message}. Por favor, revisa tu clave API o inténtalo de nuevo.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para generar múltiples preguntas para una partida
  const generateGameQuestions = async (numQuestions = 5, categoria = 'cultura general', dificultad = 'facil') => {
    setLoading(true);
    setError(null);
    const generatedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
        try {
            const question = await generateSingleQuestion(categoria, dificultad);
            if (question) { 
                generatedQuestions.push(question); 
            }
        } catch (err) {
            console.error(`Error generando pregunta ${i + 1}:`, err);
            
        }
    }
    setLoading(false);
    return generatedQuestions;
  };

  return { generateSingleQuestion, generateGameQuestions, loading, error };
};