import React from 'react';

const ResetBuildingsButton = ({ onReset }) => {
  const handleClick = () => {
    localStorage.removeItem("buildings-avaliable");
    onReset();
  };

  return (
    <button onClick={handleClick}>
      Reset Buildings
    </button>
  );
};

export default ResetBuildingsButton;
