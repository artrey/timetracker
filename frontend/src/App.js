import React from "react";
import "./App.css";

import { Router } from "@reach/router";

import LoginForm from "./components/LoginForm";
import WeekView from "./components/WeekView";
import ErrorPageView from "./components/ErrorPageView";

export default function App() {
  return (
    <div className="App">
      <Router>
        <LoginForm path="/login" />
        <WeekView path="/:year/:week" />
        <WeekView path="/" />
        <ErrorPageView path="*" />
      </Router>
    </div>
  );
}
