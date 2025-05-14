import React from 'react';

const ResetBuildingsButton = ({ onReset }) => {
  const handleClick = () => {
    localStorage.removeItem("buildings-avaliable");
    onReset(); // Trigger reload
  };

  return (
    <button onClick={handleClick}>
      Reset Buildings
    </button>
  );
};

export default ResetBuildingsButton;
