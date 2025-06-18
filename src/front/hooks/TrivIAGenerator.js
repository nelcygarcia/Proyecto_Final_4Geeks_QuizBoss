
import { useState } from "react";

function crearPrompt(categoria, dificultad) {
  let categoriaEspecifica = '';
  let ejemplosVariedad = ''; 
3
  switch (categoria.toLowerCase()) {
    case 'cultura general':
      categoriaEspecifica = 'cultura general';
      ejemplosVariedad = 'Por ejemplo: historia, geografía, ciencia básica, literatura, arte, eventos actuales, figuras famosas, etc. NO te centres en un único subtema.';
      break;
    case 'deportes':
      categoriaEspecifica = 'deportes';
      ejemplosVariedad = 'Por ejemplo: fútbol, baloncesto, tenis, atletismo, natación, automovilismo, deportes olímpicos, reglas, récords, deportistas, etc. Asegura gran diversidad de disciplinas y no te quedes en un solo deporte.';
      break;
    case 'peliculas':
      categoriaEspecifica = 'películas';
      ejemplosVariedad = 'Por ejemplo: directores famosos, actores, géneros (ciencia ficción, comedia, drama), películas icónicas, bandas sonoras, premios (Óscar, Goyas), personajes, sagas. Asegura gran diversidad de temas y no te quedes en un solo género o franquicia.';
      break;
    case 'anime':
      categoriaEspecifica = 'anime';
      ejemplosVariedad = 'Por ejemplo: series famosas, personajes principales, géneros (shonen, shojo, mecha, slice of life, etc), mangakas (autores de manga), estudios de animación, eventos o conceptos clave del anime. **CRUCIAL: Asegura una VARIEDAD EXTREMA y no repitas subtemas como "estudios" en varias preguntas.**';
      break;
    case 'ciencia':
      categoriaEspecifica = 'ciencia';
      ejemplosVariedad = 'Por ejemplo: física, química, biología, astronomía, ecología, geología, descubrimientos científicos, inventores. Asegura gran diversidad de ramas de la ciencia y no te quedes en una sola (e.g., solo física).';
      break;
    default:
      categoriaEspecifica = 'cultura general';
      ejemplosVariedad = 'Por ejemplo: historia, geografía, ciencia, literatura, arte, etc. Garantiza la variedad.';
  }

  return `
GENERAR UNA ÚNICA PREGUNTA DE TRIVIA.

INSTRUCCIONES CRÍTICAS (DEBES SEGUIRLAS ESTRICTAMENTE):
1. La pregunta debe ser de dificultad <span class="math-inline">\{dificultad\.toUpperCase\(\)\} y sobre el tema "</span>{categoriaEspecifica}".
2. **VARIEDAD EXTREMA:** Asegúrate de que esta pregunta sea de un subtema COMPLETAMENTE DIFERENTE al de cualquier pregunta que pudieras haber generado antes en la misma categoría. No repitas subtemas. ${ejemplosVariedad}
3. **CONCISIÓN MÁXIMA:** La pregunta debe ser CORTA, lo más concisa posible, pensada para leerse en MENOS DE 10 SEGUNDOS. No uses frases largas ni complejas.
4. Proporciona 4 opciones de respuesta distintas y una única respuesta correcta.
5. Formato de SALIDA JSON ESTRICTO:
{
  "question": "Texto de la pregunta corta y concisa",
  "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  "correct_answer": "La respuesta correcta"
}
  `;
}

// ... (el resto del código de TrivIAGenerator.js, incluyendo useTrivIAGenerator, se mantiene igual) ...


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