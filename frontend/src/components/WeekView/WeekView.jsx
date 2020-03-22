import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { LoadingView } from "../Loading";
import DayView from "../DayView";
import { GET_SUBSYSTEMS } from "./graphql";

import "./WeekView.css";
import "../common.css";

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function WeekView({ year, week }) {
  const {
    loading: subsystemsLoading,
    error: subsystemsError,
    data: subsystemsData
  } = useQuery(GET_SUBSYSTEMS);

  const navigate = useNavigate();

  if (subsystemsError) {
    navigate("/login");
    return <LoadingView />;
  }

  if (subsystemsLoading) {
    return <LoadingView />;
  }

  year = year || moment().isoWeekYear();
  week = week || moment().isoWeek();

  const firstDayOfWeek = moment()
    .isoWeekYear(year)
    .isoWeek(week)
    .startOf("isoWeek")
    .toDate();

  const changeWeek = offset => {
    const changer = () => {
      const dt = moment(firstDayOfWeek).add(offset, "weeks");
      navigate(`/${dt.isoWeekYear()}/${dt.isoWeek()}`);
    };
    return changer;
  };

  return (
    <>
      <div className="row align-items-center justify-content-center">
        <div className="col-1">
          <button
            type="button"
            className="btn btn-light change-week-button-left"
            onClick={changeWeek(-1)}
          >
            <span className="change-week">{"<"}</span>
          </button>
        </div>
        <div className="col-auto">
          <div className="row">
            <div className="col centered">{year} год</div>
          </div>
          <div className="row">
            <div className="col centered">
              <h2>{week} неделя</h2>
            </div>
          </div>
        </div>
        <div className="col-1">
          <button
            type="button"
            className="btn btn-light"
            onClick={changeWeek(1)}
          >
            <span className="change-week">{">"}</span>
          </button>
        </div>
      </div>
      {Array.of(...Array(7)).map((_, idx) => {
        const day = addDays(firstDayOfWeek, idx);
        return (
          <DayView
            key={moment(day).format("YYYYMMDD")}
            day={day}
            subsystems={subsystemsData.subsystems}
          />
        );
      })}
    </>
  );
}
