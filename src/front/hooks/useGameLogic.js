import { useState, useEffect, useRef } from "react";

import { useTrivIAGenerator } from "./TrivIAGenerator";

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// Esto es una función para mezclar las respuestas dentro de una pregunta
const shuffleQuestionAnswers = (question) => {
  if (!question || !question.answers) {
    return question;
  }
  const answersWithCorrectness = question.answers.map((ans) => ({
    text: ans,
    isCorrect: ans === question.correctAnswer,
  }));

  const shuffledAnswersObjects = shuffleArray(answersWithCorrectness); // Reconstruye la pregunta con las respuestas mezcladas

  return {
    ...question,
    answers: shuffledAnswersObjects.map((ansObj) => ansObj.text),
    correctAnswer: question.correctAnswer,
  };
};

const useGameLogic = () => {
  const [userName] = useState("David Duego"); 
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswerButton, setSelectedAnswerButton] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStatus, setGameStatus] = useState("inicio");
  const [internalError, setInternalError] = useState(null); 

  const timerRef = useRef(null); // Uusamos el hook de la IA

  const {
    generateGameQuestions,
    loading: generatorLoading,
    error: generatorError,
  } = useTrivIAGenerator(); 

  const error = internalError || generatorError;
  const isLoading = gameStatus === "loadingQuestions" || generatorLoading;

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }; // Funcion para que no se repitan las preguntas y sean aleatorias

  const loadAndShuffleQuestions = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    setGameStatus("loadingQuestions"); 
    setInternalError(null); 
    try {
      const generated = await generateGameQuestions(
        numQuestions,
        categoria,
        dificultad
      ); // Mezcla las preguntas y sus respuestas

      const finalQuestions = shuffleArray(
        generated.map((q) => shuffleQuestionAnswers(q))
      );

      if (finalQuestions.length > 0) {
        setShuffledQuestions(finalQuestions);
        setQuestionIndex(0);
        setCurrentQuestion(finalQuestions[0]);
        setScore(0);
        setFeedback(null);
        setSelectedAnswerButton(null);
        setGameStatus("playing"); 
      } else {
        setInternalError(
          "No se pudieron generar preguntas. Inténtalo de nuevo."
        );
        setGameStatus("inicio"); 
      }
    } catch (err) {
      console.error("Error al cargar y usar preguntas para la partida:", err);
      setInternalError(`Error al cargar preguntas: ${err.message}`);
      setGameStatus("inicio"); 
    }
  };

  
  const restartGameInternal = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    await loadAndShuffleQuestions(numQuestions, categoria, dificultad);
  };

  const startNewGameInternal = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    await loadAndShuffleQuestions(numQuestions, categoria, dificultad);
  };

  const handleTimeUp = () => {
    if (!currentQuestion) {
      return;
    }
    setFeedback("incorrect");
    setSelectedAnswerButton(null);

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswerButton(null);
      const nextQuestionIndex = questionIndex + 1;

      if (nextQuestionIndex < shuffledQuestions.length) {
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
      } else {
        setGameStatus("gameOver");
        clearInterval(timerRef.current);
      }
    }, 2000);
  }; 

  const startGame = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    await loadAndShuffleQuestions(numQuestions, categoria, dificultad);
  };

  const startRematch = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    await restartGameInternal(numQuestions, categoria, dificultad);
  }; 

  const startNewGame = async (
    numQuestions = 5,
    categoria = "cultura general",
    dificultad = "facil"
  ) => {
    await startNewGameInternal(numQuestions, categoria, dificultad);
  };

  useEffect(() => {
    if (gameStatus === "playing" && currentQuestion) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, currentQuestion]);

  const handleAnswerSelected = (selectedAnswer, buttonIndex) => {
    if (!currentQuestion || feedback || gameStatus !== "playing") return;

    clearInterval(timerRef.current);
    setSelectedAnswerButton(buttonIndex);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswerButton(null);
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < shuffledQuestions.length) {
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
      } else {
        setGameStatus("gameOver");
        clearInterval(timerRef.current);
      }
    }, 2000);
  }; 

  const totalQuestions = shuffledQuestions.length;

  return {
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
  };
};

export default useGameLogic;
