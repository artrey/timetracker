import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

import TimeInput from "../TimeInput";
import ActivityView from "../ActivityView";

import "./DayView.css";
import "../common.css";

function dayToTitle(day) {
  switch (day) {
    case 1:
      return "Понедельник";
    case 2:
      return "Вторник";
    case 3:
      return "Среда";
    case 4:
      return "Четверг";
    case 5:
      return "Пятница";
    case 6:
      return "Суббота";
    case 0:
      return "Воскресение";
    default:
      return "ВЫХОДНОЙ :)";
  }
}

export default function DayView({ date, sectors }) {
  const [activities, setActivities] = useState([]);
  const dt = moment(date);

  const addActivity = () => {
    setActivities([...activities, {}]);
  };

  return (
    <div className="card day-card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-lg-2 col-12">
            <div className="row">
              <div className="col-lg-12 col-6">{dayToTitle(dt.day())}</div>
              <div className="col-lg-12 col-6">{dt.format("DD-MM-YYYY")}</div>
            </div>
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput />
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput />
          </div>
        </div>
      </div>
      <div className="card-body">
        {activities.map(a => (
          <ActivityView key={a.id} />
        ))}
        <div className="centered">
          <button
            type="button"
            className="btn btn-success"
            onClick={addActivity}
          >
            Добавить деятельность
          </button>
        </div>
      </div>
    </div>
  );
}
