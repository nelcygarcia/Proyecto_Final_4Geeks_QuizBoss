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
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray([...allQuestions]));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswerButton, setSelectedAnswerButton] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStatus, setGameStatus] = useState('idle');
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(15);
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

  const restartGameInternal = (finalScore = 0) => {
    if (gameStatus === 'playing') {
      alert(`¡Juego terminado! Tu puntuación final es: ${finalScore} de ${shuffledQuestions.length}`);
    }
    setQuestionIndex(0);
    setCurrentQuestion(shuffledQuestions.length > 0 ? shuffledQuestions[0] : null);
    setScore(0);
    setFeedback(null);
    setSelectedAnswerButton(null);
    setGameStatus('playing');
  };

  const startNewGameInternal = () => {
    const newlyShuffledQuestions = shuffleArray([...allQuestions]);
    setShuffledQuestions(newlyShuffledQuestions);
    setQuestionIndex(0);
    setCurrentQuestion(newlyShuffledQuestions.length > 0 ? newlyShuffledQuestions[0] : null);
    setScore(0);
    setFeedback(null);
    setSelectedAnswerButton(null);
    setGameStatus('playing');
  };

  const handleTimeUp = () => {
    if (!currentQuestion) {
        return;
    }

    setFeedback('incorrect');
    setSelectedAnswerButton(null);

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswerButton(null);
      const nextQuestionIndex = questionIndex + 1;

      if (nextQuestionIndex < shuffledQuestions.length) {
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(shuffledQuestions[nextQuestionIndex]);
      } else {
        setGameStatus('gameOver');
        clearInterval(timerRef.current);
      }
    }, 2000);
  };

  const startGame = () => {
    setGameStatus('playing');
    const initialShuffled = shuffleArray([...allQuestions]);
    setShuffledQuestions(initialShuffled);
    setQuestionIndex(0);
    setCurrentQuestion(initialShuffled.length > 0 ? initialShuffled[0] : null);
    setScore(0);
    setFeedback(null);
    setSelectedAnswerButton(null);
  };

  const startRematch = () => {
    restartGameInternal(score);
  };

  const startNewGame = () => {
    startNewGameInternal();
  };

  useEffect(() => {
    if (gameStatus === 'playing' && currentQuestion) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, currentQuestion]);

  const handleAnswerSelected = (selectedAnswer, buttonIndex) => {
    if (!currentQuestion || feedback || gameStatus !== 'playing') return;

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
      } else {
        setGameStatus('gameOver');
        clearInterval(timerRef.current);
      }
    }, 2000);
  };

  const totalQuestions = allQuestions.length;

  return {
    userName,
    score,
    currentQuestion,
    feedback,
    selectedAnswerButton,
    timeLeft,
    gameStatus,
    totalQuestions,
    handleAnswerSelected,
    startGame,
    startRematch,
    startNewGame,
  };
};

export default useGameLogic;