import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { LoadingView } from "./Loading";
import DayView from "./DayView";

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

export default function WeekView({ year = 2020, week = 11 }) {
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

  return (
    <>
      <h1>
        Week view ({year}/{week})
      </h1>
      {Array.of(...Array(7)).map((_, idx) => (
        <DayView key={idx} date={addDays(date, idx)} />
      ))}
    </>
  );
}
