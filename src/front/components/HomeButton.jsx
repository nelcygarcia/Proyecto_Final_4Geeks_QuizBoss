import React, { useState } from 'react';
import './HomeButton.css';

const ConfirmModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>¿Estás seguro que quieres salir? Tu progreso se perderá.</p>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>Salir</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const HomeButton = ({ onClick }) => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (onClick) onClick();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        className="home-button"
        onClick={handleButtonClick}
        aria-label="Volver atrás"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <ConfirmModal show={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />
    </>
  );
};

export default HomeButton;
