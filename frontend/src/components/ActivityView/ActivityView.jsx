import React, { useState } from "react";

import TimeInput from "../TimeInput";

import "./ActivityView.css";
import "../common.css";

export default function ActivityView({
  id,
  hours,
  minutes,
  comment: initialComment,
  subsystem,
  subsystems,
  onRemove,
  onUpdate
}) {
  const [comment, setComment] = useState(initialComment);

  const updateAction = updatedData =>
    onUpdate({
      uid: id,
      comment,
      subsystem,
      time: `${hours}:${minutes}`,
      ...updatedData
    });

  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="row align-items-center justify-content-around">
          <select
            className="col-lg-6 col-10 custom-select"
            value={subsystem}
            onChange={e => updateAction({ subsystem: e.target.value })}
          >
            {subsystems.map(s => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
          <div className="col-lg-5 col-12 order-lg-1 order-2 vertical-offset-lg">
            <TimeInput
              hours={hours}
              minutes={minutes}
              onTimeChange={({ hour, minute }) =>
                updateAction({ time: `${hour}:${minute}` })
              }
            />
          </div>
          <button
            type="button"
            className="col-auto order-lg-2 order-1 btn btn-danger no-box-shadow"
            onClick={() => onRemove(id)}
          >
            <b>✖</b>
          </button>
        </div>
      </div>
      <div className="card-body">
        <textarea
          className="form-control"
          value={comment || ""}
          onChange={e => setComment(e.target.value)}
          onBlur={() => updateAction({ comment })}
        ></textarea>
      </div>
    </div>
  );
}
