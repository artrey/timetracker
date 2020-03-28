import React from "react";
import { useNavigate } from "@reach/router";
import moment from "moment";

import CarouselUserView from "../CarouselUserView";
import { firstDayOfWeek } from "../../date";

import "./ReportsView.css";
import "../common.css";

const apiLink = process.env.REACT_APP_SERVER_ENDPOINT + "/api/v1";
const reportLink = apiLink + "/timetracker/report";
const weeklyReportLink = (year, week) => {
  return `${reportLink}/weekly/${year}/${week}/`;
};
const monthlyReportLink = (year, month) => {
  return `${reportLink}/monthly/${year}/${month}/`;
};

export default function ReportsView({ year }) {
  const navigate = useNavigate();

  year = +year || moment().isoWeekYear();

  const weeks = moment(firstDayOfWeek(year + 1, 0)).isoWeek();
  const currentYear = moment().year();
  const currentWeek = currentYear === year ? moment().isoWeek() : -1;
  const currentMonth = currentYear === year ? moment().month() + 1 : -1;

  const changeYear = offset => {
    return () => {
      navigate("/reports/" + (year + offset));
    };
  };

  return (
    <CarouselUserView
      onLeftClick={changeYear(-1)}
      onRightClick={changeYear(1)}
      headerContent={
        <>
          <div className="row">
            <div className="col centered">{year} год</div>
          </div>
          <div className="row">
            <div className="col centered">
              <h2>Отчеты</h2>
            </div>
          </div>
        </>
      }
      additionalMenuItems={
        <button
          className="dropdown-item"
          type="button"
          onClick={() => navigate(`/${year}/${moment().isoWeek()}`)}
        >
          Списание времени
        </button>
      }
    >
      <h3 className="centered report-header">Недельные отчеты</h3>
      <div className="row justify-content-around">
        {Array.of(...Array(weeks)).map((_, idx) => {
          const week = idx + 1;
          const btnColor = week === currentWeek ? "btn-info" : "btn-light";
          return (
            <a
              key={week}
              type="button"
              className={`btn ${btnColor} btn-download`}
              href={weeklyReportLink(year, week)}
              target="_blank noopener noreferrer"
            >
              {week}
            </a>
          );
        })}
      </div>
      <h3 className="centered report-header">Месячные отчеты</h3>
      <div className="row justify-content-around">
        {Array.of(...Array(12)).map((_, idx) => {
          const month = idx + 1;
          const btnColor = month === currentMonth ? "btn-info" : "btn-light";
          return (
            <a
              key={month}
              type="button"
              className={`btn ${btnColor} btn-download`}
              href={monthlyReportLink(year, month)}
              target="_blank noopener noreferrer"
            >
              {month}
            </a>
          );
        })}
      </div>
    </CarouselUserView>
  );
}
