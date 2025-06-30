import { useState } from "react";

// Función para normalizar texto (ignora tildes, mayúsculas, signos y espacios extra)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // ignora tildes
    .replace(/[¿?¡!.,:;\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Compara si dos textos son muy similares (por igualdad o por inclusión)
function areQuestionsSimilar(q1, q2) {
  const n1 = normalizeText(q1);
  const n2 = normalizeText(q2);
  return n1 === n2 || n1.includes(n2) || n2.includes(n1);
}

// Compara si dos arrays de respuestas son iguales (ignorando orden y tildes)
function areAnswersSetsEqual(a1, a2) {
  if (!Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length)
    return false;
  const normA1 = a1.map(normalizeText).sort();
  const normA2 = a2.map(normalizeText).sort();
  return normA1.every((ans, i) => ans === normA2[i]);
}

function crearPrompt(categoria, dificultad, subtemasYaPreguntados = []) {
  let categoriaEspecifica = "";
  let ejemplosVariedad = "";

  switch (categoria.toLowerCase()) {
    case "cultura general":
      categoriaEspecifica = "cultura general";
      ejemplosVariedad =
        "Asegura una mezcla amplia de subtemas como historia, geografía, ciencia básica, literatura, arte, eventos actuales, figuras famosas, etc. NO te centres en un único subtema.";
      break;
    case "deportes":
      categoriaEspecifica = "deportes";
      ejemplosVariedad =
        "Incluye gran diversidad de disciplinas como fútbol, baloncesto, tenis, atletismo, natación, automovilismo, deportes olímpicos, reglas, récords, deportistas, etc. Evita quedarte en un solo deporte.";
      break;
    case "peliculas":
      categoriaEspecifica = "películas";
      ejemplosVariedad =
        "Cubre variedad de temas como directores famosos, actores, géneros (ciencia ficción, comedia, drama), películas icónicas, bandas sonoras, premios (Óscar, Goyas), personajes, sagas. No te quedes en un solo género o franquicia.";
      break;
    case "anime":
      categoriaEspecifica = "anime";
      ejemplosVariedad =
        "Proporciona una VARIEDAD EXTREMA de series, personajes, géneros (shonen, shojo, mecha, slice of life, etc), mangakas, estudios de animación, eventos o conceptos clave del anime. **CRUCIAL: No repitas subtemas específicos entre preguntas, por ejemplo, no preguntes dos veces sobre el mismo estudio o la misma saga.**";
      break;
    case "ciencia":
      categoriaEspecifica = "ciencia";
      ejemplosVariedad =
        "Varía mucho en ramas como física, química, biología, astronomía, ecología, geología, descubrimientos científicos, inventores. No te quedes en una sola rama de la ciencia.";
      break;
    default:
      categoriaEspecifica = "cultura general";
      ejemplosVariedad =
        "Asegura la máxima variedad en subtemas como historia, geografía, ciencia, literatura, arte, etc.";
  }

  // Añadimos subtemas ya preguntados al prompt para que la IA los evite
  let evitarSubtemas = "";
  if (subtemasYaPreguntados.length > 0) {
    evitarSubtemas = `IMPORTANTE: No repitas preguntas sobre estos subtemas, entidades o palabras clave: ${subtemasYaPreguntados.join(
      ", "
    )}`;
  }
  return `
GENERAR UNA ÚNICA PREGUNTA DE TRIVIA.

INSTRUCCIONES CRÍTICAS (DEBES SEGUIRLAS ESTRICTAMENTE):
1.  La pregunta debe ser de dificultad ${dificultad.toUpperCase()} y sobre el tema "${categoriaEspecifica}".
2.  **PREGUNTA COMPLETAMENTE ÚNICA Y ORIGINAL:** La pregunta debe ser distinta en su enfoque y subtema a cualquier otra pregunta que hayas generado. Evita cualquier repetición de ideas o detalles específicos. ${ejemplosVariedad}
${evitarSubtemas}
3.  **CONCISIÓN MÁXIMA:** La pregunta debe ser CORTA, lo más concisa posible, pensada para leerse en MENOS DE 10 SEGUNDOS. No uses frases largas ni complejas.
4.  Proporciona 4 opciones de respuesta distintas y una única respuesta correcta. Las opciones deben ser plausibles pero solo una correcta.
5.  Formato de SALIDA JSON ESTRICTO:
    {
    "question": "Texto de la pregunta corta y concisa",
    "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    "correct_answer": "La respuesta correcta",
    "subtema": "Palabra o frase corta que representa el subtema principal de la pregunta (por ejemplo: 'fútbol', 'Premios Óscar', 'biología', 'One Piece', 'atletismo', etc.)"
    }
    `;
}

// Extrae el subtema del objeto o lo infiere del texto si no existe
function extractSubtema(questionObj) {
  if (
    questionObj.subtema &&
    typeof questionObj.subtema === "string" &&
    questionObj.subtema.length > 1
  ) {
    return questionObj.subtema;
  }
  // Si no existe, intenta extraerlo del texto de la pregunta
  return getMainKeyword(questionObj.question);
}

const adaptQuestionFormat = (apiQuestion) => {
  return {
    question: apiQuestion.question,
    answers: apiQuestion.options,
    correctAnswer: apiQuestion.correct_answer,
    subtema: extractSubtema(apiQuestion),
  };
};

export const useTrivIAGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar una sola pregunta
  const generateSingleQuestion = async (
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    setLoading(true);
    setError(null); // Limpiar errores anteriores
    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "Eres un generador de preguntas de trivia experto. Genera solo la salida JSON.",
              },
              { role: "user", content: crearPrompt(categoria, dificultad) },
            ],
            temperature: 0.7, // Puede ajustarse para mayor o menor aleatoriedad
            max_tokens: 300,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error de API: ${response.status} - ${
            errorData.error.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extraer el JSON de la respuesta
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error(
          "La respuesta de la API no contiene un JSON válido en el formato esperado."
        );
      }

      const triviaJson = content.slice(start, end + 1);
      const triviaObj = JSON.parse(triviaJson);

      // Devolvemos el formato adaptado
      return adaptQuestionFormat(triviaObj);
    } catch (err) {
      console.error("Error al generar pregunta de trivia:", err);
      setError(
        `No se pudo generar la pregunta: ${err.message}. Por favor, revisa tu clave API o inténtalo de nuevo.`
      );
      throw err;
    } finally {
      setLoading(false); // Es importante que esto se ejecute
    }
  };

  // Función para generar múltiples preguntas para una partida
  /* const generateGameQuestions = async (numQuestions = 5, categoria = 'cultura general', dificultad = 'facil') => {
        setLoading(true);
        setError(null);
        const generatedQuestions = [];
        const uniqueQuestionsSet = new Set(); 

        let attempts = 0;
        const maxAttemptsPerQuestion = 3; 

        while (generatedQuestions.length < numQuestions && attempts < numQuestions * maxAttemptsPerQuestion) {
            try {
                const questionData = await generateSingleQuestion(categoria, dificultad);

                if (questionData && questionData.question) {
                    // Crea una cadena única para identificar la pregunta (pregunta + respuesta correcta)
                    const questionIdentifier = `${questionData.question}-${questionData.correctAnswer}`;

                    if (!uniqueQuestionsSet.has(questionIdentifier)) {
                        generatedQuestions.push(questionData);
                        uniqueQuestionsSet.add(questionIdentifier);
                        attempts = 0; 
                    } else {
                        console.warn("Pregunta duplicada generada, intentando otra...", questionData.question);
                        attempts++; 
                    }
                }
            } catch (err) {
                console.error(`Error generando pregunta (intento ${attempts + 1}):`, err);
                attempts++; 
            }
        }

        if (generatedQuestions.length < numQuestions) {
            setError(`Solo se pudieron generar ${generatedQuestions.length} de ${numQuestions} preguntas únicas. Por favor, intenta de nuevo.`);
        }

        setLoading(false);
        return generatedQuestions;
    };
*/
  const generateGameQuestions = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    setLoading(true);
    setError(null);
    const generatedQuestions = [];
    let attempts = 0;
    const subtemasYaPreguntados = [];
    while (
      generatedQuestions.length < numQuestions &&
      attempts < numQuestions * 6
    ) {
      try {
        // Pasamos subtemas ya preguntados al prompt
        const question = await generateSingleQuestionWithSubtemas(
          categoria,
          dificultad,
          subtemasYaPreguntados
        );
        if (
          question &&
          // Evita preguntas con texto igual o muy similar
          !generatedQuestions.some((q) =>
            areQuestionsSimilar(q.question, question.question)
          ) &&
          // Evita sets de respuestas iguales
          !generatedQuestions.some((q) =>
            areAnswersSetsEqual(q.answers, question.answers)
          ) &&
          // Evita respuestas correctas repetidas
          !generatedQuestions.some(
            (q) =>
              normalizeText(q.correctAnswer) ===
              normalizeText(question.correctAnswer)
          ) &&
          // Evita subtemas repetidos
          !subtemasYaPreguntados.includes(question.subtema)
        ) {
          generatedQuestions.push(question);
          // Añadimos el subtema y la respuesta correcta a la lista de subtemas a evitar
          subtemasYaPreguntados.push(question.subtema);
          subtemasYaPreguntados.push(question.correctAnswer);
        }
      } catch (err) {
        console.error(`Error generando pregunta:`, err);
      }
      attempts++;
    }
    setLoading(false);
    return generatedQuestions;
  };

  // Versión de generateSingleQuestion que acepta subtemas ya preguntados
  const generateSingleQuestionWithSubtemas = async (
    categoria,
    dificultad,
    subtemasYaPreguntados
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "Eres un generador de preguntas de trivia experto. Genera solo la salida JSON.",
              },
              {
                role: "user",
                content: crearPrompt(
                  categoria,
                  dificultad,
                  subtemasYaPreguntados
                ),
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error de API: ${response.status} - ${
            errorData.error.message || "Unknown error"
          }`
        );
      }
      const data = await response.json();
      const content = data.choices[0].message.content;
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start === -1 || end === -1) {
        throw new Error(
          "La respuesta de la API no contiene un JSON válido en el formato esperado."
        );
      }
      const triviaJson = content.slice(start, end + 1);
      const triviaObj = JSON.parse(triviaJson);
      return adaptQuestionFormat(triviaObj);
    } catch (err) {
      console.error("Error al generar pregunta de trivia:", err);
      setError(
        `No se pudo generar la pregunta: ${err.message}. Por favor, revisa tu clave API o inténtalo de nuevo.`
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateSingleQuestion, generateGameQuestions, loading, error };
};
