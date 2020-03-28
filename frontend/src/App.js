import React from "react";
import { Router } from "@reach/router";

import LoginView from "./components/LoginView";
import ReportsView from "./components/ReportsView";
import WeekView from "./components/WeekView";
import ErrorPageView from "./components/ErrorPageView";

export default function App() {
  return (
    <div className="container">
      <Router>
        <LoginView path="/login" />
        <ReportsView path="/reports/:year" />
        <ReportsView path="/reports" />
        <WeekView path="/:year/:week" />
        <WeekView path="/" />
        <ErrorPageView path="*" />
      </Router>
    </div>
  );
}
