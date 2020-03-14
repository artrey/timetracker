import React, { useState } from "react";
import TimePicker from "react-times";
// use material theme for TimePicker
import "react-times/css/material/default.css";
import "./TimeInput.css";

export default function TimeInput({ initialHour, initialMinute }) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  const onTimeChange = ({ hour, minute }) => {
    setHour(hour);
    setMinute(minute);
  };

  const timeString = () => {
    if (hour === 0 && minute === 0) return "00:00";
    return hour && minute ? `${hour}:${minute}` : null;
  };

  return <TimePicker onTimeChange={onTimeChange} time={timeString()} />;
}
