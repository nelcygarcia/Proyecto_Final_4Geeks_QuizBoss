import React from 'react';
import './UserProfile.css';

const UserProfile = ({ userName, score }) => {
  return (
    <div className="user-profile-box p-3 rounded shadow-sm d-flex flex-column align-items-start">
      <div className="d-flex align-items-center mb-2">
        <div className="me-2 user-avatar-emoji">
          <span>😊</span>
        </div>
        <span className="fw-bold fs-5 user-name">{userName}</span>
      </div>
      <div className="d-flex align-items-center">
        <span className="me-1 score-star">🧠</span>
        <span className="fw-bold fs-5 score-number">{score}</span>
      </div>
    </div>
  );
};

export default UserProfile;