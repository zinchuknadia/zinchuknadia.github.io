import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CitySatisfaction = ({ satisfaction }) => {
  return (
    <div style={{ width: 120, height: 120 }}>
      <CircularProgressbar
        value={satisfaction}
        text={`${satisfaction}%`}
        styles={buildStyles({
          textColor: "#333",
          pathColor: `rgba(62, 152, 199, ${satisfaction / 100})`,
          textColor: "#3e98c7",
          trailColor: "#eee",
        })}
      />
      <p style={{ textAlign: "center", marginTop: "10px" }}>Satisfaction</p>
    </div>
  );
};

export default CitySatisfaction;
