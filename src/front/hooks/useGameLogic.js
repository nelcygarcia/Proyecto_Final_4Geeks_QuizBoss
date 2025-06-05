import { useState, useEffect, useRef } from 'react';
import { allQuestions } from '../data/questions';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const useGameLogic = () => {
  const [userName] = useState('David Duego');
  // Inicializa shuffledQuestions directamente para asegurar que siempre haya preguntas
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray([...allQuestions]));
  const [questionIndex, setQuestionIndex] = useState(0);
  // currentQuestion se inicializa con la primera pregunta del array ya aleatorio 
  const [currentQuestion, setCurrentQuestion] = useState(shuffledQuestions.length > 0 ? shuffledQuestions[0] : null);

  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswerButton, setSelectedAnswerButton] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  const startTimer = () => {
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const resetGame = (finalScore = 0) => {
    //console.log('resetGame llamado, puntuación final:', finalScore);
    alert(`¡Juego terminado! Tu puntuación final es: ${finalScore} de ${shuffledQuestions.length}`);
    const restartedShuffledQuestions = shuffleArray([...allQuestions]);
    setShuffledQuestions(restartedShuffledQuestions);
    setQuestionIndex(0);
    setScore(0);
    // Asegurarse de que setCurrentQuestion siempre tenga un valor válido al reiniciar
    setCurrentQuestion(restartedShuffledQuestions.length > 0 ? restartedShuffledQuestions[0] : null);
    startTimer();
  };

  const handleTimeUp = () => {
    console.log('handleTimeUp llamado. Pregunta actual:', currentQuestion);
    if (!currentQuestion) {
        // Aquí podríamos añadir un setFeedback('incorrect') y avanzar si aún así se da
        // setFeedback('incorrect');
        // setTimeout(() => {
        //     setFeedback(null);
        //     const nextQuestionIndex = questionIndex + 1;
        //     if (nextQuestionIndex < shuffledQuestions.length) {
        //         setQuestionIndex(nextQuestionIndex);
        //         setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
        //         startTimer();
        //     } else {
        //         resetGame(score);
        //     }
        // }, 0); 
        return; // Retornamos para evitar errores si por alguna razón sigue siendo null
    }

    setFeedback('incorrect');
    setSelectedAnswerButton(null);

    setTimeout(() => {
      console.log('Transición completada. Pasa a la siguiente pregunta');
      setFeedback(null);
      setSelectedAnswerButton(null); // Asegurarse de que se deseleccione el botón
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < shuffledQuestions.length) {
        
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
        startTimer();
      } else {
        
        resetGame(score);
      }
    }, 2000);
  };

  // El useEffect inicial ahora solo inicia el timer, ya que las preguntas ya están inicializadas
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); 

  const handleAnswerSelected = (selectedAnswer, buttonIndex) => {
    if (!currentQuestion || feedback) return;

    clearInterval(timerRef.current);
    setSelectedAnswerButton(buttonIndex);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswerButton(null);
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < shuffledQuestions.length) {
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
        startTimer();
      } else {
        resetGame(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0));
      }
    }, 2000);
  };

  return {
    userName,
    score,
    currentQuestion,
    feedback,
    selectedAnswerButton,
    timeLeft,
    handleAnswerSelected,
    resetGame,
  };
};

export default useGameLogic;