import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";

import { LoadingView } from "../Loading";
import TimeInput from "../TimeInput";
import ActivityView from "../ActivityView";

import {
  GET_WORK_DAY,
  UPDATE_WORK_DAY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY
} from "./graphql";

import "./DayView.css";
import "../common.css";
import { errorToMessages } from "../../utils";

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
  const [errors, setErrors] = useState([]);

  const { loading, error, data } = useQuery(GET_WORK_DAY, {
    variables: { day: dateToString(day) }
  });
  const [updateWorkDay] = useMutation(UPDATE_WORK_DAY);
  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    update(cache, { data: { updateActivity } }) {
      const dayString = dateToString(day);
      const { workDay } = cache.readQuery({
        query: GET_WORK_DAY,
        variables: { day: dayString }
      });
      if (!workDay.activities.find(a => a.id === updateActivity.activity.id)) {
        cache.writeQuery({
          query: GET_WORK_DAY,
          variables: { day: dayString },
          data: {
            workDay: {
              ...workDay,
              activities: [...workDay.activities, updateActivity.activity]
            }
          }
        });
      }
    }
  });
  const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
    update(cache, { data: { removeActivity } }) {
      const dayString = dateToString(day);
      const { workDay } = cache.readQuery({
        query: GET_WORK_DAY,
        variables: { day: dayString }
      });
      if (workDay.activities.find(a => a.id === removeActivity.id)) {
        cache.writeQuery({
          query: GET_WORK_DAY,
          variables: { day: dayString },
          data: {
            workDay: {
              ...workDay,
              activities: workDay.activities.filter(
                a => a.id !== removeActivity.id
              )
            }
          }
        });
      }
    }
  });

  if (loading) {
    return <LoadingView width="10vw" height="10vh" />;
  }

  if (error) {
    return (
      <div className="row">
        <div class="col alert alert-danger centered" role="alert">
          {errorToMessages(error).map(e => (
            <span key={e}>{e}</span>
          ))}
        </div>
      </div>
    );
  }

  const dt = moment(day);
  const momentDt = dt.format("YYYYMMDD");
  const collapsed = moment().format("YYYYMMDD") !== momentDt;
  const blockId = `block-${momentDt}`;
  const start = moment(data.workDay.start, "HH:mm:ss");
  const finish = moment(data.workDay.finish, "HH:mm:ss");

  const updateWorkDayTime = async time => {
    try {
      setErrors([]);
      await updateWorkDay({
        variables: {
          day: dateToString(day),
          start: data.workDay.start,
          finish: data.workDay.finish,
          ...time
        }
      });
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  const onActivityUpdated = async activityData => {
    try {
      setErrors([]);
      await updateActivity({
        variables: {
          workDay: data.workDay.id,
          ...activityData
        }
      });
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  const onActivityRemoved = async id => {
    try {
      setErrors([]);
      await removeActivity({
        variables: { id }
      });
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  return (
    <div className="card day-card">
      <div className="card-header day-card-bg">
        {errors.length > 0 && (
          <div className="row">
            <div className="col alert alert-danger centered" role="alert">
              {errors.map(e => (
                <span key={e}>{e}</span>
              ))}
            </div>
          </div>
        )}
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
              onTimeChange={({ hour, minute }) =>
                updateWorkDayTime({ start: `${hour}:${minute}` })
              }
            />
          </div>
          <div className="col-lg-5 col-12 vertical-offset-lg">
            <TimeInput
              hours={finish.format("HH")}
              minutes={finish.format("mm")}
              onTimeChange={({ hour, minute }) =>
                updateWorkDayTime({ finish: `${hour}:${minute}` })
              }
            />
          </div>
        </div>
      </div>
      <div id={blockId} className={`collapse ${collapsed ? "" : "show"}`}>
        <div className="card-body">
          {data.workDay.activities.map(a => (
            <ActivityView
              key={a.id}
              {...a}
              subsystem={a.subsystem.id}
              subsystems={subsystems}
              onUpdate={onActivityUpdated}
              onRemove={onActivityRemoved}
            />
          ))}
          <div className="centered">
            <button
              type="button"
              className="btn btn-light no-box-shadow"
              onClick={() =>
                onActivityUpdated({
                  subsystem:
                    subsystems && subsystems.length && subsystems[0].id,
                  time: "00:00"
                })
              }
            >
              ＋ Добавить деятельность
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
