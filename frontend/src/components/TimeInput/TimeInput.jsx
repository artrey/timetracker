import React from "react";
import TimePicker from "react-times";
// use material theme for TimePicker
import "react-times/css/material/default.css";
import "./TimeInput.css";

export default function TimeInput({ hours, minutes, onTimeChange }) {
  const timeString = () => {
    const h = hours === 0 ? "00" : hours;
    const m = minutes === 0 ? "00" : minutes;
    return h && m ? `${h}:${m}` : null;
  };

  return <TimePicker onTimeChange={onTimeChange} time={timeString()} />;
}
