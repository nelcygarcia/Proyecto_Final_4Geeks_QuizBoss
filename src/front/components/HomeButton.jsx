import React from 'react';

const HomeButton = ({ onClick }) => {
  return (
    
    <button
      className="btn btn-dark p-2 rounded-circle shadow-sm d-flex justify-content-center align-items-center"
      onClick={onClick}
      style={{ marginLeft: '20px', marginTop: '5px' }}
    >
      <span className="fs-4">⬅️</span> 
    </button>
  );
};

export default HomeButton;