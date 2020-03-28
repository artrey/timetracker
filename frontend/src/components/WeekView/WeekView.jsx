import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useNavigate } from "@reach/router";
import moment from "moment";

import { LoadingView } from "../Loading";
import CarouselUserView from "../CarouselUserView";
import DayView from "../DayView";
import { GET_SUBSYSTEMS } from "./graphql";
import { firstDayOfWeek as fdow, addDays } from "../../date";

import "../common.css";

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

  year = +year || moment().isoWeekYear();
  week = +week || moment().isoWeek();

  const firstDayOfWeek = fdow(year, week);

  const changeWeek = offset => {
    const changer = () => {
      const dt = moment(firstDayOfWeek).add(offset, "weeks");
      navigate(`/${dt.isoWeekYear()}/${dt.isoWeek()}`);
    };
    return changer;
  };

  return (
    <CarouselUserView
      onLeftClick={changeWeek(-1)}
      onRightClick={changeWeek(1)}
      headerContent={
        <>
          <div className="row">
            <div className="col centered">{year} год</div>
          </div>
          <div className="row">
            <div className="col centered">
              <h2>{week} неделя</h2>
            </div>
          </div>
        </>
      }
      additionalMenuItems={
        <button
          className="dropdown-item"
          type="button"
          onClick={() => navigate("/reports/" + year)}
        >
          Отчеты
        </button>
      }
    >
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
    </CarouselUserView>
  );
}
