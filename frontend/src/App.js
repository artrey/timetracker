import React from "react";
import { Router } from "@reach/router";

import LoginView from "./components/LoginView";
import WeekView from "./components/WeekView";
import ErrorPageView from "./components/ErrorPageView";

export default function App() {
  return (
    <div className="container">
      <Router>
        <LoginView path="/login" />
        <WeekView path="/:year/:week" />
        <WeekView path="/" />
        <ErrorPageView path="*" />
      </Router>
    </div>
  );
}
