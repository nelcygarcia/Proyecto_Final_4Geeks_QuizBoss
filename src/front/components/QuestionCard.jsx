import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, feedback, selectedAnswerButton, timeLeft, onAnswerSelected, disabled }) => {
  return (
    <div className="question-card p-4 rounded shadow d-flex flex-column align-items-center">
      <div className="timer-display mb-4">
        <span>Tiempo restante: </span>
        <span className={`timer-number ${timeLeft <= 10 ? 'timer-warning' : ''}`}>{timeLeft}s</span>
      </div>
      <h2 className="mb-5 text-center question-text">{question.question}</h2>

      <div className="d-flex flex-column gap-3 answers-grid">
        {question.answers.map((answer, index) => {
          let buttonClass = "btn btn-lg answer-button";

          if (feedback && selectedAnswerButton === index) {
            buttonClass += (feedback === 'correct' ? ' btn-success-feedback' : ' btn-danger-feedback');
          } else if (feedback && question.correctAnswer === answer) {
            buttonClass += ' btn-success-feedback';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => onAnswerSelected(answer, index)}
              disabled={disabled}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;