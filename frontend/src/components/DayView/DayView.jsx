import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";

import { LoadingView } from "../Loading";
import TimeInput from "../TimeInput";
import ActivityView from "../ActivityView";

import { GET_WORK_DAY, UPDATE_WORK_DAY, UPDATE_ACTIVITY } from "./graphql";

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

function dateToString(date) {
  return moment(date).format("YYYY-MM-DD");
}

export default function DayView({ day, subsystems }) {
  // const [errors, setErrors] = useState([]);
  // const [uid, setUid] = useState(id);
  // // const [activities, setActivities] = useState(initialActivities);

  const { loading, error, data } = useQuery(GET_WORK_DAY, {
    variables: { day: dateToString(day) }
  });
  const [updateWorkDay] = useMutation(UPDATE_WORK_DAY);
  const [updateActivity] = useMutation(UPDATE_ACTIVITY);

  if (loading) {
    return <LoadingView width="10vw" height="10vh" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const dt = moment(day);
  const momentDt = dt.format("YYYYMMDD");
  const collapsed = moment().format("YYYYMMDD") !== momentDt;
  const blockId = `block-${momentDt}`;
  const start = moment(data.workDay.start, "HH:mm:ss");
  const finish = moment(data.workDay.finish, "HH:mm:ss");

  // const updateWorkDay = async () => {
  //   // const { data } = await updateWorkDayMutation({
  //   //   variables: { day, start, finish }
  //   // });
  //   // setUid(data.workDay.id);
  //   // return data.workDay.id;
  // };

  // const updateActivity = async (subsystemId, time, comment) => {
  //   // try {
  //   //   const workDayId = uid ? uid : await updateWorkDay();
  //   //   const { data } = await updateActivityMutation({
  //   //     variables: { workDay: workDayId, subsystem: subsystemId, time, comment }
  //   //   });
  //   //   const activity = activities.find(a => a.id === data.activity.id);
  //   // } catch (ex) {
  //   //   if (ex.graphQLErrors && ex.graphQLErrors.length > 0) {
  //   //     setErrors(ex.graphQLErrors.map(err => err.message));
  //   //   } else {
  //   //     setErrors([ex.message]);
  //   //   }
  //   // }
  // };

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
              hours={start.format("HH")}
              minutes={start.format("mm")}
            />
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput
              hours={finish.format("HH")}
              minutes={finish.format("mm")}
            />
          </div>
        </div>
      </div>
      <div id={blockId} className={`collapse ${collapsed ? "" : "show"}`}>
        <div className="card-body">
          {/* {activities.map(a => (
            <ActivityView
              key={a.id}
              {...a}
              subsystems={subsystems}
              onRemove={console.log}
            />
          ))} */}
          <div className="centered">
            <button
              type="button"
              className="btn btn-light no-box-shadow"
              // onClick={addActivity}
            >
              ＋ Добавить деятельность
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
