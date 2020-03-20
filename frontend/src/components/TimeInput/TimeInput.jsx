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
    const h = hour === 0 ? "00" : hour;
    const m = minute === 0 ? "00" : minute;
    return h && m ? `${h}:${m}` : null;
  };

  return <TimePicker onTimeChange={onTimeChange} time={timeString()} />;
}
