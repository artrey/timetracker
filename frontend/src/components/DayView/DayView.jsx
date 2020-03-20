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

export default function DayView({
  date,
  start,
  finish,
  activities,
  subsystems
}) {
  const dt = moment(date);
  const momentDt = dt.format("YYYYMMDD");
  const collapsed = moment().format("YYYYMMDD") !== momentDt;
  const blockId = `block-${momentDt}`;
  const momentStart = start ? moment(start, "HH:mm:ss") : moment();
  const momentFinish = finish ? moment(finish, "HH:mm:ss") : moment();

  const addActivity = () => {
    console.log("add activity");
  };

  return (
    <div className="card day-card">
      <div className="card-header text-white day-card-bg">
        <div className="row align-items-center">
          <div className="col-lg-2 col-12">
            <div className="row">
              <button
                type="button"
                className={`btn btn-transparent col no-box-shadow ${
                  collapsed ? "collapsed" : ""
                }`}
                data-toggle="collapse"
                href={`#${blockId}`}
                aria-expanded={collapsed ? "false" : "true"}
                aria-controls={blockId}
              >
                <div className="row align-items-center">
                  <div className="col-auto expander-symbol">»</div>
                  <div className="col-11 row week-day-line">
                    <div className="col-lg-12 col-6">
                      {dayToTitle(dt.day())}
                    </div>
                    <div className="col-lg-12 col-6">
                      {dt.format("DD-MM-YYYY")}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput
              initialHour={momentStart.format("HH")}
              initialMinute={momentStart.format("mm")}
            />
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput
              initialHour={momentFinish.format("HH")}
              initialMinute={momentFinish.format("mm")}
            />
          </div>
        </div>
      </div>
      <div id={blockId} className={`collapse ${collapsed ? "" : "show"}`}>
        <div className="card-body">
          {activities.map(a => (
            <ActivityView
              key={a.id}
              subsystems={subsystems}
              onRemove={console.log}
              subsystemId={a.subsystem.id}
              comment={a.comment}
              hours={a.hours}
              minutes={a.minutes}
            />
          ))}
          <div className="centered">
            <button
              type="button"
              className="btn btn-light no-box-shadow"
              onClick={addActivity}
            >
              ＋ Добавить деятельность
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
