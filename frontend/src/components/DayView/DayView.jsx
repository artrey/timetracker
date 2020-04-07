import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { LoadingContent } from "../Loading";
import ActivityView from "../ActivityView";
import { errorToMessages } from "../../utils";
import { dateToString, dayToTitle, minutesToString } from "../../date";

import { WORK_DAY_TIME_CHANGED } from "../../redux/actions";
import { GET_WORK_DAY, UPDATE_ACTIVITY, REMOVE_ACTIVITY } from "./graphql";

import "./DayView.css";
import "../common.css";

export default function DayView({ day, subsystems }) {
  const [errors, setErrors] = useState([]);

  const dayString = dateToString(day);

  const { loading, error, data } = useQuery(GET_WORK_DAY, {
    variables: { day: dateToString(day) },
  });
  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    update(cache, { data: { updateActivity } }) {
      const { workDay } = cache.readQuery({
        query: GET_WORK_DAY,
        variables: { day: dayString },
      });
      if (
        !workDay.activities.find((a) => a.id === updateActivity.activity.id)
      ) {
        cache.writeQuery({
          query: GET_WORK_DAY,
          variables: { day: dayString },
          data: {
            workDay: {
              ...workDay,
              activities: [...workDay.activities, updateActivity.activity],
            },
          },
        });
      }
    },
  });
  const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
    update(cache, { data: { removeActivity } }) {
      const { workDay } = cache.readQuery({
        query: GET_WORK_DAY,
        variables: { day: dayString },
      });
      if (workDay.activities.find((a) => a.id === removeActivity.id)) {
        cache.writeQuery({
          query: GET_WORK_DAY,
          variables: { day: dayString },
          data: {
            workDay: {
              ...workDay,
              activities: workDay.activities.filter(
                (a) => a.id !== removeActivity.id
              ),
            },
          },
        });
      }
    },
  });

  const totalWorkTime = useSelector((state) => state[dayString]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (data && data.workDay && data.workDay.activities)
      dispatch({
        type: WORK_DAY_TIME_CHANGED,
        payload: {
          day: data.workDay.day,
          time: data.workDay.activities.reduce(
            (total, a) => total + a.hours * 60 + a.minutes,
            0
          ),
        },
      });
  }, [dispatch, data]);

  if (loading) {
    return <LoadingContent />;
  }

  if (error) {
    return (
      <div className="row">
        <div className="col alert alert-danger centered" role="alert">
          {errorToMessages(error).map((e) => (
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

  const onActivityUpdated = async (activityData) => {
    try {
      setErrors([]);
      await updateActivity({
        variables: {
          workDay: data.workDay.id,
          ...activityData,
        },
      });
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  const onActivityRemoved = async (id) => {
    try {
      setErrors([]);
      await removeActivity({
        variables: { id },
      });
    } catch (ex) {
      setErrors(errorToMessages(ex));
    }
  };

  const onAddActivityClick = async () => {
    if (subsystems && subsystems.length && subsystems[0].id) {
      onActivityUpdated({
        subsystem: subsystems[0].id,
        time: "00:00",
      });
    } else {
      setErrors([
        "Нет доступных подсистем для списания времени. Обратитесь к руководителю проекта",
      ]);
    }
  };

  return (
    <div className="card day-card">
      <div className="card-header day-card-bg">
        {errors.length > 0 && (
          <div className="row">
            <div className="col alert alert-danger centered" role="alert">
              {errors.map((e) => (
                <span key={e}>{e}</span>
              ))}
            </div>
          </div>
        )}
        <div className="row align-items-center">
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
            <div className="row align-items-center justify-content-between">
              <div className="col-auto expander-symbol">»</div>
              <div className="col row align-items-center justify-content-between">
                <div className="col-auto no-padding">
                  {dayToTitle(dt.day())}
                </div>
                <div className="col-auto no-padding">
                  {dt.format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="col-auto">{minutesToString(totalWorkTime)}</div>
            </div>
          </button>
        </div>
      </div>
      <div id={blockId} className={`collapse ${collapsed ? "" : "show"}`}>
        <div className="card-body">
          {data.workDay.activities.map((a) => (
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
              onClick={onAddActivityClick}
            >
              ＋ Добавить деятельность
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
