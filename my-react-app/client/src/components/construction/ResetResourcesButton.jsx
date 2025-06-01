import React from 'react';

const ResetResourcesButton = ({ onReset }) => {
  const handleClick = () => {
    localStorage.removeItem("resources");
    onReset(); 
  };

  return (
    <button onClick={handleClick}>
      Reset Resources
    </button>
  );
};

export default ResetResourcesButton;
