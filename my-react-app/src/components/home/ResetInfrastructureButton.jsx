import React from 'react';

const ResetInfrastructureButton = ({ onReset }) => {
  const handleClick = () => {
    localStorage.removeItem('infrastructure');
    onReset(); 
  };

  return (
    <button onClick={handleClick}>
      Reset Infrastructure
    </button>
  );
};

export default ResetInfrastructureButton;
