import React from 'react';
import './HomeButton.css';

const HomeButton = ({ onClick }) => {
  return (
    <button
      className="home-button"
      onClick={onClick}
      aria-label="Volver atrás"
    >
      <i class="fa-solid fa-arrow-left"></i>
    </button>
  );
};

export default HomeButton;