import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

import TimeInput from "../TimeInput";
import ActivityView from "../ActivityView";

import "./DayView.css";

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

  const addActivity = () => {
    setActivities([...activities, {}]);
  };

  console.log(date);
  return (
    <div className="card day-card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-sm-2 col-12">
            {dayToTitle(moment(date).day())}
          </div>
          <div className="col-sm-5 col-12">
            <TimeInput />
          </div>
          <div className="col-sm-5 col-12">
            <TimeInput />
          </div>
        </div>
      </div>
      <div className="card-body">
        {activities.map(a => (
          <ActivityView key={a.id} />
        ))}
        <div className="centered">
          <button type="button" class="btn btn-success" onClick={addActivity}>
            Добавить деятельность
          </button>
        </div>
      </div>
    </div>
  );
}
