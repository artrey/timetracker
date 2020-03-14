import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { LoadingView } from "../Loading";
import DayView from "../DayView";

import "./WeekView.css";
import "../common.css";

const SECTORS_GQL = gql`
  query {
    sectors {
      name
      projects {
        id
        name
        subsystems {
          id
          name
        }
      }
    }
  }
`;

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function WeekView({ year, week }) {
  year = year || moment().isoWeekYear();
  week = week || moment().isoWeek();

  const { loading, error, data } = useQuery(SECTORS_GQL);

  const navigate = useNavigate();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    navigate("/login");
  }

  const date = moment()
    .isoWeekYear(year)
    .isoWeek(week)
    .startOf("isoWeek")
    .toDate();

  const changeWeek = offset => {
    const changer = () => {
      const dt = moment(date).add(offset, "weeks");
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
      {Array.of(...Array(7)).map((_, idx) => (
        <DayView key={idx} date={addDays(date, idx)} />
      ))}
    </>
  );
}
