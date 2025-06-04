import React, { useState, useEffect } from 'react';
import './SalaDeJuegos.css';

const SalaDeJuego = () => {
  const [userName] = useState('David Duego');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswerButton, setSelectedAnswerButton] = useState(null);

  const allQuestions = [
    {
      question: '¿Cuál es la capital de Francia?',
      answers: ['Londres', 'Berlín', 'París', 'Roma'],
      correctAnswer: 'París',
    },
    {
      question: '¿Qué planeta es conocido como el Planeta Rojo?',
      answers: ['Júpiter', 'Marte', 'Venus', 'Saturno'],
      correctAnswer: 'Marte',
    },
    {
      question: '¿Cuántos continentes hay en la Tierra?',
      answers: ['5', '6', '7', '8'],
      correctAnswer: '7',
    },
    {
      question: '¿Quién escribió "El Quijote"?',
      answers: ['Miguel de Cervantes', 'Gabriel García Márquez', 'Federico García Lorca', 'Jorge Luis Borges'],
      correctAnswer: 'Miguel de Cervantes',
    },
    {
      question: '¿En qué año llegó el hombre a la luna?',
      answers: ['1965', '1969', '1971', '1975'],
      correctAnswer: '1969',
    },
    {
      question: '¿Cuál es el océano más grande de la Tierra?',
      answers: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
      correctAnswer: 'Pacífico',
    },
    {
      question: '¿Qué elemento químico tiene el símbolo "O"?',
      answers: ['Oro', 'Oxígeno', 'Osmio', 'Óxido'],
      correctAnswer: 'Oxígeno',
    },
    {
      question: '¿Cuál es la moneda de Japón?',
      answers: ['Yuan', 'Won', 'Yen', 'Dólar'],
      correctAnswer: 'Yen',
    },
    {
      question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
      answers: ['206', '210', '198', '200'],
      correctAnswer: '206',
    },
    {
      question: '¿Qué famoso científico formuló la Teoría de la Relatividad?',
      answers: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'],
      correctAnswer: 'Albert Einstein',
    },
    {
      question: '¿En qué país se encuentra la Gran Muralla China?',
      answers: ['India', 'Japón', 'China', 'Corea del Sur'],
      correctAnswer: 'China',
    },
  ];

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

  useEffect(() => {
    const newShuffledQuestions = shuffleArray([...allQuestions]);
    setShuffledQuestions(newShuffledQuestions);
    if (newShuffledQuestions.length > 0) {
      setCurrentQuestion(newShuffledQuestions[0]);
    }
  }, []);

  const handleAnswerSelected = (selectedAnswer, buttonIndex) => {
    if (!currentQuestion || feedback) return;

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
        alert(`¡Juego terminado! Tu puntuación final es: ${score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)} de ${shuffledQuestions.length}`);
        const restartedShuffledQuestions = shuffleArray([...allQuestions]);
        setShuffledQuestions(restartedShuffledQuestions);
        setQuestionIndex(0);
        setScore(0);
        setCurrentQuestion(restartedShuffledQuestions[0]);
      }
    }, 4000);
  };

  return (
    <div className="game-container">
      <header className="game-header d-flex justify-content-start align-items-start">
        <div className="user-profile-box p-3 rounded shadow-sm d-flex flex-column align-items-start">
          <div className="d-flex align-items-center mb-2">
            <div className="me-2 user-avatar-emoji">
              <span>😊</span>
            </div>
            <span className="fw-bold fs-5 user-name">{userName}</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-1 score-star">⭐</span>
            <span className="fw-bold fs-5 score-number">{score}</span>
          </div>
        </div>
      </header>

      <main className="game-main flex-grow-1 d-flex justify-content-center align-items-center p-3">
        {currentQuestion ? (
          <div className="question-card p-4 rounded shadow d-flex flex-column align-items-center">
            <h2 className="mb-5 text-center question-text">{currentQuestion.question}</h2>

            <div className="d-flex flex-column gap-3 answers-grid">
              {currentQuestion.answers.map((answer, index) => {
                let buttonClass = "btn btn-lg answer-button";
                let buttonStyle = {};

                if (feedback && selectedAnswerButton === index) {
                  buttonClass += (feedback === 'correct' ? ' btn-success-feedback' : ' btn-danger-feedback');
                } else if (feedback && currentQuestion.correctAnswer === answer) {
                  buttonClass += ' btn-success-feedback';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    style={buttonStyle}
                    onClick={() => handleAnswerSelected(answer, index)}
                    disabled={feedback !== null}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-muted">Cargando preguntas o juego terminado...</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalaDeJuego;